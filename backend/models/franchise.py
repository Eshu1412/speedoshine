from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from sqlalchemy.sql import func
from database import Base


class Franchise(Base):
    __tablename__ = "franchises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    commission_rate = Column(Float, default=15.0)  # percentage
    is_active = Column(Boolean, default=True)
    total_revenue = Column(Float, default=0.0)
    total_bookings = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
