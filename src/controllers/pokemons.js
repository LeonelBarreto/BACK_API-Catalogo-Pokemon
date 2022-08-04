const { query } = require('../database/connection');
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret");

const registerPokemon = async (req, res) => {
    const { name, skills, image, nickname, token } = req.body;


    if (!name || skills || !token) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    };

    try {
        const user = jwt.verify(token, jwtSecret);

        const pokemon = await query('insert into pokemons (user_id, name, skills, image, nickname) values ($1, $2, $3, $4, $5)', [user.id, name, skills, image, nickname]);

        if (pokemon.rowCount === 0) {
            return res.status(400).json({ message: 'Unable to register pokemon.' });
        };

        return res.status(200).json({ message: 'Pokemon registered successfully.' })
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const updatePokemon = async (req, res) => {
    const { id } = req.params;
    const { nickname, token } = req.body;


    if (!nickname || !token) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    };

    try {
        const user = jwt.verify(token, jwtSecret);

        const pokemon = await query('select * from pokemons where id = $1 and user_id = $2', [id, user.id]);

        if (pokemon.rowCount === 0) {
            return res.status(400).json({ message: 'Pokemon not found.' });
        };

        const pokemonUpdated = await query('update pokemons set nickname = $1 where id = $2', [nickname, id]);

        if (pokemonUpdated.rowCount === 0) {
            return res.status(400).json({ message: 'Could not update pokemon.' });
        };

        return res.status(200).json({ message: 'Pokemon successfully updated.' });
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const listPokemons = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(404).json({ message: 'The token is required.' });
    };

    try {
        const verifyUser = jwt.verify(token, jwtSecret);

        const { rows: pokemons } = await query(`select p.id, u.name as user, p.name, p.nickname, p.skills, p.image 
        from pokemons p left join users u on u.id = p.user_id where p.user_id = $1`, [verifyUser.id]);

        for (const pokemon of pokemons) {
            pokemon.skills = pokemon.skills.split(',');
        };

        return res.status(200).json(pokemons);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const getPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
        return res.status(404).json({ message: 'The token is required.' });
    };

    try {
        const user = jwt.verify(token, jwtSecret);

        const pokemon = await query(`select p.id, u.name as user, p.name, p.nickname, p.skills, p.image
        from pokemons p left join users u on u.id = p.user_id where p.id = $1 and p.user_id = $2`, [id, user.id]);

        if (pokemon.rowCount === 0) {
            return res.status(400).json({ message: 'Pokemon not found.' });
        };

        const foundPokemon = pokemon.rows[0];

        foundPokemon.skills = foundPokemon.skills.split(',');

        return res.status(200).json(foundPokemon);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const deletePokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const user = jwt.verify(token, jwtSecret);

        const pokemon = await query('select * from pokemons where id = $1 and user_id = $2', [id, user.id]);

        if (pokemon.rowCount === 0) {
            return res.status(400).json({ message: 'Pokemon not found.' });
        };

        const pokemonDeleted = await query('delete from pokemons where id = $1', [id]);

        if (pokemonDeleted.rowCount === 0) {
            return res.status(400).json({ message: 'Could not delete pokemon.' });
        };

        return res.status(200).json({ message: 'Pokemon was successfully deleted.' });
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

module.exports = {
    registerPokemon,
    updatePokemon,
    listPokemons,
    getPokemon,
    deletePokemon
};