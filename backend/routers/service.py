from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.service import Service
from schemas.schemas import ServiceCreate, ServiceUpdate, ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("/", response_model=List[ServiceOut])
def list_services(category: str = None, db: Session = Depends(get_db)):
    query = db.query(Service)
    if category:
        query = query.filter(Service.category == category)
    return query.all()


@router.post("/", response_model=ServiceOut)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    service = Service(**data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, data: ServiceUpdate, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(service, key, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"detail": "Service deleted"}
