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

      {result && result.top_predictions && (
        <div className="results-list">
          <h3 className="results-heading">Predictions</h3>
          {result.top_predictions.map((pred, index) => (
            <div
              key={index}
              className={`result-row ${index === 0 ? 'result-row-primary' : ''}`}
            >
              <div className="result-row-top">
                <span className="result-rank">#{index + 1}</span>
                <span className="result-name">
                  {pred.disease.replace(/_/g, ' ')}
                </span>
                <span className="result-confidence">{pred.confidence}%</span>
              </div>
              <div className="confidence-bar-track">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${pred.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;