const express = require('express');
const log = require('../model/logModel');
const enums = require('../common/enums');
const fs = require('fs');
const router = express.Router();
const axios = require('axios');
const fileName = __filename.slice(__dirname.length + 1);

router.get('/', async (req, res) => {
  log.logInfo(enums.logLevel.Info, "Help Controller", "Web API is Running", fileName, null);
  res.status(200).json("WebAPI is running");
});


router.post('/test', async (req, res) => {
  debugger
  let { store, productId, barcode, module, startDate, endDate } = req.body;
  store = 'http://62.64.134.130:1500';
  productId =33363;
  let url = store + '/api/Product/ProductAuditTrailData?';
  // let url = storeIp;

  if (productId) {
    url += 'ProdID=' + productId;
  }
  if (barcode) {
    url += '&SearchBarcode=' + barcode;
  }

  if (module) {
    url += '&SearchModule=' + module;
  }

  if (startDate) {
    url += '&SearchStartDate=' + startDate;
  }

  if (endDate) {
    url += '&SearchEndDate=' + endDate;
  }

  //let mspurl = storeIp+'http://62.64.134.130:1500/api/Product/ProductAuditTrailData?ProdID=33363';

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;