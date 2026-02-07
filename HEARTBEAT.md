# HEARTBEAT.md - Periodic Health Checks

This file defines what to check during heartbeat pings. Rotate through these checks to stay aware without spamming API calls.

## Optimization Health Checks

*Batch these together every 2-4 hours—pick 2-3 per heartbeat:*

### Check 1: Context Size Health
**When:** 2x daily  
**What:** Is session startup bloated?  
**How:** Run `session_status` and verify context < 8KB

### Check 2: Memory File Organization
**When:** Daily  
**What:** Any daily memory files that should be archived?  
**How:** 
- Check if memory/YYYY-MM-DD.md exists for today
- Verify no OLD daily files (>7 days old) are accumulating
- Note: MEMORY.md is curated long-term—don't delete it

### Check 3: Cost Tracking
**When:** Weekly  
**What:** Are costs staying in $0.10-0.30/day range?  
**How:** Review recent API usage (check Anthropic dashboard if available)

### Check 4: Ollama Status (if installed)
**When:** Daily (if heartbeat→Ollama enabled)  
**What:** Is Ollama running without errors?  
**How:** Verify no heartbeat failure logs from last 24h

### Check 5: Cache Hit Rate
**When:** Weekly  
**What:** Are cached prompts being reused?  
**How:** Run `session_status` and look for cache metrics (target > 80%)

---

## Stay Silent When

- Late night (23:00-08:00) unless urgent  
- You checked < 30 minutes ago  
- Nothing new or concerning  
- User is clearly busy  
- All metrics normal  

**Default:** Reply `HEARTBEAT_OK` if nothing needs attention.

---

## Template: When Something Needs Attention

Example (don't send unless real):
```
📊 Health Check Alert
- Context bloat detected: 12KB (target: <8KB)
  → Review MEMORY.md size and recent daily notes
- Ollama status: Last heartbeat failed 3h ago
  → Restart: ollama serve
```

---

## Notes

- These are examples—customize based on your actual workflow
- **Goal:** Catch problems early, not create busywork
- **Philosophy:** Be helpful, not noisy
