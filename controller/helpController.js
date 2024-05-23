const express = require('express');
const log = require('../model/logModel');
const enums = require('../common/enums');
const fs = require('fs');
const router = express.Router();

const fileName = __filename.slice(__dirname.length + 1);

router.get('/', async (req, res) => {
    log.logInfo(enums.logLevel.Info, "Help Controller", "Web API is Running", fileName, null);
    res.status(200).json("WebAPI is running");
});

module.exports = router;