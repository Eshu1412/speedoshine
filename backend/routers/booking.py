import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.booking import Booking
from schemas.schemas import BookingCreate, BookingUpdate, BookingOut

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def generate_booking_number():
    return "SS-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


@router.get("/", response_model=List[BookingOut])
def list_bookings(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    franchise_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    if franchise_id:
        query = query.filter(Booking.franchise_id == franchise_id)
    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=BookingOut)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    final_amount = data.amount - data.discount
    booking = Booking(
        **data.model_dump(),
        booking_number=generate_booking_number(),
        final_amount=max(final_amount, 0),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.put("/{booking_id}", response_model=BookingOut)
def update_booking(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(booking, key, value)
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"detail": "Booking deleted"}
