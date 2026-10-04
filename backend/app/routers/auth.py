from fastapi import APIRouter,Depends,HTTPException,status,Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse,UserRegister,UserLogin
from app.core.security import hash_password,verify_password,create_access_token


router = APIRouter(prefix="/auth",tags=["Authentication"])

@router.post("/register",response_model=UserResponse)

def register(user_data:UserRegister,db:Session=Depends(get_db)):
    exist_user = db.query(User).filter(User.email == user_data.email).first()

    if exist_user:
        raise HTTPException(status_code=400,detail="Email already registered")

    new_user = User(username = user_data.username,email = user_data.email,hashed_password = hash_password(user_data.password),role='Customer')


    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")

def login(user_data:UserLogin,db:Session=Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(status_code=401,detail="Invalid email or password")

    if not verify_password(user_data.password,user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid email or password")

    token = create_access_token({
        "sub":str(user.id),
        "email":user.email,
        "role":user.role
    })


    return {
        "access_token": token,
        "token_type":"bearer",
        "role":user.role
    }

@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }