def _clamp(value, minimum=0, maximum=1):
  return max(minimum, min(maximum, value))


def calculate_health_score(usage, tickets):
  usage_growth = usage.get("growth", 0)
  damage_rate = usage.get("damage_rate", 0)
  csat = tickets.get("avg_csat", 0)
  resolution_speed = tickets.get("resolution_speed", 0)

  score = (
      0.4 * _clamp(usage_growth) +
      0.3 * (1 - _clamp(damage_rate)) +
      0.2 * _clamp(csat) +
      0.1 * _clamp(resolution_speed)
  ) * 100

  return round(score, 2)


def health_status(score):
  if score < 40:
    return "At Risk"
  if score < 70:
    return "Watch"
  return "Healthy"


def summarize_tickets(tickets):
  if not tickets:
    return {
      "open_count": 0,
      "recent_count": 0,
      "avg_csat": 0.78,
      "resolution_speed": 0.78
    }

  csat_scores = [ticket["csat"] / 5 for ticket in tickets if ticket.get("csat")]
  resolution_scores = [
    max(0, min(1, 1 - (ticket["resolution_hours"] / 120)))
    for ticket in tickets
    if ticket.get("resolution_hours") is not None
  ]

  return {
    "open_count": len([ticket for ticket in tickets if ticket["status"] != "Resolved"]),
    "recent_count": len([ticket for ticket in tickets if ticket["age_days"] <= 14]),
    "avg_csat": round(sum(csat_scores) / len(csat_scores), 3) if csat_scores else 0.68,
    "resolution_speed": round(sum(resolution_scores) / len(resolution_scores), 3)
    if resolution_scores
    else 0.62
  }
