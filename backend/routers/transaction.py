from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.transaction import Transaction
from schemas.schemas import TransactionCreate, TransactionOut

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.get("/", response_model=List[TransactionOut])
def list_transactions(
    skip: int = 0,
    limit: int = 100,
    method: str = None,
    status: str = None,
    franchise_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(Transaction)
    if method and method.lower() != "all":
        query = query.filter(Transaction.payment_method == method)
    if status and status.lower() != "all":
        query = query.filter(Transaction.status == status)
    if franchise_id:
        query = query.filter(Transaction.franchise_id == franchise_id)
    return query.order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=TransactionOut)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    txn = Transaction(**data.model_dump())
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.put("/{txn_id}/refund", response_model=TransactionOut)
def refund_transaction(txn_id: int, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == txn_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    txn.status = "refunded"
    db.commit()
    db.refresh(txn)
    return txn
