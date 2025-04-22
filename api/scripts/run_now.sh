#!/bin/sh

echo "🐝 BeeKeeping started."

CMD="$1"

if [ -z "$CMD" ]; then
  echo "No command passed to run_now.sh"
  exit 1
fi

echo "Executing command: $CMD"

sh -c "$CMD"

echo "🐝 BeeKeeping ended."
