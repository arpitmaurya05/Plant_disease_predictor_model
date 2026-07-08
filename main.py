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
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("plant_disease_model_v2.keras")

with open("class_labels.json") as f:
    labels = {int(k): v for k, v in json.load(f).items()}

IMG_SIZE = 128
TOP_K = 3

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0]  # shape: (num_classes,)

    # Get indices of the top K predictions, sorted by confidence descending
    top_indices = np.argsort(prediction)[::-1][:TOP_K]

    top_predictions = [
        {
            "disease": labels[int(idx)],
            "confidence": round(float(prediction[idx]) * 100, 2)
        }
        for idx in top_indices
    ]

    return {
        "disease": top_predictions[0]["disease"],       # kept for backward compatibility
        "confidence": top_predictions[0]["confidence"],  # kept for backward compatibility
        "top_predictions": top_predictions
    }

@app.get("/")
def root():
    return {"message": "Plant Disease Detection API is running"}