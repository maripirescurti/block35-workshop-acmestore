
// imports
const { 
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require('./db');

const express = require ('express');
const app = express();
app.use(express.json());


//APP ROUTES
// get - read
app.get('/api/users', async(req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch(ex) {
    next(ex)
  }
});

app.get('/api/products', async(req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch(ex) {
    next(ex)
  }
});

app.get('/api/users/:id/favorites', async(req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch(ex) {
    next(ex)
  }
});

// post - create
app.post('/api/users/:id/favorites', async(req, res, next) => {
  try {
    res.status(201).send(await createFavorite({
      user_id: req.params.id,
      product_id: req.body.product_id
    }))
  } catch(ex) {
    next(ex);
  }
});

// delete
app.delete('/api/users/:userId/favorites/:id', async(req, res, next) => {
  try {
    await destroyFavorite({
      user_id:req.params.userId,
      id: req.params.id
    });
    res.sendStatus(204);
  } catch(ex) {
    next(ex);
  }
});


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

  const users = await fetchUsers();
  console.log(users);

  const products = await fetchProducts();
  console.log(products);

  const favorites = await Promise.all([
    createFavorite({ user_id: mari.id, product_id: sponge.id}),
    createFavorite({ user_id: mari.id, product_id: pen.id}),
    createFavorite({ user_id: ozan.id, product_id: ball.id}),
    createFavorite({ user_id: simba.id, product_id: ball.id})
  ]);
  console.log(await fetchFavorites(mari.id));
  await destroyFavorite({ user_id: mari.id, id: favorites[0].id});
  console.log(await fetchFavorites(mari.id));

  console.log(`CURL localhost:3000/api/users/${mari.id}/favorites`);
  console.log(`CURL -X POST localhost:3000/api/users/${mari.id}/favorites -d '{"product_id":"${sponge.id}"}' -H 'Content-Type:application/json'`);
  console.log(`CURL -X DELETE localhost:3000/api/users/${mari.id}/favorites/${favorites[3].id}'`);

  console.log('data seeded');

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on ${port}`));
};

init();