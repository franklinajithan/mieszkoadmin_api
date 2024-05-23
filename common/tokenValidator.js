const sessionManager = require('../common/sessionManager');
const config = require('../common/config.json');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers['authorization'];
    if (token == undefined) {
      return res.status(401).json({ "error": true, "message": 'Access Denied.' });
    }
    //const decodedResult = jwt.verify(token, config.secret);
    if (token) {
      // var sessionStatus = await sessionManager.isValidSession(decodedResult.username, token);
      // if (sessionStatus != "Valid") {
      //   return res.status(200).json('Invalid Session');
      // }
      // {
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          return res.status(401).json({ "error": true, "message": 'Access Denied.' });
        }
        req.decoded = decoded;
        next();
      });
      // }
    } else {
      // if there is no token
      // return an error
      return res.status(403).json({
        "error": true,
        "message": "No token found"
      });
    }
  }
  catch (Exception) {
    return res.status(200).json('Token Expired');
  }
};