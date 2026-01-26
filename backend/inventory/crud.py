from sqlalchemy.orm import Session
import models, schemas

def get_inventory(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.InventoryItem).offset(skip).limit(limit).all()

def create_inventory_item(db: Session, item: schemas.InventoryItemCreate):
    # Check if item with same type and location exists
    existing_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.type == item.type,
        models.InventoryItem.location == item.location
    ).first()

    if existing_item:
        # Update existing item
        existing_item.current_amount += item.currentAmount
        
        # Update required amount if provided
        if item.requiredAmount > 0:
            existing_item.required_amount = item.requiredAmount
            
        # Optional: ensure status is updated if needed (re-calc status based on new totals?)
        # For now, just update amounts.
        
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # Create new item
        db_item = models.InventoryItem(
            type=item.type,
            category=item.category,
            current_amount=item.currentAmount,
            unit=item.unit,
            max_capacity=item.maxCapacity,
            required_amount=item.requiredAmount,
            location=item.location,
            lat=item.lat,
            lng=item.lng,
            status=item.status,
            description=item.description
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
