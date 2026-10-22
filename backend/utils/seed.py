import random
import string
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models.user import User
from models.franchise import Franchise
from models.staff import Staff
from models.service import Service
from models.booking import Booking
from models.review import Review
from models.notification import Notification
from models.customer import Customer
from models.transaction import Transaction
from models.ticket import SupportTicket
from utils.auth import get_password_hash


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data
    db.query(SupportTicket).delete()
    db.query(Transaction).delete()
    db.query(Customer).delete()
    db.query(Notification).delete()
    db.query(Review).delete()
    db.query(Booking).delete()
    db.query(Staff).delete()
    db.query(Service).delete()
    db.query(Franchise).delete()
    db.query(User).delete()
    db.commit()


    # Admin user
    admin = User(
        email="admin@speedoshine.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Rajesh Kumar",
        phone="+91 98765 43210",
        role="admin",
    )
    db.add(admin)
    db.commit()

    # Franchises
    franchise_data = [
        {"name": "SpeedoShine Koramangala", "owner_name": "Ankit Sharma", "email": "koramangala@speedoshine.com", "phone": "+91 98765 11001", "address": "4th Block, Koramangala", "city": "Bangalore", "state": "Karnataka", "pincode": "560034", "latitude": 12.9352, "longitude": 77.6245, "commission_rate": 15.0, "total_revenue": 287500, "total_bookings": 342, "rating": 4.6},
        {"name": "SpeedoShine Indiranagar", "owner_name": "Priya Menon", "email": "indiranagar@speedoshine.com", "phone": "+91 98765 11002", "address": "100 Feet Road, Indiranagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560038", "latitude": 12.9784, "longitude": 77.6408, "commission_rate": 12.0, "total_revenue": 345000, "total_bookings": 415, "rating": 4.8},
        {"name": "SpeedoShine HSR Layout", "owner_name": "Vikram Reddy", "email": "hsr@speedoshine.com", "phone": "+91 98765 11003", "address": "Sector 2, HSR Layout", "city": "Bangalore", "state": "Karnataka", "pincode": "560102", "latitude": 12.9116, "longitude": 77.6389, "commission_rate": 14.0, "total_revenue": 198000, "total_bookings": 230, "rating": 4.3},
        {"name": "SpeedoShine Whitefield", "owner_name": "Deepak Joshi", "email": "whitefield@speedoshine.com", "phone": "+91 98765 11004", "address": "ITPL Road, Whitefield", "city": "Bangalore", "state": "Karnataka", "pincode": "560066", "latitude": 12.9698, "longitude": 77.7500, "commission_rate": 13.0, "total_revenue": 156000, "total_bookings": 178, "rating": 4.5},
        {"name": "SpeedoShine Jayanagar", "owner_name": "Meena Patel", "email": "jayanagar@speedoshine.com", "phone": "+91 98765 11005", "address": "9th Block, Jayanagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560041", "latitude": 12.9250, "longitude": 77.5938, "commission_rate": 15.0, "total_revenue": 221000, "total_bookings": 265, "rating": 4.7},
    ]
    franchises = []
    for fd in franchise_data:
        f = Franchise(**fd)
        db.add(f)
        franchises.append(f)
    db.commit()
    for f in franchises:
        db.refresh(f)

    # Services
    service_data = [
        {"name": "Quick Wash", "description": "Exterior rinse, foam wash, and wipe-down. Takes about 20 minutes.", "category": "wash", "duration_minutes": 20, "price_sedan": 299, "price_suv": 399, "price_hatchback": 249, "price_bike": 149, "popularity": 856},
        {"name": "Full Body Wash", "description": "Complete exterior wash with tyre dressing, glass cleaning, and dashboard wipe.", "category": "wash", "duration_minutes": 40, "price_sedan": 499, "price_suv": 649, "price_hatchback": 449, "price_bike": 249, "popularity": 623},
        {"name": "Interior Deep Clean", "description": "Vacuum, seat shampooing, AC vent cleaning, and odor treatment.", "category": "interior", "duration_minutes": 90, "price_sedan": 1499, "price_suv": 1899, "price_hatchback": 1299, "price_bike": 0, "popularity": 412},
        {"name": "Ceramic Coating", "description": "9H ceramic coating for long-lasting paint protection. Lasts 2-3 years.", "category": "coating", "duration_minutes": 300, "price_sedan": 8999, "price_suv": 12999, "price_hatchback": 7999, "price_bike": 4999, "popularity": 189},
        {"name": "Paint Correction & Polish", "description": "Machine polish to remove swirl marks, scratches, and oxidation.", "category": "polish", "duration_minutes": 180, "price_sedan": 3999, "price_suv": 5499, "price_hatchback": 3499, "price_bike": 1999, "popularity": 234},
        {"name": "Engine Bay Cleaning", "description": "Degrease, wash, and dress the engine compartment.", "category": "detailing", "duration_minutes": 60, "price_sedan": 999, "price_suv": 1299, "price_hatchback": 899, "price_bike": 599, "popularity": 178},
        {"name": "Headlight Restoration", "description": "Sand, polish, and UV-coat yellowed or hazy headlights.", "category": "detailing", "duration_minutes": 45, "price_sedan": 799, "price_suv": 799, "price_hatchback": 799, "price_bike": 499, "popularity": 145},
        {"name": "PPF Installation", "description": "Paint protection film on high-impact areas — hood, bumper, mirrors.", "category": "coating", "duration_minutes": 480, "price_sedan": 15999, "price_suv": 19999, "price_hatchback": 13999, "price_bike": 7999, "popularity": 98},
    ]
    services = []
    for sd in service_data:
        s = Service(**sd)
        db.add(s)
        services.append(s)
    db.commit()
    for s in services:
        db.refresh(s)

    # Staff
    staff_names = [
        ("Ravi Shankar", "washer"), ("Mohammed Irfan", "washer"), ("Suresh Babu", "detailer"),
        ("Ganesh Kumar", "washer"), ("Arun Prasad", "supervisor"), ("Kiran Rao", "detailer"),
        ("Manoj Tiwari", "washer"), ("Santosh Yadav", "washer"), ("Venkatesh R", "detailer"),
        ("Prakash Nair", "supervisor"), ("Dinesh Verma", "washer"), ("Ajay Singh", "detailer"),
        ("Ramesh Gowda", "washer"), ("Vijay Kumar", "washer"), ("Sanjay Patil", "supervisor"),
    ]
    staff_members = []
    for i, (name, role) in enumerate(staff_names):
        franchise = franchises[i % len(franchises)]
        s = Staff(
            full_name=name,
            email=f"{name.lower().replace(' ', '.')}@speedoshine.com",
            phone=f"+91 98765 {20000 + i:05d}",
            role=role,
            franchise_id=franchise.id,
            is_active=True,
            is_on_duty=random.choice([True, False]),
            rating=round(random.uniform(3.5, 5.0), 1),
            jobs_completed=random.randint(20, 200),
            salary=random.choice([12000, 15000, 18000, 22000, 25000]),
        )
        db.add(s)
        staff_members.append(s)
    db.commit()
    for s in staff_members:
        db.refresh(s)

    # Bookings (last 30 days)
    customer_names = [
        "Amit Patel", "Sneha Gupta", "Rahul Verma", "Kavitha Nair", "Sunil Mehta",
        "Pooja Sharma", "Arjun Reddy", "Divya Krishnan", "Nikhil Jain", "Rekha Srinivas",
        "Varun Malhotra", "Nandini Rao", "Siddharth Bose", "Ananya Das", "Karthik Subramani",
        "Priyanka Iyer", "Rohit Saxena", "Lavanya Pillai", "Manish Agarwal", "Shweta Kulkarni",
    ]
    vehicle_types = ["sedan", "suv", "hatchback", "bike"]
    vehicle_models = {
        "sedan": ["Honda City", "Hyundai Verna", "Maruti Ciaz", "Skoda Slavia", "VW Virtus"],
        "suv": ["Hyundai Creta", "Tata Harrier", "MG Hector", "Kia Seltos", "Mahindra XUV700"],
        "hatchback": ["Maruti Swift", "Hyundai i20", "Tata Altroz", "VW Polo", "Baleno"],
        "bike": ["Royal Enfield 350", "KTM Duke 390", "Bajaj Dominar", "Honda CB350", "Yamaha R15"],
    }
    statuses = ["pending", "confirmed", "in_progress", "completed", "completed", "completed", "cancelled"]
    payment_statuses_map = {
        "completed": "paid", "cancelled": "unpaid", "pending": "unpaid",
        "confirmed": random.choice(["paid", "unpaid"]), "in_progress": "paid",
    }

    bookings = []
    for i in range(80):
        days_ago = random.randint(0, 30)
        vtype = random.choice(vehicle_types)
        service = random.choice(services)
        franchise = random.choice(franchises)
        staff = random.choice([s for s in staff_members if s.franchise_id == franchise.id] or staff_members)
        status = random.choice(statuses)
        price_attr = f"price_{vtype}"
        amount = getattr(service, price_attr, 0)
        discount = random.choice([0, 0, 0, 50, 100, 200])
        final = max(amount - discount, 0)
        p_status = "paid" if status == "completed" else ("unpaid" if status in ["pending", "cancelled"] else random.choice(["paid", "unpaid"]))

        b = Booking(
            booking_number="SS-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8)),
            customer_name=random.choice(customer_names),
            customer_phone=f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
            customer_email=f"customer{i}@gmail.com",
            vehicle_type=vtype,
            vehicle_number=f"KA {random.randint(1, 99):02d} {random.choice(string.ascii_uppercase)}{random.choice(string.ascii_uppercase)} {random.randint(1000, 9999)}",
            vehicle_model=random.choice(vehicle_models[vtype]),
            service_id=service.id,
            franchise_id=franchise.id,
            staff_id=staff.id,
            scheduled_date=datetime.utcnow() - timedelta(days=days_ago),
            scheduled_time=random.choice(["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"]),
            status=status,
            payment_status=p_status,
            payment_method=random.choice(["cash", "upi", "card"]) if p_status == "paid" else None,
            amount=amount,
            discount=discount,
            final_amount=final,
            address=f"{random.randint(1, 500)}, {random.choice(['MG Road', '1st Cross', '2nd Main', 'Park Avenue', 'Church Street'])}, {franchise.city}",
        )
        db.add(b)
        bookings.append(b)
    db.commit()
    for b in bookings:
        db.refresh(b)

    # Reviews
    review_comments = [
        "Really good work on my car. Looks brand new.",
        "Fast service, happy with the results.",
        "The interior cleaning was thorough. My car smells great now.",
        "Bit pricey, but the quality is there.",
        "Staff was polite and professional.",
        "They took extra care of my new car. Appreciated.",
        "Average job. Expected better for the price.",
        "Ceramic coating looks fantastic. Money well spent.",
        "Quick turnaround. No complaints.",
        "Paint correction made a huge difference. Very satisfied.",
        "Bike wash was good. Will come again.",
        "They missed a few spots on the dashboard, but overall decent.",
        "Great franchise. Smooth booking process too.",
        "Headlights look like new after restoration.",
        "Professional setup. Clean workspace.",
    ]

    for b in bookings:
        if b.status == "completed" and random.random() > 0.3:
            r = Review(
                booking_id=b.id,
                customer_name=b.customer_name,
                rating=round(random.uniform(3.0, 5.0), 1),
                comment=random.choice(review_comments),
                staff_id=b.staff_id,
                franchise_id=b.franchise_id,
            )
            db.add(r)
    db.commit()

    # Notifications
    notif_data = [
        {"type": "booking", "title": "New booking received", "message": "Booking SS-DEMO0001 from Amit Patel for Quick Wash at Koramangala", "recipient_type": "admin"},
        {"type": "payment", "title": "Payment received", "message": "₹499 received via UPI for booking SS-DEMO0002", "recipient_type": "admin"},
        {"type": "staff", "title": "Staff checked in", "message": "Ravi Shankar marked as on-duty at Koramangala franchise", "recipient_type": "admin"},
        {"type": "alert", "title": "Low rating alert", "message": "HSR Layout franchise received a 2-star review. Check details.", "recipient_type": "admin"},
        {"type": "promo", "title": "Weekend offer live", "message": "20% off on all ceramic coatings this Saturday and Sunday", "recipient_type": "customer"},
    ]
    for nd in notif_data:
        n = Notification(**nd)
        db.add(n)
    db.commit()

    # Customers
    customers_data = [
        {"full_name": "Rajesh Kumar", "phone": "+91 98450 12345", "email": "rajesh.k@gmail.com", "vehicle_type": "suv", "vehicle_number": "KA-01-MJ-5005", "vehicle_model": "Mahindra XUV700", "franchise_id": 1, "total_bookings": 14, "total_spent": 38400, "loyalty_tier": "Diamond VIP", "loyalty_points": 1920, "last_visit": "2 days ago", "notes": "Prefers premium microfiber drying and dashboard satin matte coat."},
        {"full_name": "Pooja Hegde", "phone": "+91 97412 88990", "email": "pooja.h@outlook.com", "vehicle_type": "sedan", "vehicle_number": "KA-05-NB-7788", "vehicle_model": "Honda City ZX", "franchise_id": 2, "total_bookings": 9, "total_spent": 19600, "loyalty_tier": "Platinum", "loyalty_points": 980, "last_visit": "Yesterday", "notes": "Allergic to strong car scents; always use natural citrus deodorizer."},
        {"full_name": "Aditya Verma", "phone": "+91 99001 44321", "email": "aditya.v@corporate.in", "vehicle_type": "sedan", "vehicle_number": "KA-03-MK-2020", "vehicle_model": "BMW 330i M-Sport", "franchise_id": 1, "total_bookings": 6, "total_spent": 32900, "loyalty_tier": "Diamond VIP", "loyalty_points": 1645, "last_visit": "5 days ago", "notes": "9H Ceramic coated car; strictly two-bucket hand wash with pH-neutral shampoo."},
        {"full_name": "Meera Sen", "phone": "+91 96112 55667", "email": "meera.sen@gmail.com", "vehicle_type": "hatchback", "vehicle_number": "KA-04-P-3344", "vehicle_model": "Hyundai i20 N-Line", "franchise_id": 3, "total_bookings": 5, "total_spent": 8450, "loyalty_tier": "Gold", "loyalty_points": 420, "last_visit": "Today", "notes": "Requested extra pet hair removal from rear split seats."},
        {"full_name": "Dr. Vivek Narang", "phone": "+91 98860 99881", "email": "dr.vivek@narangclinics.com", "vehicle_type": "suv", "vehicle_number": "KA-51-Z-1008", "vehicle_model": "Toyota Fortuner 4x4", "franchise_id": 4, "total_bookings": 7, "total_spent": 24800, "loyalty_tier": "Platinum", "loyalty_points": 1240, "last_visit": "3 days ago", "notes": "Undercarriage anti-rust wash required after off-road highway trips."},
        {"full_name": "Siddharth Rao", "phone": "+91 91480 33211", "email": "sid.rao@startup.co", "vehicle_type": "bike", "vehicle_number": "KA-01-EQ-4499", "vehicle_model": "Triumph Tiger 900", "franchise_id": 5, "total_bookings": 3, "total_spent": 3600, "loyalty_tier": "Silver", "loyalty_points": 180, "last_visit": "1 week ago", "notes": "Chain degreasing and dry lube treatment required with wash."},
    ]
    for cd in customers_data:
        c = Customer(**cd)
        db.add(c)
    db.commit()

    # Transactions
    txns_data = [
        {"txn_number": "TXN-8849201", "booking_number": "SS-K1001", "customer_name": "Aditya Verma", "customer_phone": "+91 99001 44321", "franchise_id": 1, "amount": 8999, "tax": 1619.82, "discount": 500, "commission": 1349.85, "net_amount": 10118.82, "payment_method": "UPI", "status": "success"},
        {"txn_number": "TXN-8849202", "booking_number": "SS-K1002", "customer_name": "Pooja Hegde", "customer_phone": "+91 97412 88990", "franchise_id": 2, "amount": 1499, "tax": 269.82, "discount": 0, "commission": 179.88, "net_amount": 1768.82, "payment_method": "Card", "status": "success"},
        {"txn_number": "TXN-8849203", "booking_number": "SS-K1003", "customer_name": "Rajesh Kumar", "customer_phone": "+91 98450 12345", "franchise_id": 1, "amount": 3999, "tax": 719.82, "discount": 200, "commission": 599.85, "net_amount": 4518.82, "payment_method": "UPI", "status": "success"},
        {"txn_number": "TXN-8849204", "booking_number": "SS-K1004", "customer_name": "Meera Sen", "customer_phone": "+91 96112 55667", "franchise_id": 3, "amount": 449, "tax": 80.82, "discount": 0, "commission": 62.86, "net_amount": 529.82, "payment_method": "Cash", "status": "success"},
        {"txn_number": "TXN-8849205", "booking_number": "SS-K1005", "customer_name": "Dr. Vivek Narang", "customer_phone": "+91 98860 99881", "franchise_id": 4, "amount": 1899, "tax": 341.82, "discount": 100, "commission": 246.87, "net_amount": 2140.82, "payment_method": "UPI", "status": "refunded"},
        {"txn_number": "TXN-8849206", "booking_number": "SS-K1006", "customer_name": "Siddharth Rao", "customer_phone": "+91 91480 33211", "franchise_id": 5, "amount": 599, "tax": 107.82, "discount": 0, "commission": 89.85, "net_amount": 706.82, "payment_method": "UPI", "status": "pending"},
    ]
    for td in txns_data:
        t = Transaction(**td)
        db.add(t)
    db.commit()

    # Support Tickets
    tickets_data = [
        {"ticket_number": "TKT-4921", "customer_name": "Arjun Singhania", "customer_phone": "+91 98450 91823", "issue_type": "Quality", "priority": "Urgent", "status": "Open", "franchise_id": 3, "assigned_to": "Kiran Rao", "description": "Swirl marks still visible on the driver side door panel after stage-1 machine polish. Requested supervisor re-inspection.", "rating_ref": 2},
        {"ticket_number": "TKT-4922", "customer_name": "Deepa Sundaram", "customer_phone": "+91 97412 30948", "issue_type": "Delay", "priority": "High", "status": "In Progress", "franchise_id": 1, "assigned_to": "Arun Prasad", "description": "Full Body Wash took 75 minutes instead of promised 40 minutes due to water pressure booster downtime.", "rating_ref": 3},
        {"ticket_number": "TKT-4923", "customer_name": "Naveen Gowda", "customer_phone": "+91 99001 84729", "issue_type": "Billing", "priority": "Medium", "status": "Resolved", "franchise_id": 2, "assigned_to": "Finance Desk", "description": "Double debit on UPI transaction TXN-8849205. Bank reference submitted.", "resolution": "Refund of duplicate transaction ₹1,769 processed via Razorpay gateway. UTR shared on WhatsApp.", "rating_ref": 2},
        {"ticket_number": "TKT-4924", "customer_name": "Shweta Deshmukh", "customer_phone": "+91 96112 47382", "issue_type": "Staff Behavior", "priority": "Low", "status": "Resolved", "franchise_id": 4, "assigned_to": "Sanjay Patil", "description": "Customer lounge AC was switched off and coffee dispenser was empty during the waiting window.", "resolution": "Lounge attendant briefed; complementary ₹300 interior fragrance voucher issued.", "rating_ref": 3},
    ]
    for tkd in tickets_data:
        tk = SupportTicket(**tkd)
        db.add(tk)
    db.commit()

    db.close()
    print("Database seeded with demo data (including CRM, Payments, and Tickets).")
    print("Login: admin@speedoshine.com / admin123")


if __name__ == "__main__":
    seed()

