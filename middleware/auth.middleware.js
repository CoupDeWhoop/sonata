const jwt  = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; //"Bearer Token ..."
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({err: "Null token"});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //don't use Promise.reject here either
        if (err) return res.status(403).json({ error: err.message }); 
        req.user = user; // puts the user prop on the request
        next();
    })
}
