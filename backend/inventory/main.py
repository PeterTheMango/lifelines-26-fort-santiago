from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Seed data if empty
def seed_data(db: Session):
    if db.query(models.InventoryItem).count() == 0:
        mock_items = [
            {"type": "Concrete Rubble", "category": "construction", "currentAmount": 450, "unit": "kg", "maxCapacity": 500, "requiredAmount": 300, "location": "Sector A", "lat": 14.5945, "lng": 120.9705, "status": "good", "description": "Recycled concrete..."},
            {"type": "Timber Beams", "category": "construction", "currentAmount": 12, "unit": "units", "maxCapacity": 50, "requiredAmount": 40, "location": "Sector B", "lat": 14.5942, "lng": 120.9720, "status": "low", "description": "Reclaimed sturdy timber..."},
            {"type": "Water (Potable)", "category": "water", "currentAmount": 120, "unit": "L", "maxCapacity": 2000, "requiredAmount": 1500, "location": "Base Camp", "lat": 14.5939, "lng": 120.9712, "status": "critical", "description": "Clean drinking water..."},
            {"type": "Metal Scraps", "category": "construction", "currentAmount": 85, "unit": "kg", "maxCapacity": 100, "requiredAmount": 50, "location": "Sector A", "lat": 14.5950, "lng": 120.9700, "status": "good", "description": "Sorted metal..."},
            {"type": "Plastic Sheeting", "category": "construction", "currentAmount": 4, "unit": "rolls", "maxCapacity": 5, "requiredAmount": 10, "location": "Sector C", "lat": 14.5930, "lng": 120.9702, "status": "good", "description": "Heavy-duty tarps..."},
            {"type": "Aggregates", "category": "construction", "currentAmount": 1200, "unit": "kg", "maxCapacity": 1500, "requiredAmount": 1000, "location": "Sector D", "lat": 14.5928, "lng": 120.9725, "status": "good", "description": "Gravel and sand..."},
            {"type": "Fuel (Diesel)", "category": "fuel", "currentAmount": 40, "unit": "L", "maxCapacity": 200, "requiredAmount": 150, "location": "Generator 1", "lat": 14.5935, "lng": 120.9730, "status": "warning", "description": "Diesel fuel..."}
        ]
        for item in mock_items:
            db_item = models.InventoryItem(
                type=item["type"],
                category=item["category"],
                current_amount=item["currentAmount"],
                unit=item["unit"],
                max_capacity=item["maxCapacity"],
                required_amount=item["requiredAmount"],
                location=item["location"],
                lat=item["lat"],
                lng=item["lng"],
                status=item["status"],
                description=item["description"]
            )
            db.add(db_item)
        db.commit()

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    seed_data(db)
    db.close()

@app.get("/items", response_model=List[schemas.InventoryItemResponse])
def read_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_inventory(db, skip=skip, limit=limit)
    return items

@app.post("/items", response_model=schemas.InventoryItemResponse)
def create_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    return crud.create_inventory_item(db, item)

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    items = db.query(models.InventoryItem).all()

    # Calculate total resources
    total_resources = sum(item.current_amount for item in items)

    # Calculate estimated value (simplified: $50 per unit average)
    est_value = total_resources * 50

    # Count critical alerts
    critical_count = sum(1 for item in items if item.status == "critical")
    warning_count = sum(1 for item in items if item.status in ["warning", "low"])
    active_alerts = critical_count + warning_count

    return {
        "totalResources": int(total_resources),
        "activeMesh": {"online": 12, "total": 14},
        "estValue": est_value,
        "activeAlerts": active_alerts
    }
