'user strict';
var sql = require('../common/db.js');
const bcryptjs = require('bcryptjs');
const config = require('../common/config.json');
var mapper = require('automapper-js');
var product = require('../viewModel/product.js');
const filter = require('../common/filter.js');
var data = {};

data.getProductList = function (userModel) {
    var productList = [];
    return new Promise((resolve, reject) => {
        var sp_query = "SELECT * FROM products;";
        sql.query(sp_query, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                res.forEach(entry => {
                                let productVm = mapper(product, entry);
                                filter.filterObject(productVm);
                                productList.push(productVm);
                            });
                            resolve(productList);
            }
        });
    });
};

;
module.exports = data;