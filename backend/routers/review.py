from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.review import Review
from schemas.schemas import ReviewCreate, ReviewOut

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("/", response_model=List[ReviewOut])
def list_reviews(
    franchise_id: int = None,
    staff_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(Review)
    if franchise_id:
        query = query.filter(Review.franchise_id == franchise_id)
    if staff_id:
        query = query.filter(Review.staff_id == staff_id)
    return query.order_by(Review.created_at.desc()).all()


@router.post("/", response_model=ReviewOut)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    review = Review(**data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/{review_id}", response_model=ReviewOut)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review
