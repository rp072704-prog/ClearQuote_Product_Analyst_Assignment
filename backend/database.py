from datetime import date, timedelta


CUSTOMERS = [
  {"id": 1, "name": "ABC Logistics", "tier": "Gold", "MRR": 5000, "csm": "Maya Patel", "location": {"city": "Austin", "state": "TX", "lat": 30.2672, "lng": -97.7431}},
  {"id": 2, "name": "BlueRidge Couriers", "tier": "Silver", "MRR": 3600, "csm": "Jordan Lee", "location": {"city": "Charlotte", "state": "NC", "lat": 35.2271, "lng": -80.8431}},
  {"id": 3, "name": "MetroMile Delivery", "tier": "Platinum", "MRR": 9200, "csm": "Priya Shah", "location": {"city": "New York", "state": "NY", "lat": 40.7128, "lng": -74.0060}},
  {"id": 4, "name": "Evergreen Dispatch", "tier": "Gold", "MRR": 6100, "csm": "Chris Morgan", "location": {"city": "Seattle", "state": "WA", "lat": 47.6062, "lng": -122.3321}},
  {"id": 5, "name": "Sunset Parcel Co.", "tier": "Growth", "MRR": 2800, "csm": "Lena Brooks", "location": {"city": "Los Angeles", "state": "CA", "lat": 34.0522, "lng": -118.2437}},
  {"id": 6, "name": "Great Lakes Freight", "tier": "Gold", "MRR": 7200, "csm": "Maya Patel", "location": {"city": "Chicago", "state": "IL", "lat": 41.8781, "lng": -87.6298}},
  {"id": 7, "name": "PeakRoute Express", "tier": "Silver", "MRR": 3900, "csm": "Jordan Lee", "location": {"city": "Denver", "state": "CO", "lat": 39.7392, "lng": -104.9903}},
  {"id": 8, "name": "Coastal Drop", "tier": "Growth", "MRR": 2400, "csm": "Priya Shah", "location": {"city": "San Diego", "state": "CA", "lat": 32.7157, "lng": -117.1611}},
  {"id": 9, "name": "LoneStar Last Mile", "tier": "Gold", "MRR": 5800, "csm": "Chris Morgan", "location": {"city": "Dallas", "state": "TX", "lat": 32.7767, "lng": -96.7970}},
  {"id": 10, "name": "Capital City Cargo", "tier": "Silver", "MRR": 4100, "csm": "Lena Brooks", "location": {"city": "Washington", "state": "DC", "lat": 38.9072, "lng": -77.0369}},
  {"id": 11, "name": "Midtown Fleetworks", "tier": "Platinum", "MRR": 10100, "csm": "Maya Patel", "location": {"city": "Atlanta", "state": "GA", "lat": 33.7490, "lng": -84.3880}},
  {"id": 12, "name": "PrairieShip", "tier": "Growth", "MRR": 2600, "csm": "Jordan Lee", "location": {"city": "Omaha", "state": "NE", "lat": 41.2565, "lng": -95.9345}},
  {"id": 13, "name": "BayBridge Logistics", "tier": "Gold", "MRR": 7900, "csm": "Priya Shah", "location": {"city": "San Francisco", "state": "CA", "lat": 37.7749, "lng": -122.4194}},
  {"id": 14, "name": "DesertDash", "tier": "Silver", "MRR": 3400, "csm": "Chris Morgan", "location": {"city": "Phoenix", "state": "AZ", "lat": 33.4484, "lng": -112.0740}},
  {"id": 15, "name": "Music City Movers", "tier": "Gold", "MRR": 5600, "csm": "Lena Brooks", "location": {"city": "Nashville", "state": "TN", "lat": 36.1627, "lng": -86.7816}},
  {"id": 16, "name": "HarborHaul", "tier": "Platinum", "MRR": 8700, "csm": "Maya Patel", "location": {"city": "Boston", "state": "MA", "lat": 42.3601, "lng": -71.0589}},
  {"id": 17, "name": "RiverRun Delivery", "tier": "Silver", "MRR": 3700, "csm": "Jordan Lee", "location": {"city": "St. Louis", "state": "MO", "lat": 38.6270, "lng": -90.1994}},
  {"id": 18, "name": "GulfLine Couriers", "tier": "Growth", "MRR": 2200, "csm": "Priya Shah", "location": {"city": "New Orleans", "state": "LA", "lat": 29.9511, "lng": -90.0715}},
  {"id": 19, "name": "IronRange Fleet", "tier": "Gold", "MRR": 6400, "csm": "Chris Morgan", "location": {"city": "Minneapolis", "state": "MN", "lat": 44.9778, "lng": -93.2650}},
  {"id": 20, "name": "Queen City Parcel", "tier": "Silver", "MRR": 3300, "csm": "Lena Brooks", "location": {"city": "Cincinnati", "state": "OH", "lat": 39.1031, "lng": -84.5120}},
  {"id": 21, "name": "Rainier Route", "tier": "Gold", "MRR": 6900, "csm": "Maya Patel", "location": {"city": "Portland", "state": "OR", "lat": 45.5152, "lng": -122.6784}},
  {"id": 22, "name": "Gateway DropShip", "tier": "Growth", "MRR": 2900, "csm": "Jordan Lee", "location": {"city": "Kansas City", "state": "MO", "lat": 39.0997, "lng": -94.5786}},
  {"id": 23, "name": "Liberty Logistics", "tier": "Platinum", "MRR": 9600, "csm": "Priya Shah", "location": {"city": "Philadelphia", "state": "PA", "lat": 39.9526, "lng": -75.1652}},
  {"id": 24, "name": "OrangeTrail Express", "tier": "Silver", "MRR": 4200, "csm": "Chris Morgan", "location": {"city": "Orlando", "state": "FL", "lat": 28.5383, "lng": -81.3792}},
  {"id": 25, "name": "MotorCity SameDay", "tier": "Gold", "MRR": 6700, "csm": "Lena Brooks", "location": {"city": "Detroit", "state": "MI", "lat": 42.3314, "lng": -83.0458}},
  {"id": 26, "name": "Triangle Transport", "tier": "Silver", "MRR": 3500, "csm": "Maya Patel", "location": {"city": "Raleigh", "state": "NC", "lat": 35.7796, "lng": -78.6382}},
  {"id": 27, "name": "Alamo Fleet", "tier": "Growth", "MRR": 3100, "csm": "Jordan Lee", "location": {"city": "San Antonio", "state": "TX", "lat": 29.4241, "lng": -98.4936}},
  {"id": 28, "name": "SteelCity Routes", "tier": "Gold", "MRR": 5900, "csm": "Priya Shah", "location": {"city": "Pittsburgh", "state": "PA", "lat": 40.4406, "lng": -79.9959}},
  {"id": 29, "name": "ValleyZip", "tier": "Growth", "MRR": 2100, "csm": "Chris Morgan", "location": {"city": "Fresno", "state": "CA", "lat": 36.7378, "lng": -119.7871}},
  {"id": 30, "name": "SpaceCoast Logistics", "tier": "Platinum", "MRR": 8900, "csm": "Lena Brooks", "location": {"city": "Miami", "state": "FL", "lat": 25.7617, "lng": -80.1918}}
]

MONTHS = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05",
  "2025-06", "2025-07", "2025-08", "2025-09", "2025-10",
  "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"
]

RISKY_CUSTOMERS = {8, 18, 29}
WATCH_CUSTOMERS = {10, 12, 14, 20, 22, 27}


def build_usage_data():
  records = []
  record_id = 1

  for customer in CUSTOMERS:
    customer_id = customer["id"]
    base = 180 + (customer_id * 37) % 260
    trend = 11 + (customer_id % 6) * 4
    growth_score = 0.58 + (customer_id % 8) * 0.045
    damage_base = 0.035 + (customer_id % 7) * 0.009

    if customer_id in WATCH_CUSTOMERS:
      growth_score = 0.42 + (customer_id % 3) * 0.04
      damage_base = 0.12 + (customer_id % 3) * 0.025

    if customer_id in RISKY_CUSTOMERS:
      growth_score = 0.16 + (customer_id % 2) * 0.04
      damage_base = 0.36 + (customer_id % 3) * 0.04
      trend = -3

    for month_index, month in enumerate(MONTHS):
      seasonal = ((month_index % 4) - 1) * 18
      inspections = max(35, base + trend * month_index + seasonal)
      damage_rate = max(0.01, min(0.55, damage_base + ((month_index + customer_id) % 5) * 0.004))
      active_drivers = max(8, round(inspections / (11 + customer_id % 4)))
      api_calls = inspections * (9 + customer_id % 5) + month_index * (18 + customer_id)

      records.append({
        "id": record_id,
        "customer_id": customer_id,
        "month": month,
        "inspections": int(inspections),
        "damage_rate": round(damage_rate, 3),
        "active_drivers": int(active_drivers),
        "api_calls": int(api_calls),
        "growth": round(growth_score, 3)
      })
      record_id += 1

  return records


def build_ticket_data():
  subjects = [
    "Inspection photo upload issue",
    "Driver cannot access route",
    "Invoice question",
    "Webhook retry support",
    "Damage report dispute",
    "Fleet import request",
    "Slow dashboard load",
    "New CSM handoff note"
  ]
  priorities = ["P3", "P2", "P2", "P1", "P3", "P2"]
  channels = ["Email", "Slack", "Phone", "In-app"]
  statuses = ["Resolved", "Open", "Pending", "Resolved", "Resolved", "Open"]
  today = date(2026, 4, 26)
  records = []

  for index in range(80):
    customer_id = ((index * 7) % len(CUSTOMERS)) + 1
    priority = priorities[(index + customer_id) % len(priorities)]
    status = statuses[(index + customer_id) % len(statuses)]
    age_days = (index * 3 + customer_id) % 45
    resolution_hours = None if status != "Resolved" else 12 + ((index + customer_id) % 8) * 9
    csat = None

    if status == "Resolved":
      base_csat = 3.3 + (customer_id % 5) * 0.32
      if priority == "P1":
        base_csat -= 0.45
      if customer_id in WATCH_CUSTOMERS:
        base_csat -= 0.7
      if customer_id in RISKY_CUSTOMERS:
        base_csat -= 1.35
        resolution_hours = 110
      csat = round(max(1.7, min(5, base_csat)), 1)

    if customer_id in RISKY_CUSTOMERS:
      age_days = max(age_days, 31)
      if status == "Resolved":
        resolution_hours = max(resolution_hours or 0, 110)

    records.append({
      "id": index + 1,
      "customer_id": customer_id,
      "subject": subjects[index % len(subjects)],
      "priority": priority,
      "channel": channels[(index + customer_id) % len(channels)],
      "status": status,
      "csat": csat,
      "age_days": age_days,
      "created_at": (today - timedelta(days=age_days)).isoformat(),
      "resolution_hours": resolution_hours
    })

  return records


def build_fleet_data():
  telematics = ["Geotab", "Samsara", "Verizon Connect", "Motive", "Azuga"]
  platforms = ["Fleetio", "Whip Around", "ClearPath FMS", "Excel Upload", "Custom TMS"]
  records = []

  for customer in CUSTOMERS:
    customer_id = customer["id"]
    vans = 24 + (customer_id * 5) % 90
    box_trucks = 8 + (customer_id * 3) % 36
    cars = 6 + (customer_id * 7) % 28
    evs = 4 + (customer_id * 2) % 24
    total = vans + box_trucks + cars + evs

    records.append({
      "id": customer_id,
      "customer_id": customer_id,
      "total_vehicles": total,
      "vehicle_types": {
        "Vans": vans,
        "Box Trucks": box_trucks,
        "Cars": cars,
        "EVs": evs
      },
      "telematics_provider": telematics[customer_id % len(telematics)],
      "fms_platform": platforms[(customer_id + 2) % len(platforms)],
      "avg_fleet_age": round(2.1 + (customer_id % 9) * 0.55, 1)
    })

  return records


USAGE = build_usage_data()
TICKETS = build_ticket_data()
FLEET = build_fleet_data()
