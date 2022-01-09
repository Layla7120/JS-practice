const {google} = require('googleapis');
const keys = require('./Keys.json');

//client authorize
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(async function(err, tokens){
    if(err){
        console.log(err);
        return;
    }
    else{
        console.log('Connected!');
        return client;
    }
});

//get data array from sheet 
async function gsrun(cl){
    const gsapi = google.sheets({version: 'v4', auth: cl});

    const opt = {
        spreadsheetId: '11Qv0_lH879Qe-y4fvwu8vJhfJIV12aKQUynjFQfTxxs', //사본 시트 id
        range:'A2:AI75'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    return dataArray;
}

//extract valuable data according to input
let input = "86091";

gsrun(client);
