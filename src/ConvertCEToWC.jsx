import React, { useState } from 'react';
import './ConvertCEToWC.css';

const ConvertCEToWC = () => {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('Main Products');
  const [buttonText, setButtonText] = useState('View On AcBuy');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFile(file);
      setError(null);
    } else {
      setFile(null);
      setError('Please upload a valid CSV file');
    }
  };

  const convertCSV = async (csvText) => {
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1);

    // Find column indices from the old CSV
    const titleIndex = headers.findIndex(h => h.trim() === 'Title');
    const imageIndex = headers.findIndex(h => h.trim() === 'Product Image');
    const linkIndex = headers.findIndex(h => h.trim() === 'Product Link');

    // Create new CSV data
    const newHeader = [
      "ID", "Type", "SKU", "Name", "Published", "Is featured?", "Visibility in catalog",
      "Short description", "Description", "Date sale price starts", "Date sale price ends",
      "Tax status", "Tax class", "In stock?", "Stock", "Low stock amount", "Backorders allowed?",
      "Sold individually?", "Weight (kg)", "Length (cm)", "Width (cm)", "Height (cm)",
      "Allow customer reviews?", "Purchase note", "Sale price", "Regular price", "Categories",
      "Tags", "Shipping class", "Images", "Download limit", "Download expiry days", "Parent",
      "Grouped products", "Upsells", "Cross-sells", "External URL", "Button text", "Position",
      "Attribute 1 name", "Attribute 1 value(s)", "Attribute 1 visible", "Attribute 1 global"
    ];

    const newRows = data.map(row => {
      if (row.length <= 1) return null; // Skip empty rows
      return [
        "", // ID
        "external", // Type
        "", // SKU
        row[titleIndex], // Name
        "1", // Published
        "0", // Is featured?
        "visible", // Visibility in catalog
        "", // Short description
        "", // Description
        "", // Date sale price starts
        "", // Date sale price ends
        "taxable", // Tax status
        "", // Tax class
        "1", // In stock?
        "1", // Stock
        "", // Low stock amount
        "0", // Backorders allowed?
        "0", // Sold individually?
        "", // Weight
        "", // Length
        "", // Width
        "", // Height
        "1", // Allow customer reviews?
        "", // Purchase note
        "", // Sale price
        "", // Regular price
        category, // Categories (now using user input)
        "", // Tags
        "", // Shipping class
        row[imageIndex], // Images
        "", // Download limit
        "", // Download expiry days
        "", // Parent
        "", // Grouped products
        "", // Upsells
        "", // Cross-sells
        row[linkIndex], // External URL
        buttonText, // Button text (now using user input)
        "0", // Position
        "", // Attribute 1 name
        "", // Attribute 1 value(s)
        "", // Attribute 1 visible
        "" // Attribute 1 global
      ];
    }).filter(row => row !== null);

    return [newHeader, ...newRows].map(row => row.join(',')).join('\n');
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const text = await file.text();
      const convertedData = await convertCSV(text);
      
      // Create and download the new CSV file
      const blob = new Blob([convertedData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_wc.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error converting file: ' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="content-body">
      <div className="content-header">
        <h1>Convert CE To WC</h1>
      </div>

      <div className="converter-container">
        <div className="welcome-section">
          <h2>CSV Converter Tool</h2>
          <p>Convert your products from the google chrome extension to woocommerce products for importing into your spreadsheet!</p>
        </div>

        <div className="converter-card">
          <div className="input-group">
            <label htmlFor="category">Product Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter product category"
              className="text-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="buttonText">Button Text:</label>
            <input
              type="text"
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text"
              className="text-input"
            />
          </div>

          <div className="file-upload-section">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="csvFile"
              className="file-input"
            />
            <label htmlFor="csvFile" className="file-label">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>{file ? file.name : 'Choose CSV file'}</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={!file || isConverting}
          >
            {isConverting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Converting...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt"></i>
                Convert File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertCEToWC; 