require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { nextTick } = require('process');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://syllabusx.live'
}));

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
    appliedMaths1: '1OJKah6B3-rtjgdEyhjehSPg5jXlm-HA9',
    appliedChemistry: '12HFIwUareqq4nXdAl5LU599NAbNE18xe',
    basicChemistry: '12HFIwUareqq4nXdAl5LU599NAbNE18xe',
    communicationSkills: '1GYT9LnArvlcE7qgZ7ryv4WZjFvCOkatI',
    electricalScience: '1OjkRHa6TwYN_ZZW1ZIzfd5cL_zOcm9jT',
    manufacturingProcess: '1VVulayTgd5BMSW-mDJOUmDKJ81pGILj7',
    humanValues: '1WXxU9q9DVQlMLyYNtU6_GkjfYn1Di3OK',
    indianConstitution: '1T4f7fS3SCRncVm-AKJ2e522tdAxm9A20',
    environmentalStudies: '1SjaO00YJE2mWIFwvA1azTd4iydfSz4D8',
    dataStructures: '1jQi-4QpMgtMybu5YwLZxxyxS7ALwNNYk',
    computationalMethods: '1r3GA9A19p-1dEGX3WyZauea66WVzzAgc',
    dlcd: '1Pw5EdtlNjKSvKO6Fv4KRoGgNVAPfl9r8',
    oops: '18k6reivFFd-uldsHcTkgs6FyzYONoyOc',
    programmingInC: '14yXthKQtufm7_h281P5xieJ7BajO8Eg5',
    discreteMaths: '15GyuJVVh3O9eGERujn1wNKxxGFIFUpsz',
    analogCommunication: '1Rxq98-yTedL3qCVZ3kqutuHAsSY_ijTj',
    analogElectronics1: '1F8tkieG2RuTWidpLdiR-mu60Lslb9TZe',
    sns: '1-mN6P9Ech_6cbt4bFfDKbJvXkLiREmeW',
    electricalMaterials: '1rcGntqjnKZQNNXI1sK4Bick6Am6g3klm',
    electricalMachines: '1o1vSJw-4-6ki1xm4jMcPXJD-TdcD7G3D',
    emft: '1HS3sJFE8XZPlHw1H49pi4AFpt8upC72L',
    iks: '1_5fPQ6-DMzNOeEzmRzmFjVaF1l9JZztm',
    cAndS: '1AgoWAtDSQTtEg45y9iEXYviufDvWDPTU'
}

const books = {
    appliedChemistry: '16fEuuTeeky-EcCV1aYkd-G4wQccZwUxo',
    basicChemistry: '16fEuuTeeky-EcCV1aYkd-G4wQccZwUxo',
    appliedMaths1: '16S5tVz3tBQCdevvn4tpPlEsT3CJrduPX',
    appliedPhysics1: '16_tQCDi0Mgr11CDSirLo7_t7zui_fNMB',
    communicationSkills: '16v8N_-IFM6W7Z6RMQ8VDUEj0SiiL5tAU',
    electricalScience: '16h3WrSRYEcb_rYcOader2RrHJ7ozPuPx',
    humanValues: '16pBEgcaFaVyWDqOfgHQegHlXvteBN7z8',
    indianConstitution: '16pRBgekFiSj3533Cv27EK8lVOZ8FjQor',
    manufacturingProcess: '16gwrmQ_AldHAIPm01KHCFD_NSzAaq_B4',
    environmentalStudies: '1KRF_wYXiECSkMtkrhZIpMqcjh8MJXwzH',
    analogCommunication: '1W27VNg3kuxWIbbOeRsaTcz7nUzjg0xg0',
    analogElectronics1: '1wdlITDOLJMSpKSJ-osAgNWMVFM8Yr4QX',
    computationalMethods: '1IVN3InCkfL-GItwneaeGLoVl76MgmejT',
    dataStructures: '1PuQqW9TstPGpmdIzW7lwgnCJ9s93KvsT',
    discreteMaths: '1yMn5yuG5pT_PWn6cEGO9U2trN0N4OGm-',
    dlcd: '1qoOgO6bUrtBdVO0omQa1bo7AfRfUcGGg',
    electricMaterials: '1Kw2ntxP5kdS07jJJxlfTp3Fvpyv-M5il',
    electricalMachines: '1gZIjijqdrbc179dHZ__ZBxy9hY3ZDPm0',
    emft: '1h4-IFisUkZsg9LftMKOz6iI2tZOasPGd',
    oops: '1Egt1I3c8f5z4RPHEe8Tz2_N6cfybPskI',
    sns: '1M-NfHmwIkrE3Pg6DNLFZTIa1UwanaEqA',
    iks: '1ZHQKwzOEDNblLJqZCRGj-RMwH4PK6aGH'
}

const pyq = {
    appliedChemistry: '17i2P-gua3hy_MRqg845453zMRQuie-SC',
    basicChemistry: '17i2P-gua3hy_MRqg845453zMRQuie-SC',
    appliedMaths1: '17cY_BeG1rP8X2pp7crKW7pD8GtRSB5ik',
    appliedPhysics1: '17_TbKPfpTmbD839HVt2mFguF1ZKfiIXI',
    electricalScience: '17iftZDBZX57ZmL-3XreShKFK6LTUOsjz',
    environmentalStudies: '17jZZ5v2wsF9oZfn638I9LPFo53RfC6Ey',
    humanValues: '17liqcvkiVbqv1gaH3N__hJBotej2BNUS',
    indianConstitution: '17rGvrB5FxfXuEOs4jTh6RTPWZesm4_N9',
    manufacturingProcess: '17lWsfTjIjJXsUnMgRDgPaiA8mdOZdb-r',
    dataStructures: '1glrcs1FY-QiXsUVxTLgyd0jZgFru9k4F',
    computationalMethods: '1iMKSKcFeisiytYco8oXSOsHz1DpL0wED',
    sns: '1iQgxxMIDC_C1hyR-y3lS_dI_2UmZZqBv',
    dlcd: '1iU9Tllzjy_3-pATaku4slkNTsgWDfIql',
    analogCommunication: '1iaUr_vnXgPOZpbRIUPtmCGNByXp5LHUM',
    analogElectronics1: '1ioLzP5jfA2KmStdGvwPC9aDrBoaAh2B7',
    analogElectronics: '1dYN8uPDulFC246iJ4roG0g-9IwNzN_Je',
    iks: '1iyq2HzcAU6GU2NeeM7gnOpGJ1Yxdv6JO',
    discreteMaths: '1jGVagz2xSEIK0SuSkkfqAiZpS0al1My6',
    oops: '1j_GkygjlSnZ_7pjOzmSVM-swO7r3mlmR'
}

const practicalfile = {
    appliedChemistry: '17AxN4YUEx-EH6fK3Vvuznu_T38nOM7_F',
    basicChemistry: '17AxN4YUEx-EH6fK3Vvuznu_T38nOM7_F',
    appliedPhysics1: '16yIX_A12-nl-F4eMJ640hKXl9ytV_y26',
    electricalScience: '17BOcXTpmuBJTYAk1eKJCcuHKcdqBTLRz',
    environmentalStudies: '17OrTQM33YqWZ0jiBEN12B-GEvhyBmwAM',
    programmingInC: '17XLAtZMc96YYMemE9xto-2UDwshUdYZX'
}

async function searchNotes(subname) {
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

async function searchBooks(subname) {
    const files = [];

    try {
    const res = await drive.files.list({
        q: `mimeType='application/pdf' and '${books[subname]}' in parents`,
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

async function searchPyq(subname) {
    const files = [];

    try {
    const res = await drive.files.list({
        q: `mimeType='application/pdf' and '${pyq[subname]}' in parents`,
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

async function searchPracticalFile(subname) {
    const files = [];

    try {
    const res = await drive.files.list({
        q: `mimeType='application/pdf' and '${practicalfile[subname]}' in parents`,
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

app.get('/notes/:subname', async (req, res) => {
    const { subname } = req.params;
    const files = await searchNotes(subname);
    
    res.json(files);
});

app.get('/books/:subname', async (req, res) => {
    const { subname } = req.params;
    const files = await searchBooks(subname);

    res.json(files);
});

app.get('/pyq/:subname', async (req, res) => {
    const { subname } = req.params;
    const files = await searchPyq(subname);

    res.json(files);
});

app.get('/practicalfile/:subname', async (req, res) => {
    const { subname } = req.params;
    const files = await searchPracticalFile(subname);

    res.json(files);
});

app.listen(process.env.PORT, () => {
    console.log('connected to drive api');
});
