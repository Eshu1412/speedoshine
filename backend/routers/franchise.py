from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.franchise import Franchise
from schemas.schemas import FranchiseCreate, FranchiseUpdate, FranchiseOut

router = APIRouter(prefix="/api/franchises", tags=["franchises"])


@router.get("/", response_model=List[FranchiseOut])
def list_franchises(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Franchise).offset(skip).limit(limit).all()


@router.post("/", response_model=FranchiseOut)
def create_franchise(data: FranchiseCreate, db: Session = Depends(get_db)):
    existing = db.query(Franchise).filter(Franchise.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Franchise with this email exists")
    franchise = Franchise(**data.model_dump())
    db.add(franchise)
    db.commit()
    db.refresh(franchise)
    return franchise


@router.get("/{franchise_id}", response_model=FranchiseOut)
def get_franchise(franchise_id: int, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    return franchise


@router.put("/{franchise_id}", response_model=FranchiseOut)
def update_franchise(franchise_id: int, data: FranchiseUpdate, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(franchise, key, value)
    db.commit()
    db.refresh(franchise)
    return franchise


@router.delete("/{franchise_id}")
def delete_franchise(franchise_id: int, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    db.delete(franchise)
    db.commit()
    return {"detail": "Franchise deleted"}
