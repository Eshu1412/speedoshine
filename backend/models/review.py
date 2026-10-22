from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    customer_name = Column(String)
    rating = Column(Float, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
