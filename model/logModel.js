'user strict';
var sql = require('../common/db.js');
const config = require('../common/config.json');

var data = {};

data.logInfo = async function (level, source, content, url, username) {
    if ((config.infoLogStatus == true && level == "info") || (config.errorLogStatus == true && level == "error") || (config.debugLogStatus == true && level == "debug" || (config.styAPIInfoLogStatus == true && level == "styapiinfo") || (config.styAPIErrorLogStatus == true && level == "styapierror"))) {
        return new Promise((resolve, reject) => {
            var params = [level, source, content, url, username];
            var sp_query = "SET @Level = ?,@Source = ?,@Content = ?,@Url = ?,@Username = ?; CALL usp_SaveLogInfo (@Level,@Source,@Content,@Url,@Username);";
            sql.query(sp_query, params, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res[0]);
                }
            });
        });
    }
};

module.exports = data;