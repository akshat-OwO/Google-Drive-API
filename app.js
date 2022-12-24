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
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})


async function generatePublicUrl(fileId) {
    try {        
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        })
        console.log(result.data)
    }   catch (error) {
        console.log(error)
    }
}

//req ke saath ek property ayegi to ye subname uss property ko simulate kar rha hai
let subname = 'appliedPhysics1'

//obj of all the subs and their IDs
const subs = {
    appliedPhysics1: '1ZlXeO_Y5xuNvGs28QkCY9-ei2TQUXAKz',
    appliedMaths1: '1bTDDFPpAigGkkg7kL5zrbPQ6veLqJpfL'
}

async function searchFile() {
    const files = [];

    try {
    const res = await drive.files.list({
        q: `mimeType='application/pdf' and '${subs[subname]}' in parents`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    Array.prototype.push.apply(files, res.files);
    res.data.files.forEach(function(file) {
        //generating url for each pdf file in the selected subject directory
        generatePublicUrl(file.id)
    });
    return res.data.files;
    } catch (err) {
        console.log('error')
    throw err;
    }
}

searchFile()
