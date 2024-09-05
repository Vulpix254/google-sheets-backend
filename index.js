const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config(); // Ensure you have dotenv installed to load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Load Google Sheets API credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Endpoint to fetch data from Google Sheets
app.get('/getData', async (req, res) => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const spreadsheetId = 'your-spreadsheet-id-here'; // replace with your Google Sheet ID
        const range = 'List!A:S'; // replace with the appropriate range in your sheet

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        res.json(response.data.values);
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).send('Error fetching data');
    }
});

// Endpoint to fetch OMDB API key from the environment
app.get('/getOMDBApiKey', (req, res) => {
    res.json({ apiKey: process.env.OMDB_API_KEY });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
