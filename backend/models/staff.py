from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    role = Column(String, default="washer")  # washer, detailer, supervisor
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    is_on_duty = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    jobs_completed = Column(Integer, default=0)
    salary = Column(Float, default=0.0)
    joined_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
