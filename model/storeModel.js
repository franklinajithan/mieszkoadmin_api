'user strict';
var connection = require('../common/db.js');
const bcryptjs = require('bcryptjs');
const config = require('../common/config.json');
var mapper = require('automapper-js');
var store = require('../viewModel/store.js');
const filter = require('../common/filter.js');
const { debug } = require('request');
var data = {};

data.getStoreList = function (userModel) {
    var storeList = [];
    return new Promise((resolve, reject) => {
        var sp_query = "SELECT * FROM stores;";
        connection.query(sp_query, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                res.forEach(entry => {
                    let storeVm = mapper(store, entry);
                    filter.filterObject(storeVm);
                    storeList.push(storeVm);
                });
                resolve(storeList);
            }
        });
    });
};

data.updateStore = function (storeId, storename, location, address, postcode) {
    return new Promise((resolve, reject) => {
        const sp_query = `UPDATE stores SET storename = ?, location = ?, address = ?, postcode = ?  WHERE StoreID = ?`;
        connection.query(sp_query, [storename, location, address, postcode, storeId], (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.deleteStore = function (storeId) {
    return new Promise((resolve, reject) => {
        const sp_query = `DELETE FROM stores WHERE StoreID = ?`;
        connection.query(sp_query, [storeId], (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.addStore = function (storename, location, address, postcode) {
    return new Promise((resolve, reject) => {
        const sp_query = `INSERT INTO stores (storename, location, address, postcode) VALUES (?, ?, ?, ?)`;
        connection.query(sp_query, [storename, location, address, postcode], (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.uploadPriceDetails = function (selectedStore, file) {






    debugger;
    return new Promise((resolve, reject) => {
        const sp_query = "SET @store, @barcode = ? ,@productname = ? ,@price = ? ; CALL UpdateProductList(@store, @barcode,@productname,@price);"
        try {
            file.forEach(async element => {
debugger;
                var params = [selectedStore, element[1], element[2], element[8]];

                await connection.query(sp_query, params, (err, res) => {
                    console.log(res)
                    console.log(err)

                })
            });
            return resolve("success");
        } catch (error) {
            console.log(error)
        }
    });
};



module.exports = data;