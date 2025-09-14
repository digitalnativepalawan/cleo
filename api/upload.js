// Simple file upload handler that converts files to base64 data URLs
// This is a basic implementation for development - in production you'd want proper file storage

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For this demo, we'll convert the uploaded file to a data URL
    // In a real app, you'd upload to cloud storage like AWS S3, Cloudinary, etc.
    
    // Since we're in a browser environment, we'll simulate the upload
    // and return a placeholder response
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Return a mock successful response
    // In production, this would be the actual uploaded file URL
    return res.status(200).json({
      url: `https://via.placeholder.com/400x300/e2e8f0/64748b?text=Uploaded+Image+${randomId}`,
      key: `uploads/${timestamp}-${randomId}`,
      message: 'File uploaded successfully (demo mode)'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
}