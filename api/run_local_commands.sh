#!/bin/sh

echo "🐝 [LOCAL] Bee patrol started."

PSQL="psql -h postgres -U $DB_USER -d $DB -t -c"

export PGPASSWORD=$DB_PASSWORD
export DOCTL_ACCESS_TOKEN=$DOCTL_TOKEN

commands=$($PSQL "SELECT context, name, namespace, command FROM local_commands;")

echo "$commands" | while IFS='|' read -r context name namespace command; do
  context=$(echo "$context" | xargs)
  name=$(echo "$name" | xargs)
  namespace=$(echo "$namespace" | xargs)
  command=$(echo "$command" | xargs)

  if [ -n "$command" ]; then
    echo "🪓 Executing [$name]: $command"

    output=$(eval "$command" 2>&1)
    exit_code=$?

    echo "$output"

    # add custom logic for end user (if output contains i.g. 'abc' its failed)
    if [ $exit_code -ne 0 ]; then
        status="down"
    elif echo "$output" | grep -qE "Error|error|failed|BackOff"; then
        status="down"
    elif echo "$output" | grep -qE "Unhealthy|Killing|do not meet"; then
        status="degraded"
    else
        status="operational"
    fi

    safe_output=$(echo "$output" | sed "s/'/''/g")

    $PSQL "INSERT INTO local_log (context, name, namespace, event, command, app, pod, status) VALUES ('$context', '$name', '$namespace', '$safe_output', '$command', null, null, '$status');"
  fi
done

echo "🐝 [LOCAL] Bee patrol ended."
