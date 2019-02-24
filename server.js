const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const util = require('util');


// require('dotenv').config();
const port = process.env.PORT || 5000;
const PLAID_ENDPOINT = 'https://sandbox.plaid.com';
console.log(process.env.PLAID_PUBLIC_KEY);
let access_token = '';

// Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

//production mode
if(process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}

app.post('/api/public_handoff', async (req, res) => {
  if(access_token) {
    res.status(200).send('Accepted');
    return;
  }
  const token_req = await axios.post(PLAID_ENDPOINT + '/item/public_token/exchange', {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    public_token: req.body.public_token
  });
  console.log(token_req);
  access_token = token_req.data.access_token;
  res.status(200).send('Accepted');
});

app.post('/api/identity/get', async (req, res) => {
  if(!access_token) {
    res.status(500).send('Page unknown');
    return;
  }
  const identity_req = await axios.post(PLAID_ENDPOINT + '/identity/get', {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    access_token: access_token,
  });
  console.log(identity_req);
  res.send(identity_req.data);
})
// Route setup
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

// Start server
app.listen(port, (req, res) => {
  console.log(`Server listening on port: ${port}`);
});