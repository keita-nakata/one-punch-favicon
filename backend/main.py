from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from favicon_converter import convert_favicon

class Image(BaseModel):
    base64_image: str

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可する場合
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

@app.get("/")
async def root():
    return {"greeting":"Hello world"}

@app.post("/favicon")
async def convert_favicon_api(image: Image):
    zipfile_url = convert_favicon(image.base64_image)
    return {"zipfile_url": zipfile_url}

# if __name__ == '__main__':
#     import uvicorn
#     uvicorn.run("main:app", port=8000, reload=True)