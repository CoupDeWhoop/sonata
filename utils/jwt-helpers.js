const jwt = require('jsonwebtoken')

exports.jwtTokens = ({ user_id, user_email }) => {
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const role = user_email === adminEmail ? 'admin' : 'user';

    const user = {user_id, user_email, role};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'3m'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '5m'});
    return ({accessToken, refreshToken});
}