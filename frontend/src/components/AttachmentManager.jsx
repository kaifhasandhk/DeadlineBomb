import React, { useState } from 'react';
import './AttachmentManager.css'; 


const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);


const AttachmentManager = ({ task, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
 
    if (e.target.files[0] && e.target.files[0].type === 'application/pdf') {
      setFile(e.target.files[0]);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected.');
      return;
    }
    
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('attachment', file);

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/upload-attachment/${task._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      onUpdate(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        await fetch(`http://localhost:5000/api/tasks/attachment/${task._id}`, {
          method: 'DELETE',
        });
        onUpdate(); 
      } catch (err) {
        setError('Failed to delete attachment.');
        console.error(err);
      }
    }
  };


  return (
    <div className="attachment-manager">
      {task.attachment && task.attachment.filePath ? (
        <div className="attachment-display">
          <div className="attachment-info">
            <FileIcon />
            <a 
              href={`http://localhost:5000/${task.attachment.filePath}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="attachment-link"
            >
              {task.attachment.fileName}
            </a>
          </div>
          <button onClick={handleDelete} className="delete-attachment-btn">Delete</button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="attachment-upload-form">
          <p>No attachment found. Please upload a PDF.</p>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="file-input"
            accept=".pdf" 
          />
          <button type="submit" className="upload-btn" disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}
       {error && <p className="upload-error-message">{error}</p>}
    </div>
  );
};

export default AttachmentManager;
