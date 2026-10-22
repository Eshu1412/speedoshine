from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text
from sqlalchemy.sql import func
from database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, default="wash")  # wash, detailing, polish, coating, interior
    duration_minutes = Column(Integer, default=30)
    price_sedan = Column(Float, default=0.0)
    price_suv = Column(Float, default=0.0)
    price_hatchback = Column(Float, default=0.0)
    price_bike = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    popularity = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
