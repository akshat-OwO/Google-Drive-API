require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { nextTick } = require('process');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', (req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.get('/', (req, res) => {
    res.json({msg: 'drive api working!'});
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

//obj of all the subs and their IDs
const subs = {
    appliedPhysics1: '1ZlXeO_Y5xuNvGs28QkCY9-ei2TQUXAKz',
    appliedMaths1: '1bTDDFPpAigGkkg7kL5zrbPQ6veLqJpfL'
}

async function searchFile(subname) {
    const files = [];

    try {
    const res = await drive.files.list({
        q: `mimeType='application/pdf' and '${subs[subname]}' in parents`,
        fields: 'nextPageToken, files(id, name, webViewLink)',
        spaces: 'drive',
    });
    Array.prototype.push.apply(files, res.files);
    return res.data.files;
    } catch (err) {
        console.log('error')
    throw err;
    }
}

app.get('/:subname', async (req, res) => {
    const { subname } = req.params;
    const files = await searchFile(subname);
    
    res.json(files);
});

app.listen(process.env.PORT, () => {
    console.log('connected to drive api');
});