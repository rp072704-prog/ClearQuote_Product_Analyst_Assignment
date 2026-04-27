# Product Requirements Document (PRD)

**Product:** Customer Success Dashboard
**Role:** Product Analyst Assignment

## 1. Problem Statement

The Customer Success (CS) team currently relies on fragmented spreadsheets and manual reports to track customer health, usage, and support activity. This results in:

- Lack of a unified customer view
- Delayed identification of at-risk customers
- Inefficient decision-making
- High manual effort in reporting

There is a need for a centralized dashboard that provides real-time, actionable insights into customer performance and health.

## 2. Objectives
- Provide a single source of truth for customer data
- Enable CS team to quickly identify at-risk customers
- Improve decision-making speed through visual insights
- Reduce manual reporting effort

## 3. Target Users

**Primary Users:**
- Customer Success Managers (CSMs)
- Operations Leads

**User Needs:**
- Quickly assess customer health
- Monitor usage trends
- Track support issues
- Understand fleet composition

## 4. Key Features

### P0 (Must Have)

**1. Customer Overview**
- Customer list with: Name, Tier, MRR, Location, CSM
- Health Score (derived)
- Search & sorting
- At-risk customers section

**2. Usage Metrics**
- Monthly trends: Inspections, Damage rates, Active drivers, API usage
- Growth indicators
- Usage drop alerts

**3. Support & Communication**
- Open and recent tickets
- Ticket attributes: Priority, channel, status
- CSAT score
- Ticket ageing buckets: 0–2 days, 3–7 days, >7 days

**4. Fleet Distribution**
- Vehicle type breakdown
- Telematics provider
- Fleet management system (FMS)
- Average fleet age

### P1 (Should Have)
- Customer Health Score
- Alerts for: High ticket backlog, Usage decline, Low CSAT

### P2 (Optional)
- Google SSO
- Map visualization

## 5. Data Model

The system uses structured relational data:

**Customers**
- `customer_id`
- `name`
- `tier`
- `MRR`
- `location`
- `CSM`

**Usage**
- `customer_id`
- `month`
- `inspections`
- `damage_rate`
- `drivers`
- `api_calls`

**Tickets**
- `ticket_id`
- `customer_id`
- `priority`
- `status`
- `channel`
- `CSAT`
- `created_at`

**Fleet**
- `customer_id`
- `vehicle_type`
- `telematics`
- `FMS`
- `avg_age`

## 6. Derived Metrics

**Customer Health Score**

A composite score to identify customer risk level:
- Usage Growth → 40%
- Damage Rate → 30%
- CSAT → 20%
- Ticket Resolution Speed → 10%

This score is normalized to a 0–100 scale and categorized:
- Green → Healthy
- Yellow → Moderate Risk
- Red → High Risk

## 7. Success Metrics
- Time to identify at-risk customers
- Reduction in manual reporting
- Ticket resolution efficiency
- Customer engagement trends

## 8. Trade-offs & Decisions
- **SQLite used instead of cloud DB** → faster setup for assignment
- **Simplified health score** → interpretable vs complex ML
- **Focused UI over design-heavy interface** → prioritizing usability
- **Static dataset** → avoids dependency on external APIs

## 9. Future Enhancements
- Predictive churn model
- Real-time data sync
- Automated alerts & notifications
- Role-based access
