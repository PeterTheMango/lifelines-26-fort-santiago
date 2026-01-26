from pydantic import BaseModel, Field, computed_field
from typing import Optional
from datetime import datetime
import math

class Coordinates(BaseModel):
    lat: float
    lng: float

class InventoryItemBase(BaseModel):
    type: str
    category: str
    maxCapacity: float = Field(..., serialization_alias="maxCapacity", validation_alias="max_capacity")
    currentAmount: float = Field(..., serialization_alias="currentAmount", validation_alias="current_amount")
    requiredAmount: float = Field(..., serialization_alias="requiredAmount", validation_alias="required_amount")
    location: str
    description: Optional[str] = None
    status: str

    class Config:
        populate_by_name = True
        from_attributes = True

class InventoryItemCreate(BaseModel):
    type: str
    category: str = "construction"
    currentAmount: float
    unit: str
    location: str
    maxCapacity: Optional[float] = 0
    description: Optional[str] = None
    requiredAmount: float = 0
    lat: float = 14.5945
    lng: float = 120.9705
    status: str = "good"

class InventoryItemResponse(InventoryItemBase):
    id: int
    unit: str = Field(exclude=True) # Used for computation but excluded from output if not needed, but let's keep it hidden
    lat: float = Field(exclude=True)
    lng: float = Field(exclude=True)
    updated_at: datetime = Field(exclude=True)

    @computed_field
    def quantity(self) -> str:
        return f"{self.currentAmount} {self.unit}"

    @computed_field
    def coordinates(self) -> Coordinates:
        return Coordinates(lat=self.lat, lng=self.lng)

    @computed_field
    def updated(self) -> str:
        # Simple logic to convert datetime to "x m ago" string
        diff = datetime.now() - self.updated_at
        seconds = diff.total_seconds()
        if seconds < 60:
            return "Just now"
        elif seconds < 3600:
            return f"{int(seconds / 60)}m ago"
        elif seconds < 86400:
            return f"{int(seconds / 3600)}h ago"
        else:
            return f"{int(seconds / 86400)}d ago"
