from typing import Dict, Optional

from pydantic import BaseModel


class Location(BaseModel):
  city: str
  state: str
  lat: float
  lng: float


class Customer(BaseModel):
  id: int
  name: str
  tier: str
  MRR: int
  csm: str
  location: Location
  status: str
  health_score: float


class UsageRecord(BaseModel):
  id: int
  customer_id: int
  month: str
  inspections: int
  damage_rate: float
  active_drivers: int
  api_calls: int
  growth: float


class TicketRecord(BaseModel):
  id: int
  customer_id: int
  subject: str
  priority: str
  channel: str
  status: str
  csat: Optional[float]
  age_days: int
  created_at: str
  resolution_hours: Optional[int]


class FleetRecord(BaseModel):
  id: int
  customer_id: int
  total_vehicles: int
  vehicle_types: Dict[str, int]
  telematics_provider: str
  fms_platform: str
  avg_fleet_age: float
