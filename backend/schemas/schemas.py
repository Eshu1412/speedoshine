from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# --- User / Auth ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "admin"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# --- Franchise ---
class FranchiseCreate(BaseModel):
    name: str
    owner_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    commission_rate: float = 15.0


class FranchiseUpdate(BaseModel):
    name: Optional[str] = None
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    commission_rate: Optional[float] = None
    is_active: Optional[bool] = None


class FranchiseOut(BaseModel):
    id: int
    name: str
    owner_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    commission_rate: float
    is_active: bool
    total_revenue: float
    total_bookings: int
    rating: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Staff ---
class StaffCreate(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str = "washer"
    franchise_id: Optional[int] = None
    salary: float = 0.0


class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    franchise_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_on_duty: Optional[bool] = None
    salary: Optional[float] = None


class StaffOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    franchise_id: Optional[int] = None
    is_active: bool
    is_on_duty: bool
    rating: float
    jobs_completed: int
    salary: float
    joined_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Service ---
class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "wash"
    duration_minutes: int = 30
    price_sedan: float = 0.0
    price_suv: float = 0.0
    price_hatchback: float = 0.0
    price_bike: float = 0.0


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration_minutes: Optional[int] = None
    price_sedan: Optional[float] = None
    price_suv: Optional[float] = None
    price_hatchback: Optional[float] = None
    price_bike: Optional[float] = None
    is_active: Optional[bool] = None


class ServiceOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: str
    duration_minutes: int
    price_sedan: float
    price_suv: float
    price_hatchback: float
    price_bike: float
    is_active: bool
    popularity: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Booking ---
class BookingCreate(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    vehicle_type: str = "sedan"
    vehicle_number: Optional[str] = None
    vehicle_model: Optional[str] = None
    service_id: int
    franchise_id: int
    staff_id: Optional[int] = None
    scheduled_date: datetime
    scheduled_time: str
    amount: float = 0.0
    discount: float = 0.0
    address: Optional[str] = None
    notes: Optional[str] = None


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    staff_id: Optional[int] = None
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    booking_number: str
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    vehicle_type: str
    vehicle_number: Optional[str] = None
    vehicle_model: Optional[str] = None
    service_id: int
    franchise_id: int
    staff_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: str
    status: str
    payment_status: str
    payment_method: Optional[str] = None
    amount: float
    discount: float
    final_amount: float
    address: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Review ---
class ReviewCreate(BaseModel):
    booking_id: int
    customer_name: str
    rating: float
    comment: Optional[str] = None
    staff_id: Optional[int] = None
    franchise_id: Optional[int] = None


class ReviewOut(BaseModel):
    id: int
    booking_id: int
    customer_name: str
    rating: float
    comment: Optional[str] = None
    staff_id: Optional[int] = None
    franchise_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Notification ---
class NotificationCreate(BaseModel):
    type: str = "booking"
    title: str
    message: Optional[str] = None
    recipient_type: str = "admin"
    recipient_id: Optional[int] = None


class NotificationOut(BaseModel):
    id: int
    type: str
    title: str
    message: Optional[str] = None
    recipient_type: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Customer ---
class CustomerCreate(BaseModel):
    full_name: str
    phone: str
    email: str
    vehicle_type: str = "sedan"
    vehicle_number: str
    vehicle_model: str
    franchise_id: Optional[int] = None
    total_bookings: int = 1
    total_spent: float = 0.0
    loyalty_tier: str = "Silver"
    loyalty_points: int = 100
    last_visit: str = "Today"
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    vehicle_type: Optional[str] = None
    vehicle_number: Optional[str] = None
    vehicle_model: Optional[str] = None
    franchise_id: Optional[int] = None
    loyalty_tier: Optional[str] = None
    notes: Optional[str] = None


class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str
    vehicle_type: str
    vehicle_number: str
    vehicle_model: str
    franchise_id: Optional[int] = None
    total_bookings: int
    total_spent: float
    loyalty_tier: str
    loyalty_points: int
    last_visit: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Transaction ---
class TransactionCreate(BaseModel):
    txn_number: str
    booking_number: str
    customer_name: str
    customer_phone: str
    franchise_id: Optional[int] = None
    amount: float
    tax: float = 0.0
    discount: float = 0.0
    commission: float = 0.0
    net_amount: float
    payment_method: str = "UPI"
    status: str = "success"


class TransactionOut(BaseModel):
    id: int
    txn_number: str
    booking_number: str
    customer_name: str
    customer_phone: str
    franchise_id: Optional[int] = None
    amount: float
    tax: float
    discount: float
    commission: float
    net_amount: float
    payment_method: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Support Ticket ---
class TicketCreate(BaseModel):
    customer_name: str
    customer_phone: str
    issue_type: str = "Quality"
    priority: str = "Medium"
    franchise_id: Optional[int] = None
    assigned_to: str = "Customer Support"
    description: str
    rating_ref: Optional[int] = None


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None


class TicketOut(BaseModel):
    id: int
    ticket_number: str
    customer_name: str
    customer_phone: str
    issue_type: str
    priority: str
    status: str
    franchise_id: Optional[int] = None
    assigned_to: str
    description: str
    resolution: Optional[str] = None
    rating_ref: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


