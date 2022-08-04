const { query } = require('../database/connection');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    };

    try {
        const users = await query('select * from usuarios where email = $1', [email]);

        if (users.rowCount == 0) {
            return res.status(400).json({ message: 'Incorrect email or password.' });
        }

        const user = users.rows[0];

        const result = await pwd.verify(Buffer.from(password), Buffer.from(user.password, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ message: 'Incorrect email or password.' });
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(password))).toString("hex");
                    const updateRegistration = await query('update usuarios set senha = $1 where email = $2', [hash, email]);
                } catch {

                }
                break;
        };

        const token = jwt.sign({
            id: user.id,
            name: user.nome,
            email: user.email
        }, jwtSecret, {
            expiresIn: "8h"
        });

        return res.status(200).send(token);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

module.exports = { login };