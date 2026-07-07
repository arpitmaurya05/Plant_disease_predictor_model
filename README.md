 # 🌿 Plant Disease Detection System

A full-stack deep learning application that detects plant diseases from leaf images using a custom-built Convolutional Neural Network (CNN), served through a FastAPI backend and a React frontend.

## Overview

This project classifies plant leaf images into one of 38 disease/healthy categories across multiple crop species (tomato, apple, corn, grape, potato, and more). The model is trained from scratch on the [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) using TensorFlow/Keras.

## Features

- 🧠 Custom CNN trained from scratch (no transfer learning)
- ⚡ FastAPI backend serving real-time predictions
- 🎨 Simple, clean React frontend for image upload and results
- 📊 ~95% validation accuracy
- 🔍 Returns predicted disease class with confidence score

## Tech Stack

| Layer | Technology |
|---|---|
| Model Training | TensorFlow / Keras, Google Colab (GPU) |
| Dataset | Kaggle API (New Plant Diseases Dataset) |
| Backend | FastAPI, Uvicorn |
| Frontend | React (Vite) |
| Image Processing | Pillow, NumPy |

## Model Architecture

A sequential CNN with:
- 3 Convolutional blocks (32 → 64 → 128 filters) with MaxPooling
- Fully connected Dense layer (256 units) with Dropout (0.5) for regularization
- Softmax output layer across 38 classes

**Training results:**
- Validation Accuracy: ~95%
- Validation Loss: ~0.18

## Project Structure

```
plant_diseases/
├── main.py                      # FastAPI backend serving predictions
├── requirements.txt             # Backend Python dependencies
├── plant_disease_model.keras    # Trained CNN model
├── class_labels.json            # Class index → disease name mapping
└── frontend/                    # React frontend (Vite)
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## Setup & Installation

### Prerequisites
- Python 3.11 (recommended for TensorFlow compatibility on Apple Silicon)
- Node.js and npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd plant_diseases
```

### 2. Backend setup
```bash
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

## Running the Application

**Terminal 1 — Start the backend:**
```bash
source venv/bin/activate
python3 -m uvicorn main:app --port 8000
```
Backend runs at `http://127.0.0.1:8000`
Interactive API docs available at `http://127.0.0.1:8000/docs`

**Terminal 2 — Start the frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

## API Reference

### `POST /predict`
Accepts an image file and returns the predicted disease class with confidence.

**Request:** `multipart/form-data` with a `file` field (image)

**Response:**
```json
{
  "disease": "Tomato___Early_blight",
  "confidence": 94.32
}
```

## Dataset

Trained on the [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) (augmented), containing ~87,000 images across 38 classes of healthy and diseased plant leaves.

## Future Improvements

- [ ] Deploy backend and frontend to cloud hosting (Render/Vercel)
- [ ] Add confusion matrix and per-class metrics to evaluate weak spots
- [ ] Support batch image uploads
- [ ] Add treatment recommendations for detected diseases
- [ ] Improve mobile responsiveness of the UI

## Author

Built by Arpit Maurya as a machine learning + full-stack project.

 
