const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load Google Sheets API credentials
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'list-hosting-4a95eacab374.json'), // replace with the path to your JSON credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Endpoint to fetch data from Google Sheets
app.get('/getData', async (req, res) => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const spreadsheetId = '1hAsF2iK_EUkkUHsJSFgcULdjnOmq5xm9fyYk7muavyI'; // replace with your Google Sheet ID
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
