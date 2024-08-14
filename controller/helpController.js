const express = require('express');
const log = require('../model/logModel');
const enums = require('../common/enums');
const fs = require('fs');
const router = express.Router();
const axios =require('axios');
const fileName = __filename.slice(__dirname.length + 1);

router.get('/', async (req, res) => {
    log.logInfo(enums.logLevel.Info, "Help Controller", "Web API is Running", fileName, null);
    res.status(200).json("WebAPI is running");
});


router.get('/test', async (req, res) => {
    const url = 'http://62.64.134.130:1500/api/Product/ProductAuditTrailData?ProdID=33363';
  
    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
});

module.exports = router;