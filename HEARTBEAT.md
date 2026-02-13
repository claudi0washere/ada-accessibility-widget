# HEARTBEAT.md (lean)

On heartbeat polls, do **2–3 checks max**.

## Checks
1) **Context size**: run `session_status`; target **< 8KB**.
2) **Memory hygiene** (daily): ensure `memory/YYYY-MM-DD.md` exists; no `memory/*.md` older than 7 days piling up.
3) **Costs** (weekly): sanity-check usage/costs.

## Reply rule
- If all normal → reply exactly: `HEARTBEAT_OK`
- If not → send a short alert (3–6 bullets), with 1 best next action.
