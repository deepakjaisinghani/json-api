const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Import multer for file uploads

const app = express();
const PORT = process.env.PORT || 31010;
const dataDir = process.env.DATA_DIR || '/app/data';

// Setup multer storage - save uploaded files to /app/data
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dataDir); // Use the /app/data directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to upload files
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.json({ message: `File uploaded successfully: ${req.file.originalname}` });
});

app.get('/api/json-files', (req, res) => {
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to list JSON files' });
        }
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        res.json(jsonFiles);
    });
});

app.get('/api/data/:filename', (req, res) => {
    const filePath = path.join(dataDir, req.params.filename);
    if (!filePath.endsWith('.json')) {
        return res.status(400).json({ error: 'Invalid file type' });
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
