from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.customer import Customer
from schemas.schemas import CustomerCreate, CustomerUpdate, CustomerOut

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("/", response_model=List[CustomerOut])
def list_customers(
    skip: int = 0,
    limit: int = 100,
    tier: str = None,
    franchise_id: int = None,
    search: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Customer)
    if tier and tier.lower() != "all":
        query = query.filter(Customer.loyalty_tier == tier)
    if franchise_id:
        query = query.filter(Customer.franchise_id == franchise_id)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Customer.full_name.ilike(s))
            | (Customer.phone.ilike(s))
            | (Customer.vehicle_number.ilike(s))
            | (Customer.vehicle_model.ilike(s))
        )
    return query.order_by(Customer.total_spent.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=CustomerOut)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(Customer.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer with this phone already exists")
    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(customer_id: int, data: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"detail": "Customer deleted"}
