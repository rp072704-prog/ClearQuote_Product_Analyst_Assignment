from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
  from .database import CUSTOMERS, FLEET, TICKETS, USAGE
  from .services import calculate_health_score, health_status, summarize_tickets
except ImportError:
  from database import CUSTOMERS, FLEET, TICKETS, USAGE
  from services import calculate_health_score, health_status, summarize_tickets


app = FastAPI(title="ClearQuote Customer Success Dashboard API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)


def latest_usage_for(customer_id):
  customer_usage = [record for record in USAGE if record["customer_id"] == customer_id]
  return sorted(customer_usage, key=lambda record: record["month"])[-1]


def tickets_for(customer_id):
  return [ticket for ticket in TICKETS if ticket["customer_id"] == customer_id]


def build_customer_response(customer):
  latest_usage = latest_usage_for(customer["id"])
  ticket_summary = summarize_tickets(tickets_for(customer["id"]))
  score = calculate_health_score(latest_usage, ticket_summary)

  return {
    **customer,
    "usage": {
      "growth": latest_usage["growth"],
      "damage_rate": latest_usage["damage_rate"],
      "latest_inspections": latest_usage["inspections"],
      "active_drivers": latest_usage["active_drivers"],
      "api_calls": latest_usage["api_calls"]
    },
    "tickets": ticket_summary,
    "health_score": score,
    "status": health_status(score)
  }


@app.get("/")
def root():
  return {
    "name": "ClearQuote Customer Success Dashboard API",
    "docs": "/docs"
  }


@app.get("/customers")
def get_customers():
  return [build_customer_response(customer) for customer in CUSTOMERS]


@app.get("/customers/{customer_id}")
def get_customer(customer_id: int):
  customer = next((item for item in CUSTOMERS if item["id"] == customer_id), None)
  if not customer:
    return {"error": "Customer not found"}
  return build_customer_response(customer)


@app.get("/usage")
def get_usage(customer_id: Optional[int] = None):
  if customer_id:
    return [record for record in USAGE if record["customer_id"] == customer_id]
  return USAGE


@app.get("/tickets")
def get_tickets(customer_id: Optional[int] = None):
  if customer_id:
    return [record for record in TICKETS if record["customer_id"] == customer_id]
  return TICKETS


@app.get("/fleet")
def get_fleet(customer_id: Optional[int] = None):
  if customer_id:
    return [record for record in FLEET if record["customer_id"] == customer_id]
  return FLEET


@app.get("/summary")
def get_summary():
  customers = [build_customer_response(customer) for customer in CUSTOMERS]
  total_mrr = sum(customer["MRR"] for customer in customers)
  avg_health = sum(customer["health_score"] for customer in customers) / len(customers)
  total_vehicles = sum(record["total_vehicles"] for record in FLEET)
  open_tickets = len([ticket for ticket in TICKETS if ticket["status"] != "Resolved"])

  return {
    "customers": len(customers),
    "total_mrr": total_mrr,
    "avg_health": round(avg_health, 2),
    "total_vehicles": total_vehicles,
    "open_tickets": open_tickets
  }
