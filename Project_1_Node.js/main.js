const {google} = require('googleapis');
const keys = require('./Keys.json');
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens){
    if(err){
        console.log(err);
        return;
    }
    else{
        console.log('Connected!');
        gsrun(client);
    }

});

async function gsrun(cl){
    const gsapi = google.sheets({version: 'v4', auth: cl});

    const opt = {
        spreadsheetId: '1CeSpR0H45EPwlVyUqdEHJ2mcPlTEjycj7Hg74aQxtQM',
        range:'Data!A1:B5'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    console.log(data);
}
