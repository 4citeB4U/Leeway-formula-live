#!/data/data/com.termux/files/usr/bin/bash
# LEEWAY HEADER — DO NOT REMOVE
# REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
# TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.L1_PHONE_SHADOW.CONTROL
# WHAT: Start/stop/status control for the live observe-only phone shadow
# WHY: Provide explicit rollback and detached execution for physical testing
# WHO: Leeway Industries / Creator-authorized Agent Lee research runtime
# WHERE: experiments/machine-consciousness-live-shadow-v0/live-shadow-control.sh
# WHEN: 2026-10-01 onward
# HOW: PID file + detached Node process + localhost health check

set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
PIDFILE="$HERE/outputs/live-shadow.pid"
LOG="$HERE/outputs/live-shadow.log"
NODE="/data/data/com.termux/files/usr/bin/node"
APP="$HERE/live-shadow.mjs"

alive() {
  [ -f "$PIDFILE" ] || return 1
  PID="$(cat "$PIDFILE" 2>/dev/null || true)"
  [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null
}

case "${1:-status}" in
  start)
    if alive; then echo "LIVE_SHADOW_ALREADY_RUNNING pid=$(cat "$PIDFILE")"; exit 0; fi
    rm -f "$PIDFILE"
    nohup "$NODE" "$APP" >>"$LOG" 2>&1 &
    PID=$!
    echo "$PID" >"$PIDFILE"
    sleep 1
    if ! kill -0 "$PID" 2>/dev/null; then
      echo "LIVE_SHADOW_START_FAILED"; tail -40 "$LOG" || true; exit 1
    fi
    echo "LIVE_SHADOW_STARTED pid=$PID url=http://127.0.0.1:8789/"
    ;;
  stop)
    if alive; then PID="$(cat "$PIDFILE")"; kill "$PID"; sleep 1; echo "LIVE_SHADOW_STOPPED pid=$PID"; else echo "LIVE_SHADOW_NOT_RUNNING"; fi
    rm -f "$PIDFILE"
    ;;
  status)
    if alive; then echo "LIVE_SHADOW_RUNNING pid=$(cat "$PIDFILE")"; curl -sS http://127.0.0.1:8789/api/state || true; else echo "LIVE_SHADOW_NOT_RUNNING"; fi
    ;;
  *)
    echo "usage: $0 start|stop|status" >&2; exit 2
    ;;
esac