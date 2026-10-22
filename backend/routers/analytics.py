from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from database import get_db
from models.booking import Booking
from models.staff import Staff
from models.franchise import Franchise
from models.review import Review
from models.service import Service

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):
    total_bookings = db.query(Booking).count()
    total_revenue = db.query(func.sum(Booking.final_amount)).filter(Booking.payment_status == "paid").scalar() or 0
    active_staff = db.query(Staff).filter(Staff.is_active == True).count()
    total_franchises = db.query(Franchise).filter(Franchise.is_active == True).count()
    pending_bookings = db.query(Booking).filter(Booking.status == "pending").count()
    completed_today = db.query(Booking).filter(
        Booking.status == "completed",
        func.date(Booking.created_at) == datetime.utcnow().date()
    ).count()
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 0

    return {
        "total_bookings": total_bookings,
        "total_revenue": round(total_revenue, 2),
        "active_staff": active_staff,
        "total_franchises": total_franchises,
        "pending_bookings": pending_bookings,
        "completed_today": completed_today,
        "avg_rating": round(float(avg_rating), 1),
    }


@router.get("/revenue-chart")
def revenue_chart(days: int = 7, db: Session = Depends(get_db)):
    results = []
    for i in range(days - 1, -1, -1):
        date = datetime.utcnow().date() - timedelta(days=i)
        revenue = db.query(func.sum(Booking.final_amount)).filter(
            func.date(Booking.created_at) == date,
            Booking.payment_status == "paid",
        ).scalar() or 0
        bookings = db.query(Booking).filter(
            func.date(Booking.created_at) == date,
        ).count()
        results.append({
            "date": date.strftime("%b %d"),
            "revenue": round(float(revenue), 2),
            "bookings": bookings,
        })
    return results


@router.get("/service-popularity")
def service_popularity(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    results = []
    for s in services:
        count = db.query(Booking).filter(Booking.service_id == s.id).count()
        results.append({"name": s.name, "bookings": count, "category": s.category})
    results.sort(key=lambda x: x["bookings"], reverse=True)
    return results[:10]


@router.get("/staff-performance")
def staff_performance(db: Session = Depends(get_db)):
    staff_members = db.query(Staff).filter(Staff.is_active == True).all()
    results = []
    for s in staff_members:
        completed = db.query(Booking).filter(
            Booking.staff_id == s.id,
            Booking.status == "completed"
        ).count()
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.staff_id == s.id).scalar() or 0
        revenue = db.query(func.sum(Booking.final_amount)).filter(
            Booking.staff_id == s.id,
            Booking.payment_status == "paid"
        ).scalar() or 0
        results.append({
            "id": s.id,
            "name": s.full_name,
            "role": s.role,
            "jobs_completed": completed,
            "rating": round(float(avg_rating), 1),
            "revenue": round(float(revenue), 2),
        })
    results.sort(key=lambda x: x["jobs_completed"], reverse=True)
    return results


@router.get("/franchise-performance")
def franchise_performance(db: Session = Depends(get_db)):
    franchises = db.query(Franchise).filter(Franchise.is_active == True).all()
    results = []
    for f in franchises:
        total = db.query(Booking).filter(Booking.franchise_id == f.id).count()
        revenue = db.query(func.sum(Booking.final_amount)).filter(
            Booking.franchise_id == f.id,
            Booking.payment_status == "paid"
        ).scalar() or 0
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.franchise_id == f.id).scalar() or 0
        results.append({
            "id": f.id,
            "name": f.name,
            "city": f.city,
            "total_bookings": total,
            "revenue": round(float(revenue), 2),
            "rating": round(float(avg_rating), 1),
        })
    return results


@router.get("/booking-status")
def booking_status_breakdown(db: Session = Depends(get_db)):
    statuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
    results = []
    for s in statuses:
        count = db.query(Booking).filter(Booking.status == s).count()
        results.append({"status": s, "count": count})
    return results


@router.get("/recent-bookings")
def recent_bookings(limit: int = 10, db: Session = Depends(get_db)):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(limit).all()
    results = []
    for b in bookings:
        service = db.query(Service).filter(Service.id == b.service_id).first()
        franchise = db.query(Franchise).filter(Franchise.id == b.franchise_id).first()
        staff = db.query(Staff).filter(Staff.id == b.staff_id).first() if b.staff_id else None
        results.append({
            "id": b.id,
            "booking_number": b.booking_number,
            "customer_name": b.customer_name,
            "vehicle_type": b.vehicle_type,
            "vehicle_number": b.vehicle_number,
            "service_name": service.name if service else "—",
            "franchise_name": franchise.name if franchise else "—",
            "staff_name": staff.full_name if staff else "Unassigned",
            "status": b.status,
            "payment_status": b.payment_status,
            "final_amount": b.final_amount,
            "scheduled_date": b.scheduled_date.strftime("%b %d, %Y") if b.scheduled_date else "—",
            "scheduled_time": b.scheduled_time,
        })
    return results
