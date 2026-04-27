import traceback
import sys
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


if __name__ == "__main__":
  try:
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000)
  except Exception:
    Path("backend/api-startup-error.log").write_text(traceback.format_exc(), encoding="utf-8")
    raise
