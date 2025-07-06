from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Blog API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT 설정
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Pydantic 모델들
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# 임시 데이터 저장소 (실제로는 데이터베이스 사용)
users_db = []
posts_db = []

# JWT 토큰 생성
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 현재 사용자 가져오기
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = next((user for user in users_db if user["username"] == token_data.username), None)
    if user is None:
        raise credentials_exception
    return user

# 인증 엔드포인트
@app.post("/auth/register", response_model=User)
async def register(user: UserCreate):
    # 중복 사용자 확인
    if any(u["username"] == user.username for u in users_db):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if any(u["email"] == user.email for u in users_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 실제로는 비밀번호 해싱 필요
    new_user = {
        "id": len(users_db) + 1,
        "username": user.username,
        "email": user.email,
        "password": user.password,  # 실제로는 해싱된 비밀번호 저장
        "is_active": True
    }
    users_db.append(new_user)
    return new_user

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest):
    user = next((u for u in users_db if u["username"] == login_data.username and u["password"] == login_data.password), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 포스트 엔드포인트
@app.get("/posts", response_model=List[Post])
async def get_posts():
    return posts_db

@app.post("/posts", response_model=Post)
async def create_post(post: PostCreate, current_user: dict = Depends(get_current_user)):
    new_post = {
        "id": len(posts_db) + 1,
        "title": post.title,
        "content": post.content,
        "author_id": current_user["id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    posts_db.append(new_post)
    return new_post

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int):
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: int, post: PostCreate, current_user: dict = Depends(get_current_user)):
    existing_post = next((p for p in posts_db if p["id"] == post_id), None)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if existing_post["author_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    existing_post.update({
        "title": post.title,
        "content": post.content,
        "updated_at": datetime.utcnow()
    })
    return existing_post

@app.delete("/posts/{post_id}")
async def delete_post(post_id: int, current_user: dict = Depends(get_current_user)):
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post["author_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    posts_db.remove(post)
    return {"message": "Post deleted successfully"}

# 헬스체크
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 