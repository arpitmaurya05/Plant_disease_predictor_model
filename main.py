from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import json
import io

app = FastAPI()

# Allow React (running on localhost:3000 or 5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict this to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("plant_disease_model.keras")

with open("class_labels.json") as f:
    labels = {int(k): v for k, v in json.load(f).items()}

IMG_SIZE = 128

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class = labels[int(np.argmax(prediction))]
    confidence = float(np.max(prediction) * 100)

    return {
        "disease": predicted_class,
        "confidence": round(confidence, 2)
    }

@app.get("/")
def root():
    return {"message": "Plant Disease Detection API is running"}