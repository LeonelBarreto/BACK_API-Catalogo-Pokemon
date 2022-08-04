const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const validToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Enter the token.' });
    };

    try {
        const user = jwt.verify(token, jwtSecret);

        if (!user) {
            return res.status(400).json({ message: 'Invalid token.' });
        };

    } catch (erro) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };

    next();
};

module.exports = validToken;