from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False, index=True)
    phone = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    vehicle_type = Column(String, default="sedan")  # sedan, suv, hatchback, bike
    vehicle_number = Column(String, nullable=False, index=True)
    vehicle_model = Column(String)
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=True)
    total_bookings = Column(Integer, default=1)
    total_spent = Column(Float, default=0.0)
    loyalty_tier = Column(String, default="Silver")  # Silver, Gold, Platinum, Diamond VIP
    loyalty_points = Column(Integer, default=100)
    last_visit = Column(String, default="Today")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
