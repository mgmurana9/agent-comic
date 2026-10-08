#!/usr/bin/env bash
# Rejects SVGs that could run code if opened directly. Args: SVG file paths.
set -uo pipefail
bad=0
for f in "$@"; do
  [ -f "$f" ] || continue
  if grep -Eiq '<script|<foreignobject|<iframe|<embed|<object|\bon[a-z]+[[:space:]]*=|javascript:|data:text/html|<!entity|xlink:href[[:space:]]*=[[:space:]]*"(https?:)?//|href[[:space:]]*=[[:space:]]*"(https?:)?//' "$f"; then
    echo "unsafe svg: $f"; bad=1
  fi
done
exit $bad
