const jwt  = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; //"Bearer Token ..."
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({error: "Null token"});// not Promise.reject

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         if (err) {
            if (err.message === 'invalid signature' || err.message === 'jwt malformed') return res.status(401).json({ error: err.message })
            if (err.message === 'jwt expired') return res.status(403).json({ error: err.message})
            return res.status(403).json({ error: err.message });  
         }
        req.user = user; // puts the user prop on the request
        next();
    })
}

exports.requireAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({error: 'Forbidden: Admin privileges required'})
    }
    next()
}
