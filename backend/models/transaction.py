from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    txn_number = Column(String, unique=True, index=True)
    booking_number = Column(String, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String)
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=True)
    amount = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    commission = Column(Float, default=0.0)
    net_amount = Column(Float, default=0.0)
    payment_method = Column(String, default="UPI")  # UPI, Card, Cash, NetBanking
    status = Column(String, default="success")  # success, refunded, pending
    created_at = Column(DateTime(timezone=True), server_default=func.now())
