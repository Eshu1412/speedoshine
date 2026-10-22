from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.notification import Notification
from schemas.schemas import NotificationCreate, NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/", response_model=List[NotificationOut])
def list_notifications(
    unread_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Notification)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=NotificationOut)
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    notification = Notification(**data.model_dump())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.put("/{notification_id}/read", response_model=NotificationOut)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.put("/read-all")
def mark_all_notifications_read(db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.is_read == False).update({Notification.is_read: True})
    db.commit()
    return {"detail": "All notifications marked as read"}


@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"detail": "Notification deleted"}
