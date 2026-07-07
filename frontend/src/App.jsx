import { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Something went wrong. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌿 Plant Disease Detector</h1>
      <p className="subtitle">Upload a leaf image to detect disease</p>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="upload-label">
          {selectedImage ? selectedImage.name : 'Choose an image'}
        </label>
      </div>

      {preview && (
        <div className="preview-box">
          <img src={preview} alt="Preview" />
        </div>
      )}

      <button
        onClick={handlePredict}
        disabled={!selectedImage || loading}
        className="predict-btn"
      >
        {loading ? 'Analyzing...' : 'Predict Disease'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-box">
          <h2>{result.disease.replace(/_/g, ' ')}</h2>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;