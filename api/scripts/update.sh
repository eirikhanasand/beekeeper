#!/bin/sh

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
    $PSQL "INSERT INTO contexts_staging (name, cluster, authinfo, namespace) VALUES ('$context_short_name', '$cluster', '$authinfo', '$namespace');"

    kubectl config use-context "$name"
    kubectl get ns | tail -n +2 | while read -r line; do
        namespace_name=$(echo $line | awk '{print $1}')
        namespace_status=$(echo $line | awk '{print $2}')
        age=$(echo $line | awk '{print $3}')
        $PSQL "INSERT INTO namespaces_staging (context, name, status, service_status, age) VALUES ('$context_short_name', '$namespace_name', '$namespace_status', 'operational', '$age');"
    
        kubectl get pods -n $namespace_name | tail -n +2 | while read -r line; do
            pod_name=$(echo $line | awk '{print $1}')
            ready=$(echo $line | awk '{print $2}')
            status=$(echo $line | awk '{print $3}')
            restarts=$(echo $line | awk '{print $4}')
            pod_age=$(echo $line | awk '{print $5}')
            $PSQL "INSERT INTO pods_staging (name, ready, status, restarts, age, context, namespace) VALUES ('$pod_name', '$ready', '$status', '$restarts', '$pod_age', '$context_short_name', '$namespace_name');"
        done

        kubectl get ingress -n $namespace_name | tail -n +2 | while read -r line; do
            ingress_name=$(echo $line | awk '{print $1}')
            class=$(echo $line | awk '{print $2}')
            hosts=$(echo $line | awk '{print $3}')
            address=$(echo $line | awk '{print $4}')
            ports=$(echo $line | awk '{print $5 $6}')
            age=$(echo $line | awk '{print $7}')
            $PSQL "INSERT INTO ingress_staging (context, namespace, name, class, hosts, address, ports, age) VALUES ('$context_short_name', '$namespace_name', '$ingress_name', '$class', '$hosts', '$address', '$ports', '$age');"
            $PSQL "INSERT INTO domains_staging (name, url, context, namespace) VALUES ('$ingress_name', '$hosts', '$context_short_name', '$namespace_name');"
        done

        for ingress in $(kubectl get ingress -n beehive -o name); do
            echo "🐝 Swarming $ingress"
            events=$(kubectl describe $ingress -n beehive | awk '/Events:/ {flag=1; next} /^$/ {flag=0} flag' | grep -v '<none>')
            if [ -n "$events" ]; then
                echo "🚩 Events found:"
                echo "$events"
                $PSQL "INSERT INTO ingress_events_staging (context, namespace, name, events) VALUES ('$context_short_name', '$namespace_name', '$ingress', '$events');"
            else
                echo "🐝 No events"
            fi
            echo "-------------------------------"
        done
    done
done

$PSQL_MULTILINE <<EOF
BEGIN;
TRUNCATE pods, namespaces, contexts CASCADE;
INSERT INTO contexts SELECT * FROM contexts_staging;
INSERT INTO namespaces SELECT * FROM namespaces_staging;
INSERT INTO pods SELECT * FROM pods_staging;
INSERT INTO namespace_ingress SELECT * FROM ingress_staging;
INSERT INTO namespace_domains SELECT * FROM domains_staging;
INSERT INTO namespace_ingress_events SELECT * FROM ingress_events_staging;
COMMIT;
EOF

echo "🐝 Updated pods for BeeKeeper."

echo "🐝 BeeKeeper updated."

