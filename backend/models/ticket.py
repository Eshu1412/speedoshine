from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String, unique=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String)
    issue_type = Column(String, default="Quality")  # Quality, Delay, Staff Behavior, Vehicle Inspection, Billing
    priority = Column(String, default="Medium")  # Urgent, High, Medium, Low
    status = Column(String, default="Open")  # Open, In Progress, Resolved
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=True)
    assigned_to = Column(String, default="Customer Support")
    description = Column(Text, nullable=False)
    resolution = Column(Text, nullable=True)
    rating_ref = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
