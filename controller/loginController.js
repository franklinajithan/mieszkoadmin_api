const express = require('express');
const requireAuth = require('../common/tokenValidator');
const config = require('../common/config.json');
const user = require('../model/personModel');
const router = express.Router();
const enums = require('../common/enums');
const log = require('../model/logModel');
const login = require('../model/loginModel'); 

router.use(requireAuth);

const fileName = __filename.slice(__dirname.length + 1);

router.get('/personInfo', (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    user.getUserInfo(function (req, res) {
        log.logInfo(enums.logLevel.Error, "Logged", null, fileName, loggedInUser.username);
        res.status(403).json("Error occurred");
    });
});

router.get('/refreshTokenPopupTimeoutInMinutes', async(req, res) => {
    try{
        var refreshTokenPopupTimeoutInMinutes = await login.getRefreshTokenPopupTimeoutInMinutes();
        res.status(200).json(refreshTokenPopupTimeoutInMinutes);
    }catch(err){
        res.status(403).json("Error occurred");
    }
});

module.exports = router;
