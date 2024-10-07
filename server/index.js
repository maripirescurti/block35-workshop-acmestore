
// imports
const { client } = require('./db');

//APP ROUTES

//init 
const init = async() => {
  await client.connect();
  console.log('connected to database');
};

init();