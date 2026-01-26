from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)
    category = Column(String)
    unit = Column(String, default="units") 
    max_capacity = Column(Float)
    current_amount = Column(Float)
    required_amount = Column(Float)
    location = Column(String)
    lat = Column(Float, default=0.0)
    lng = Column(Float, default=0.0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status = Column(String)
    description = Column(String, nullable=True)
