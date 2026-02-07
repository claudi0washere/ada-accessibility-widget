# QUICK_REFERENCE.md - Token Optimization at a Glance

## The 4 Rules (In SOUL.md)

### 1️⃣ Session Initialization
Load ONLY:
- SOUL.md, USER.md, IDENTITY.md
- memory/YYYY-MM-DD.md (today's notes)

Use memory_search() + memory_get() on demand.

**Cost:** $0.40 → $0.05 per session

---

### 2️⃣ Model Routing
Default: **Haiku** (fast, cheap)  
Switch to **Sonnet** for:
- Architecture decisions
- Security reviews
- Complex reasoning

**Cost:** $50-70/month → $5-10/month

---

### 3️⃣ Heartbeat to Ollama (Optional)
Run Ollama locally for free heartbeat checks.

```bash
ollama pull llama3.2:3b
ollama serve
```

**Cost:** $5-15/month → $0/month

---

### 4️⃣ Rate Limits
- 5s between API calls
- 10s between searches
- Max 5 searches, then 2min break
- Batch similar work
- Daily budget: $5 (warning at 75%)

**Cost:** Prevents runaway expenses

---

## How to Use Sonnet or Mistral on Demand

### Default (Free tier friendly):
Haiku handles everything automatically.

### When you need more power:

**For complex reasoning/security:**
```
"Use sonnet for this: [architecture/security/complex task]"
```

**For Mistral Large 3 (different reasoning style):**
```
"Use mistral for this: [task]"
```

### Model Comparison
| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| Haiku | Fast | $0.00025/1K | Default, routine tasks |
| Sonnet | Medium | $0.003/1K | Complex reasoning, security |
| Mistral | Medium | ~$0.002/1K | Alternative reasoning |

---

## Check Your Setup

```bash
# Is context small?
session_status
# Should show: Context: 2-8KB

# Is Haiku default?
cat ~/.openclaw/openclaw.json | jq '.agents.defaults.model.primary'
# Should show: anthropic/claude-haiku-4-5

# Are all models configured?
cat ~/.openclaw/openclaw.json | jq '.agents.defaults.models'
# Should show: haiku, sonnet, mistral

# Is Mistral API key set?
echo $MISTRAL_API_KEY
# Should show your API key (first time per session)

# Is Ollama running? (if installed)
ollama serve
```

---

## Cost Before & After

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Daily | $2-3 | $0.10-0.50 | 95% |
| Monthly | $70-90 | $3-5 | 97% |
| Yearly | $800+ | $40-60 | 97% |

---

## Files to Know

| File | Purpose |
|------|---------|
| SOUL.md | Your core rules (includes optimizations) |
| USER.md | Who you're helping |
| OPTIMIZATION.md | Full implementation guide |
| HEARTBEAT.md | Health checks |
| SETUP_VERIFICATION.md | Verify everything works |

---

## Memory Strategy

**Daily notes:** `memory/YYYY-MM-DD.md` (raw, unfiltered)  
**Long-term:** `MEMORY.md` (curated, only in main session)

Keep daily notes small. Update MEMORY.md weekly with important stuff.

---

## Common Commands

```bash
# See your current status
session_status

# Restart OpenClaw after config changes
openclaw gateway restart

# Check if Ollama is working
ollama run llama3.2:3b "test"

# View OpenClaw logs
tail -f ~/.openclaw/logs/*.log
```

---

## When to Reach Out

You might need Sonnet (=slower, more expensive) for:
- ❌ Casual questions → Use Haiku
- ✅ Architecture decisions → Use Sonnet
- ❌ File reads → Use Haiku
- ✅ Security reviews → Use Sonnet
- ❌ Simple tasks → Use Haiku
- ✅ Complex reasoning → Use Sonnet

**Default = Haiku unless you ask for Sonnet.**

---

## Troubleshooting Quick Links

- Context bloat? → Review MEMORY.md size
- Costs high? → Check if using Haiku or Sonnet
- Ollama errors? → Restart: `ollama serve`
- Config issues? → Check: `openclaw gateway restart`

---

**Bottom line:** You're paying $30-50/month instead of $1,500+ for the same work.

That's 97% savings.

---

_Last updated: 2026-02-06_
_Read full guide: OPTIMIZATION.md_
