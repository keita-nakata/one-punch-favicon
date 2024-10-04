from fastapi import FastAPI
from pydantic import BaseModel
from favicon_converter import convert_favicon

class Image(BaseModel):
    base64_image: str

app = FastAPI()

@app.get("/")
async def root():
    return {"greeting":"Hello world"}

@app.post("/favicon")
async def convert_favicon_api(image: Image):
    zipfile_url = convert_favicon(image.base64_image)
    return {"zipfile_url": zipfile_url}