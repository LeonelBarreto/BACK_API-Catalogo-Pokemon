const express = require('express');
const { login } = require('./controllers/login');
const { listPokemons, registerPokemon, getPokemon, updatePokemon, deletePokemon } = require('./controllers/pokemons');
const { registerUser } = require('./controllers/users');

const routes = express();

routes.post('/users', registerUser);

routes.post('/login', login);

routes.post('/pokemons', registerPokemon);
routes.patch('/pokemons/:id', updatePokemon);
routes.get('/pokemons', listPokemons);
routes.get('/pokemons/:id', getPokemon);
routes.delete('/pokemons/:id', deletePokemon);

module.exports = routes;