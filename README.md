# ClearQuote Customer Success Dashboard

A browser-based internal dashboard for the ClearQuote Customer Success team. It replaces spreadsheet-based customer tracking with four operational tabs:

- Customer Overview
- Usage Metrics
- Support & Comms
- Fleet Distribution

The app uses a React/Vite frontend and a FastAPI backend with seeded dummy data.

## Project Structure

```txt
/src
  /components
    Navbar.jsx
    Sidebar.jsx
    Table.jsx
    FilterBar.jsx
    HealthBadge.jsx
    Charts/
      LineChart.jsx
      BarChart.jsx
  /pages
    CustomerOverview.jsx
    UsageMetrics.jsx
    SupportComms.jsx
    FleetDistribution.jsx
  /services
    api.js
  /utils
    helpers.js
  App.jsx
  main.jsx

/backend
  main.py
  models.py
  services.py
  database.py
  requirements.txt

/docs
  PRD.md
```

## Run Locally

### 1. Backend

```bash
pip install -r backend/requirements.txt
npm run api
```

API docs will be available at:

```txt
http://localhost:8000/docs
```

If you prefer running Python directly:

```bash
pip install -r backend/requirements.txt
python backend/run_server.py
```

### 2. Frontend

In a second terminal:

```bash
npm install
npm run dev
```

Frontend URL:

```txt
http://127.0.0.1:5173
```

## API Endpoints

- `GET /customers` - customer overview with health score, tier, MRR, CSM, and location
- `GET /usage` - 15 months of inspection, damage, driver, and API usage data
- `GET /tickets` - 80 support ticket records
- `GET /fleet` - fleet composition and tooling per customer
- `GET /summary` - top-level dashboard totals

Each data endpoint accepts an optional `customer_id` query parameter where useful.

## Health Score Logic

The score is calculated in `backend/services.py`:

```python
score = (
    0.4 * usage_growth +
    0.3 * (1 - damage_rate) +
    0.2 * csat +
    0.1 * resolution_speed
) * 100
```

Scores are mapped to:

- `Healthy`: 70+
- `Watch`: 40-69.99
- `At Risk`: below 40

## Notes

- Google SSO is intentionally not implemented because the brief marks it optional and the assignment is focused on dashboard usability, data modeling, and product judgment.
- Data is generated in memory so the app is easy to review locally without database setup.
- The PRD is in `docs/PRD.md`.
