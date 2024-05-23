const express = require('express');
const requireAuth = require('../common/tokenValidator');
const config = require('../common/config.json');
const product = require('../model/productModel');
const router = express.Router();
const enums = require('../common/enums');
const log = require('../model/logModel');
const jwt = require('jsonwebtoken');

router.use(requireAuth);

const fileName = __filename.slice(__dirname.length + 1);

router.get('/productlist', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    try {
       const result = await product.getProductList();
       res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Product List Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});


router.post("/productlist", async (req, res) => {
    const q = "INSERT INTO items (`SupplierID`,`Brand`,`UOM`,`ItemName`,`Price`,`Image`,`Size`) VALUES (?)"
    try {
        req.body.forEach(async element => {
            const values = [element[0].value, element[1].value, element[2].value, element[3].value, element[4].value, element[5].value, element[6].value]
            await db.query(q, [values], (err, data) => {

                console.log(err)
                console.log(data)

            })
        });
        return res.send("Book has been created successfully")
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;
