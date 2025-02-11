const { getAdmin } = require('../../config/firebase');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decodedToken = await getAdmin().auth().verifyIdToken(token);
            req.user = decodedToken;
            next();
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
};

module.exports = authenticate;
