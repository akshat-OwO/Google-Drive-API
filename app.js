require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const filePath = path.join(__dirname, 'cat.jpg');

async function uploadFile() {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: 'a cat.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
            }
        });

        console.log(response.data);
    } catch(error) {
        console.log(error.message);
    }
}

// uploadFile();

async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: '1M9dyIJGt1SwhnusEn6N0ylKp27WjRvb-'
        });

        console.log(response.data, response.status);
    } catch(error) {
        console.log(error.message);
    }
}

// deleteFile();

async function generatePublicURL() {
    try {
        const fileId = '1FUr8ruZ-7DxYBz_l2MF9tJKJQXvlYWXu';
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })

        console.log(result.data);
    } catch(error) {
        console.log(error.message);
    }
}

generatePublicURL();