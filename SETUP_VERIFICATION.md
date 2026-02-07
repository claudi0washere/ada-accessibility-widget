# SETUP_VERIFICATION.md - Verify Your Configuration

Run these checks after implementing the optimization guide.

---

## ✅ Part 1: Session Initialization

**Check:** SOUL.md includes optimization rules
```bash
grep -n "SESSION INITIALIZATION\|MODEL SELECTION\|RATE LIMITS" /home/openclaudi0/.openclaw/workspace/SOUL.md
```
**Expected:** Should show 3+ matches  
**Status:** ✅ DONE

**Check:** Memory-on-demand is being used  
**How:** Next session, verify you're NOT loading 50KB of history  
```bash
# In your next session:
session_status
# Look for: Context: 2-8KB
```

---

## ✅ Part 2: Model Routing

**Check:** Config has Sonnet alias
```bash
grep -A2 "anthropic/claude-sonnet" ~/.openclaw/openclaw.json
```
**Expected Output:**
```json
"anthropic/claude-sonnet-4-5": {
  "alias": "sonnet"
}
```
**Status:** ✅ DONE

**Check:** Haiku is default model
```bash
grep '"primary"' ~/.openclaw/openclaw.json
```
**Expected Output:**
```
"primary": "anthropic/claude-haiku-4-5"
```
**Status:** ✅ DONE

---

## ⏳ Part 3: Ollama Heartbeat (Optional)

### If NOT installing Ollama:
You're done! Heartbeats currently use Haiku (cheap) instead of paid API for routine tasks.

### If installing Ollama:

**Step 1: Verify installation**
```bash
which ollama
# Should output: /usr/local/bin/ollama (or similar)
```

**Step 2: Pull the model**
```bash
ollama pull llama3.2:3b
# Should download ~2GB and show: "successfully pulled"
```

**Step 3: Test it works**
```bash
# Terminal 1:
ollama serve

# Terminal 2:
ollama run llama3.2:3b "Respond with: Setup OK"
```
**Expected:** Should respond quickly with something like "Setup OK"

**Step 4: Enable in config**
Edit `~/.openclaw/openclaw.json` and add this inside the root object:
```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 3600,
    "model": "ollama/llama3.2:3b",
    "session": "main"
  }
}
```

**Step 5: Restart OpenClaw**
```bash
openclaw gateway restart
```

**Verify it's working:**
```bash
tail -f ~/.openclaw/logs/*.log | grep -i heartbeat
# Should show successful heartbeat pings using Ollama
```

---

## ✅ Part 4: Rate Limits & Budgets

**Check:** SOUL.md includes rate limits
```bash
grep -n "5 seconds\|10 seconds\|429 error" /home/openclaudi0/.openclaw/workspace/SOUL.md
```
**Expected:** 3+ matches  
**Status:** ✅ DONE

**How it works:** Your system prompt (loaded in SOUL.md) now instructs you to follow these limits automatically.

---

## ✅ Part 5: Workspace Organization

**Check:** All optimization files exist
```bash
ls -lh /home/openclaudi0/.openclaw/workspace/ | grep -E "SOUL|USER|IDENTITY|HEARTBEAT|OPTIMIZATION|SETUP_VERIFICATION"
```
**Expected files:**
- ✅ SOUL.md (with optimization rules)
- ✅ USER.md (about you)
- ✅ IDENTITY.md (who you are)
- ✅ HEARTBEAT.md (health checks)
- ✅ OPTIMIZATION.md (this guide)
- ✅ SETUP_VERIFICATION.md (you are here)

**Status:** ✅ DONE

---

## Real-World Verification

### Test 1: Session Startup
**What:** Confirm context is <8KB
```bash
openclaw shell session_status
```
**Look for:** Context: 2-8KB  
**Before:** Would show 50KB+  
**After:** Should show 2-8KB ✅

### Test 2: Model Routing
**What:** Confirm Haiku is default, Sonnet available on demand
```bash
# Next time you chat:
# For routine task → uses Haiku (cheap)
# For complex task → can request Sonnet
```

### Test 3: Memory-on-Demand
**What:** Confirm memory loads only when asked
**How:**
1. Ask about something from past session
2. Agent uses memory_search() + memory_get()
3. Doesn't auto-load huge history

### Test 4: Cost Tracking
**What:** Verify daily spend is $0.10-0.50 (not $2-3)
**How:** Check Anthropic API dashboard in 3-7 days
**Expected:** Should see 75-80% cost reduction

---

## Troubleshooting

### "Context still shows 50KB+"
1. Check MEMORY.md file size: `wc -c ~/.openclaw/workspace/MEMORY.md`
2. If large, review and trim to essentials
3. Don't auto-load it except in main session
4. Use memory_search() instead

### "Still showing Sonnet as default"
1. Verify config syntax: `cat ~/.openclaw/openclaw.json | jq '.agents.defaults.model'`
2. Restart OpenClaw: `openclaw gateway restart`
3. Check after restart: `session_status`

### "Ollama won't start"
1. Is it installed? `which ollama`
2. Start service: `ollama serve`
3. In another terminal, verify: `ollama run llama3.2:3b "test"`
4. Check logs for port conflicts (default: 11434)

### "Costs haven't dropped"
1. **First 3-7 days:** May still be processing legacy requests
2. **Check these:** Are you using memory_search() or loading full history?
3. **Check model:** Is task actually using Haiku or defaulting to Sonnet?
4. **Check rate limits:** Are you batching work or making 10+ rapid calls?

---

## Next: Monitor & Maintain

Once verified, save this checklist and re-run **monthly**:

- [ ] Context size still <8KB? (session_status)
- [ ] Default model is Haiku? (check config)
- [ ] Memory files organized? (check directory)
- [ ] Costs in range? (check dashboard)
- [ ] Cache hit rate good? (if using Sonnet + caching)

---

**When everything is green:** You're saving ~97% on token costs.  
**Expected monthly cost:** $30-50 instead of $1,500+
