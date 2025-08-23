#!/bin/sh

# Conflicts are ignored in staging statements since these are from the current
# script run, and therefore unlikely to require an update (except for pods since
# they change more often).

echo "🐝 Updating BeeKeeper."

export PGPASSWORD=$DB_PASSWORD

PSQL="psql -h $DB_HOST -U $DB_USER -d $DB -t -c"
PSQL_MULTILINE="psql -h $DB_HOST -U $DB_USER -d $DB -t"

$PSQL "TRUNCATE contexts_staging, namespaces_staging, pods_staging, ingress_staging, domains_staging, ingress_events_staging;"

$PSQL "CREATE TABLE IF NOT EXISTS contexts_staging (LIKE contexts INCLUDING ALL);"
$PSQL "CREATE TABLE IF NOT EXISTS namespaces_staging (LIKE namespaces INCLUDING ALL);"
$PSQL "CREATE TABLE IF NOT EXISTS pods_staging (LIKE pods INCLUDING ALL);"
$PSQL "CREATE TABLE IF NOT EXISTS ingress_staging (LIKE namespace_ingress INCLUDING ALL);"
$PSQL "CREATE TABLE IF NOT EXISTS domains_staging (LIKE namespace_domains INCLUDING ALL);"
$PSQL "CREATE TABLE IF NOT EXISTS ingress_events_staging (LIKE namespace_ingress_events INCLUDING ALL);"

kubectl config get-contexts | sed 's/^\*//' | tail -n +2 | while read -r line; do
    name=$(echo $line | awk '{print $2}')
    cluster=$(echo $line | awk '{print $3}')
    authinfo=$(echo $line | awk '{print $4}')
    namespace=$(echo $line | awk '{print $5}')
    context_short_name=$(echo $name | sed 's/^do-ams3-//')
    $PSQL "INSERT INTO contexts_staging (name, cluster, authinfo, namespace) VALUES ('$context_short_name', '$cluster', '$authinfo', '$namespace') ON CONFLICT DO NOTHING;"

    kubectl config use-context "$name"
    kubectl get ns | tail -n +2 | while read -r line; do
        namespace_name=$(echo $line | awk '{print $1}')
        namespace_status=$(echo $line | awk '{print $2}')
        age=$(echo $line | awk '{print $3}')
        $PSQL "INSERT INTO namespaces_staging (context, name, status, service_status, age) VALUES ('$context_short_name', '$namespace_name', '$namespace_status', 'operational', '$age') ON CONFLICT DO NOTHING;"
    
        kubectl get pods -n $namespace_name | tail -n +2 | while read -r line; do
            pod_name=$(echo $line | awk '{print $1}')
            ready=$(echo $line | awk '{print $2}')
            status=$(echo $line | awk '{print $3}')
            restarts=$(echo $line | awk '{print $4}')
            pod_age=$(echo $line | awk '{print $5}')
            $PSQL "INSERT INTO pods_staging (name, ready, status, restarts, age, context, namespace)
            VALUES ('$pod_name', '$ready', '$status', '$restarts', '$pod_age', '$context_short_name', '$namespace_name')
            ON CONFLICT (name, context, namespace)
            DO UPDATE SET
            ready = EXCLUDED.ready,
            status = EXCLUDED.status,
            restarts = EXCLUDED.restarts,
            age = EXCLUDED.age,
            timestamp = now();"
        done

        kubectl get ingress -n $namespace_name | tail -n +2 | while read -r line; do
            ingress_name=$(echo $line | awk '{print $1}')
            class=$(echo $line | awk '{print $2}')
            hosts=$(echo $line | awk '{print $3}')
            address=$(echo $line | awk '{print $4}')
            ports=$(echo $line | awk '{print $5 $6}')
            age=$(echo $line | awk '{print $7}')
            $PSQL "INSERT INTO ingress_staging (context, namespace, name, class, hosts, address, ports, age) VALUES ('$context_short_name', '$namespace_name', '$ingress_name', '$class', '$hosts', '$address', '$ports', '$age') ON CONFLICT DO NOTHING;"
            $PSQL "INSERT INTO domains_staging (name, url, context, namespace) VALUES ('$ingress_name', '$hosts', '$context_short_name', '$namespace_name') ON CONFLICT DO NOTHING;"
        done

        for ingress in $(kubectl get ingress -n beehive -o name); do
            echo "🐝 Swarming $ingress"
            events=$(kubectl describe $ingress -n beehive | awk '/Events:/ {flag=1; next} /^$/ {flag=0} flag' | grep -v '<none>')
            if [ -n "$events" ]; then
                echo "🚩 Events found:"
                echo "$events"
                $PSQL "INSERT INTO ingress_events_staging (context, namespace, name, events) VALUES ('$context_short_name', '$namespace_name', '$ingress', '$events') ON CONFLICT DO NOTHING;"
            else
                echo "🐝 No events"
            fi
            echo "--------------------------------------------------------------"
        done
    done
done

$PSQL_MULTILINE <<EOF
BEGIN;
TRUNCATE pods, namespaces, contexts CASCADE;

INSERT INTO contexts (name, cluster, authinfo, namespace)
SELECT name, cluster, authinfo, namespace FROM contexts_staging
ON CONFLICT (name)
DO UPDATE SET
  cluster = EXCLUDED.cluster,
  authinfo = EXCLUDED.authinfo,
  namespace = EXCLUDED.namespace;

INSERT INTO namespaces (context, name, status, service_status, age)
SELECT context, name, status, service_status, age FROM namespaces_staging
ON CONFLICT (context, name)
DO UPDATE SET
  status = EXCLUDED.status,
  service_status = EXCLUDED.service_status,
  age = EXCLUDED.age;

INSERT INTO pods (name, ready, status, restarts, age, context, namespace)
SELECT name, ready, status, restarts, age, context, namespace FROM pods_staging
ON CONFLICT (context, namespace, name)
DO UPDATE SET
  ready = EXCLUDED.ready,
  status = EXCLUDED.status,
  restarts = EXCLUDED.restarts,
  age = EXCLUDED.age,
  timestamp = NOW();

INSERT INTO namespace_ingress (context, namespace, name, class, hosts, address, ports, age)
SELECT context, namespace, name, class, hosts, address, ports, age FROM ingress_staging
ON CONFLICT (context, namespace, name)
DO UPDATE SET
  class = EXCLUDED.class,
  hosts = EXCLUDED.hosts,
  address = EXCLUDED.address,
  ports = EXCLUDED.ports,
  age = EXCLUDED.age;

INSERT INTO namespace_domains (name, url, context, namespace)
SELECT name, url, context, namespace FROM domains_staging
ON CONFLICT (context, namespace, url)
DO UPDATE SET
  name = EXCLUDED.name;

INSERT INTO namespace_ingress_events SELECT * FROM ingress_events_staging;
COMMIT;
EOF

echo "🐝 Updated pods for BeeKeeper."

echo "🐝 BeeKeeper updated."

