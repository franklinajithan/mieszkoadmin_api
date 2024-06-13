const express = require('express');
const requireAuth = require('../common/tokenValidator');
const config = require('../common/config.json');
const store = require('../model/storeModel');
const router = express.Router();
const enums = require('../common/enums');
const log = require('../model/logModel');
const jwt = require('jsonwebtoken');

router.use(requireAuth);

const fileName = __filename.slice(__dirname.length + 1);

router.get('/storelist', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    try {
        const result = await store.getStoreList();
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Store List Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});

router.put('/update/:storeId', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    const storeId = req.params.storeId;
    const { storename, location, address, postcode } = req.body;
    try {
        const result = await store.updateStore(storeId, storename, location, address, postcode);
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Update Store Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});

router.delete('/delete/:storeId', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    const storeId = req.params.storeId;
    try {
        const result = await store.deleteStore(storeId);
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Delete Store Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});

router.post('/add', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    const { storename, location, address, postcode } = req.body;
    try {
        const result = await store.addStore(storename, location, address, postcode);
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Add Store Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});


router.post('/uploadPrice', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    const { file, selectedStote } = req.body;
    try {
        const result = await store.uploadPriceDetails(selectedStote, JSON.parse(file));
        console.log(result)
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Add Store Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});








module.exports = router;
