#!/bin/sh

echo "🐝 [GLOBAL] Bee patrol started."

PSQL="psql -h postgres -U $DB_USER -d $DB -t -c"

export PGPASSWORD=$DB_PASSWORD
export DOCTL_ACCESS_TOKEN=$DOCTL_TOKEN

echo "PGPASSWORD: $PGPASSWORD"
echo "DOCTL_ACCESS_TOKEN: $DOCTL_ACCESS_TOKEN"

commands=$($PSQL "SELECT name, command FROM global_commands;")

echo "$commands" | while IFS='|' read -r name command; do
  name=$(echo "$name" | xargs)
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

    $PSQL "INSERT INTO global_log (name, event, command, status) VALUES ('$name', '$safe_output', '$command', '$status');"
  fi
done

echo "🐝 [GLOBAL] Bee patrol ended."
