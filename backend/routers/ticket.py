import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.ticket import SupportTicket
from schemas.schemas import TicketCreate, TicketUpdate, TicketOut

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


def generate_ticket_number():
    return f"TKT-{random.randint(1000, 9999)}"


@router.get("/", response_model=List[TicketOut])
def list_tickets(
    skip: int = 0,
    limit: int = 100,
    priority: str = None,
    status: str = None,
    franchise_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(SupportTicket)
    if priority and priority.lower() != "all":
        query = query.filter(SupportTicket.priority == priority)
    if status and status.lower() != "all":
        query = query.filter(SupportTicket.status == status)
    if franchise_id:
        query = query.filter(SupportTicket.franchise_id == franchise_id)
    return query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=TicketOut)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db)):
    ticket = SupportTicket(
        **data.model_dump(),
        ticket_number=generate_ticket_number(),
        status="Open",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.put("/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, data: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"detail": "Ticket deleted"}
