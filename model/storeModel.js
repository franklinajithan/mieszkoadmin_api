'user strict';
var connection = require('../common/db.js');
const bcryptjs = require('bcryptjs');
const config = require('../common/config.json');
var mapper = require('automapper-js');
var store = require('../viewModel/store.js');
const filter = require('../common/filter.js');
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


module.exports = data;