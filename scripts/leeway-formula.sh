#!/usr/bin/env sh
set -eu
BASE_URL="${LEEWAY_FORMULA_BASE_URL:-http://127.0.0.1:4001}"
ACTION="${1:-health}"
case "$ACTION" in
  health) curl -fsS "$BASE_URL/runtime/formula/v1/health" ;;
  evaluate)
    [ "$#" -ge 2 ] || { echo "evaluate requires a JSON request body" >&2; exit 2; }
    curl -fsS -X POST -H 'content-type: application/json' --data "$2" "$BASE_URL/runtime/formula/v1/evaluate"
    ;;
  *) echo "usage: $0 health | evaluate '<json>'" >&2; exit 2 ;;
esac
