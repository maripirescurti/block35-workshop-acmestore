
// imports
const { 
  client,
  createTables,
  createProduct,
  createUser,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  destroyFavorite,
} = require('./db');

const express = require ('express');
const app = express();
app.use(express.json());


//APP ROUTES

//init 
const init = async() => {
  await client.connect();
  console.log('connected to database');
};

init();