'user strict';
var sql = require('../common/db.js');
var data = {};

data.checkRBAC = function (username, controllerName, methodName, res) {
    return new Promise((resolve, reject) => {
        var params = [username, controllerName, methodName];
        var sp_query = "SET @Username = ?,@ControllerName = ?,@MethodName = ?; CALL usp_ValidateRBAC (@Username,@ControllerName,@MethodName);";
        sql.query(sp_query, params, (err, resPermission) => {
            var status = resPermission[1][0].Permission;
            if (status == "NotAuthorized")
                reject("Authorization Denied");
            else resolve("OK");

        });
    });
}

data.updateSessionToken = function (username, token) {
    return new Promise((resolve, reject) => {
        var params = [username, token];
        var sp_query = "SET @Username = ?,@Token = ?; CALL usp_UpdateSessionToken (@Username,@Token);";
        sql.query(sp_query, params, (err, res) => {
            resolve("OK");
        });
    });
};

data.isValidSession = async function (username, token) {
    return new Promise((resolve, reject) => {
        var params = [username, token];
        var sp_query = "SET @Username = ?,@Token = ?; CALL usp_ValidateSessionToken (@Username,@Token);";
        sql.query(sp_query, params, (err, res) => {
            resolve(res[1][0].Status);
        });
    });
};

module.exports = data;