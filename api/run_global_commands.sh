#!/bin/sh

echo "🐝 [GLOBAL] Bee patrol started."

PSQL="psql -h $DB_HOST -U $DB_USER -d $DB -t -c"

export PGPASSWORD=$DB_PASSWORD
export DOCTL_ACCESS_TOKEN=$DOCTL_TOKEN

contexts=$($PSQL "SELECT name FROM contexts;")
commands=$($PSQL "SELECT name, command FROM global_commands;")

echo "$commands" | while IFS='|' read -r name command; do
  echo "Real, $command"

  if [ -n "$command" ]; then
    if echo "$command" | grep -q "{namespace}"; then
      echo "🪓 [CONTEXT] Executing [$name]: $command"
      for context in $contexts; do
        kubectl config use-context do-ams3-$context
        namespaces=$($PSQL "SELECT ns.name FROM namespaces ns WHERE POSITION(ns.context IN '$context') > 0;" | xargs -n1)
        
        for ns in $namespaces; do
          ns_command=$(echo "$command" | sed "s/{namespace}/$ns/g")
          echo "🪓 Executing [$name in $ns]: $ns_command"
          output=$(eval "$ns_command" 2>&1)
          exit_code=$?

          echo "$output"

          if [ $exit_code -ne 0 ]; then
              status="down"
          elif echo "$output" | grep -qE "Error|error|failed|BackOff|Insufficient"; then
              status="down"
          elif echo "$output" | grep -qE "Unhealthy|Killing|do not meet"; then
              status="degraded"
          else
              status="operational"
          fi

          safe_output=$(echo "$output" | sed "s/'/''/g")
          safe_command=$(echo "$ns_command" | sed "s/'/''/g")
          $PSQL "INSERT INTO local_log (context, name, namespace, event, command, app, pod, status) VALUES ('$context', '$name', '$ns', '$safe_output', '$safe_command', null, null, '$status');"
        done
      done
    else
      echo "🪓 [GLOBAL] Executing [$name]: $command"

      output=$(eval "$command" 2>&1)
      exit_code=$?

      echo "$output"

      if [ $exit_code -ne 0 ]; then
          status="down"
      elif echo "$output" | grep -qE "Error|error|failed|BackOff|Insufficient"; then
          status="down"
      elif echo "$output" | grep -qE "Unhealthy|Killing|do not meet"; then
          status="degraded"
      else
          status="operational"
      fi

      safe_output=$(echo "$output" | sed "s/'/''/g")

      $PSQL "INSERT INTO global_log (name, event, command, status) VALUES ('$name', '$safe_output', '$command', '$status');"
    fi
  fi
done

echo "🐝 [GLOBAL] Bee patrol ended."
