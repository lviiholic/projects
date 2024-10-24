// server.js (Node.js backend)
const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint to fetch URL metadata
app.post('/fetch-url-info', async (req, res) => {
    const { url } = req.body;

    // Validate the URL format
    if (!/^https?:\/\//.test(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').text() || 'No title available';
        const snippet = $('meta[name="description"]').attr('content') || 'No snippet available';

        res.json({ title, snippet });
    } catch (error) {
        console.error('Error fetching URL info:', error);
        res.status(500).json({ error: 'Failed to fetch URL information' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});