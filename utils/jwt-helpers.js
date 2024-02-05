const jwt = require('jsonwebtoken')

exports.jwtTokens = ({ user_id, user_email }) => {
    const user = {user_id, user_email};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'40s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '5m'});
    return ({accessToken, refreshToken});
}