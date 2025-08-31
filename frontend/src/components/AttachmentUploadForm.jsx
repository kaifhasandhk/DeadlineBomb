// frontend/src/components/AttachmentUploadForm.jsx

import React, { useState } from 'react';

const AttachmentUploadForm = ({ taskId, onUploadSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadMessage('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setUploadMessage('Uploading...');

    const formData = new FormData();
    formData.append('attachment', selectedFile);

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/upload-attachment/${taskId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setUploadMessage('File uploaded successfully!');
        setSelectedFile(null);
        onUploadSuccess(updatedTask);
      } else {
        const errorData = await response.json();
        setUploadMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadMessage('An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h4>Upload a Note</h4>
      <form onSubmit={handleUploadSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          required 
          className="file-input"
        />
        <div className="upload-form-actions">
          <button type="submit" disabled={isUploading || !selectedFile} className="upload-btn">
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-upload-btn">
            Cancel
          </button>
        </div>
      </form>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default AttachmentUploadForm;