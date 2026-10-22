from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.staff import Staff
from schemas.schemas import StaffCreate, StaffUpdate, StaffOut

router = APIRouter(prefix="/api/staff", tags=["staff"])


@router.get("/", response_model=List[StaffOut])
def list_staff(skip: int = 0, limit: int = 100, franchise_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Staff)
    if franchise_id:
        query = query.filter(Staff.franchise_id == franchise_id)
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=StaffOut)
def create_staff(data: StaffCreate, db: Session = Depends(get_db)):
    existing = db.query(Staff).filter(Staff.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff with this email exists")
    staff = Staff(**data.model_dump())
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff


@router.get("/{staff_id}", response_model=StaffOut)
def get_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff


@router.put("/{staff_id}", response_model=StaffOut)
def update_staff(staff_id: int, data: StaffUpdate, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(staff, key, value)
    db.commit()
    db.refresh(staff)
    return staff


@router.post("/{staff_id}/toggle-duty", response_model=StaffOut)
def toggle_duty(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.is_on_duty = not staff.is_on_duty
    db.commit()
    db.refresh(staff)
    return staff


@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(staff)
    db.commit()
    return {"detail": "Staff deleted"}

