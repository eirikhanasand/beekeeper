#!/bin/sh

echo "🐝 Initiating BeeKeeper."

export PGPASSWORD=$DB_PASSWORD
export DOCTL_ACCESS_TOKEN=$DOCTL_TOKEN

PSQL="psql -h $DB_HOST -U $DB_USER -d $DB -t -c"

doctl auth init --access-token "$DOCTL_ACCESS_TOKEN"

doctl kubernetes cluster kubeconfig save c99a6c23-9137-4d39-895d-108c03cf313a
doctl kubernetes cluster kubeconfig save 0867601a-4f29-44c7-bbc3-2981b2c99239

kubectl config get-contexts | sed 's/^\*//' | tail -n +2 | while read -r line; do
    name=$(echo $line | awk '{print $2}')
    cluster=$(echo $line | awk '{print $3}')
    authinfo=$(echo $line | awk '{print $4}')
    namespace=$(echo $line | awk '{print $5}')
    context_short_name=$(echo $name | sed 's/^do-ams3-//')
    $PSQL "INSERT INTO contexts (name, cluster, authinfo, namespace) VALUES ('$context_short_name', '$cluster', '$authinfo', '$namespace');"

    kubectl config use-context "$name"
    kubectl get ns | tail -n +2 | while read -r line; do
        namespace_name=$(echo $line | awk '{print $1}')
        namespace_status=$(echo $line | awk '{print $2}')
        age=$(echo $line | awk '{print $3}')
        $PSQL "INSERT INTO namespaces (context, name, status, service_status, age) VALUES ('$context_short_name', '$namespace_name', '$namespace_status', 'operational', '$age');"
    
        kubectl get pods -n $namespace_name | tail -n +2 | while read -r line; do
            pod_name=$(echo $line | awk '{print $1}')
            ready=$(echo $line | awk '{print $2}')
            status=$(echo $line | awk '{print $3}')
            restarts=$(echo $line | awk '{print $4}')
            pod_age=$(echo $line | awk '{print $5}')
            $PSQL "INSERT INTO pods (name, ready, status, restarts, age, context, namespace) VALUES ('$pod_name', '$ready', '$status', '$restarts', '$pod_age', '$context_short_name', '$namespace_name');"
        done

    done
done

echo "🐝 Contexts, namespaces and pods added to BeeKeeper."

crond -b

echo "🐝 Started cron."
echo "🐝 BeeKeeper initiated."

npm start
