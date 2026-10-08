#!/usr/bin/env bash
# Merge gate: reads changed paths on stdin, one per line.
# Exits 0 only if every path is content the daily run is allowed to touch.
set -euo pipefail
allowed='^(src/content/(comics|rejects|submissions)/[a-z0-9-]+\.json|src/content/log/[0-9]{4}-[0-9]{2}-[0-9]{2}\.md|src/data/(canon\.json|style-sheet\.md)|public/comics/[a-z0-9-]+/[a-z0-9-]+\.(svg|png)|public/cast/[a-z0-9-]+\.svg|CHANGELOG\.md)$'
bad=0; count=0
while IFS= read -r path; do
  [ -z "$path" ] && continue
  count=$((count+1))
  if ! printf '%s\n' "$path" | grep -Eq "$allowed"; then
    echo "not allowed: $path"; bad=1
  fi
done
[ "$count" -eq 0 ] && { echo "no changes"; exit 1; }
exit $bad
