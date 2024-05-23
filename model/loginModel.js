'user strict';
var sql = require('../common/db.js');
const bcryptjs = require('bcryptjs');
const config = require('../common/config.json');
var data = {};

data.getUser = function (userModel) {
    return new Promise((resolve, reject) => {
        var sp_query = "SET @Username = ?; CALL usp_GetHashedPassword (@Username);";    //sp_query has the hashed password
        sql.query(sp_query, userModel.username, (err, res) => {
            let test = res[1][0].result;
            let ss = res[1][0].extResult;
            if (res[1] != undefined && res[1][0].extResult == 'Rst') {

                //Will work on this later /if (bcryptjs.compareSync(userModel.password, res[1][0].result)) {
                if (userModel.password == res[1][0].result) {
                    resolve(res[1][0]);
                }
                else {
                    reject("Invalid Credentials");
                }
            }
            else if (res[1] != undefined && res[1][0].result == 'InvCrd') {
                reject("Invalid Credentials");
            }
            else {
                let test = res[1][0].result;
                if (userModel.password == res[1][0].result) {
                    resolve(res);
                }
                else {
                    reject("Invalid Credentials");
                }

                // if (bcryptjs.compareSync(userModel.password, res[1][0].result)) {
                //     resolve(res);
                // }
                // else {
                //     reject("Invalid Credentials");
                // }
            }
        });
    });
};

data.getRefreshTokenPopupTimeoutInMinutes = async () => {
    return new Promise((resolve, reject) => {
        resolve(parseInt(config.refreshTokenPopupTimeoutInMinutes));
    });
};
module.exports = data;