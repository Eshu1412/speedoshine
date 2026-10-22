from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, franchise, staff, service, booking, review, analytics, notification, customer, transaction, ticket

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SpeedoShine API",
    description="Car wash & detailing service management",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(franchise.router)
app.include_router(staff.router)
app.include_router(service.router)
app.include_router(booking.router)
app.include_router(review.router)
app.include_router(analytics.router)
app.include_router(notification.router)
app.include_router(customer.router)
app.include_router(transaction.router)
app.include_router(ticket.router)



@app.get("/")
def root():
    return {"message": "SpeedoShine API is running", "docs": "/docs"}
