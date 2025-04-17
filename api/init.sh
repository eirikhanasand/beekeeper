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
    short_name=$(echo $name | sed 's/^do-ams3-//')
    $PSQL "INSERT INTO contexts (name, cluster, authinfo, namespace) VALUES ('$short_name', '$cluster', '$authinfo', '$namespace');"

    kubectl config use-context "$name"
    kubectl get ns | tail -n +2 | while read -r line; do
        name=$(echo $line | awk '{print $1}')
        namespace_status=$(echo $line | awk '{print $2}')
        age=$(echo $line | awk '{print $3}')
        $PSQL "INSERT INTO namespaces (context, name, status, service_status, age) VALUES ('$short_name', '$name', '$namespace_status', 'operational', '$age');"
    done
done

echo "🐝 Contexts and namespaces added to the BeeKeeper."
echo "🐝 BeeKeeper initiated."
