const { query } = require('../database/connection');
const securePassword = require('secure-password');

const pwd = securePassword();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || ! email || !password) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    };

    try {
        const queryEmail = await query('select * from usuarios where email = $1', [email]);

        if (queryEmail.rowCount > 0) {
            return res.status(400).json({ message: 'This email is already registered.' });
        };

        const hash = (await pwd.hash(Buffer.from(password))).toString("hex");
        const user = await query('insert into usuarios (name, email, password) values ($1, $2, $3)', [name, email, hash]);
    
        if (user.rowCount === 0) {
            return res.status(400).json({ message: 'Unable to register the user.' });
        };
    
        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

module.exports = { registerUser };