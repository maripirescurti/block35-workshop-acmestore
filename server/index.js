
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
  await createTables();
  console.log('tables created');
  const [mari, ozan, simba, mug, ball, pen, sponge] = await Promise.all([
    createUser({ username: 'mari', password: 'g5tfrs'}),
    createUser({ username: 'ozan', password: 'g5tfrs!!'}),
    createUser({ username: 'simba', password: 'shhhh'}),
    createProduct({ name: 'mug' }),
    createProduct({ name: 'ball' }),
    createProduct({ name: 'pen' }),
    createProduct({ name: 'sponge' })
  ])


  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on ${port}`));
};

init();