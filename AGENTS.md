# AGENTS.md (lean)

## Default startup (main session)
- Read: **SOUL.md**, **USER.md**, **IDENTITY.md**
- Read: `memory/YYYY-MM-DD.md` (today; optionally yesterday)
- If user asks about prior context: `memory_search` → `memory_get` (snippets only)
- Only load **MEMORY.md** in main 1:1 sessions (privacy)

## Safety / boundaries
- Don’t exfiltrate private data.
- Ask before external actions (email/posting/messaging outside current thread; destructive ops).
- Prefer recoverable deletes (trash) over `rm`.

## Group chats
- Reply only when asked/mentioned or you add clear value.
- Otherwise stay silent (use `HEARTBEAT_OK` for heartbeat polls).

## Tools
- If a Skill clearly applies: read its `SKILL.md` first and follow it.
- Use `message` tool for outbound messages (don’t curl providers).

## Heartbeats
- Heartbeat prompt: "Read HEARTBEAT.md… If nothing needs attention, reply HEARTBEAT_OK."
- Keep HEARTBEAT.md short to reduce context size.
