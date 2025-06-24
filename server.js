const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for cross-origin requests
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint to serve privacy policy
app.get('/api/privacy-policy', (req, res) => {
  try {
    const privacyPolicyPath = path.join(__dirname, 'public', 'privacy-policy.json');
    const privacyPolicy = JSON.parse(fs.readFileSync(privacyPolicyPath, 'utf8'));
    res.json(privacyPolicy);
  } catch (error) {
    console.error('Error reading privacy policy:', error);
    res.status(500).json({ error: 'Failed to load privacy policy' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 