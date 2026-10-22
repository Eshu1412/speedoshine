from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_number = Column(String, unique=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String)
    customer_email = Column(String)
    vehicle_type = Column(String)  # sedan, suv, hatchback, bike
    vehicle_number = Column(String)
    vehicle_model = Column(String)
    service_id = Column(Integer, ForeignKey("services.id"))
    franchise_id = Column(Integer, ForeignKey("franchises.id"))
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    scheduled_date = Column(DateTime(timezone=True))
    scheduled_time = Column(String)
    status = Column(String, default="pending")  # pending, confirmed, in_progress, completed, cancelled
    payment_status = Column(String, default="unpaid")  # unpaid, paid, refunded
    payment_method = Column(String, nullable=True)  # cash, upi, card
    amount = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    final_amount = Column(Float, default=0.0)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    before_image = Column(String, nullable=True)
    after_image = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
