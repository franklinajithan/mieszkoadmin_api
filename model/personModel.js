'user strict';
var sql = require('../common/db.js');
var loggedInUserInfo = require('../viewModel/loggedInUserInfo.js');
var person = require('../viewModel/person.js');
var mapper = require('automapper-js');
var partyRelationship = require('../viewModel/partyRelationship.js');
var partyIdentification = require('../viewModel/partyIdentification.js');
var partySetting = require('../viewModel/partySetting.js');
var electronicAddress = require('../viewModel/electronicAddress.js');
const filter = require('../common/filter.js');
const bcryptjs = require('bcryptjs');

var data = {};

data.getLoggedInUserInfo = async function (username) {
    return new Promise((resolve, reject) => {
        sql.query("CALL usp_GetLoggedInUserInfo('" + username + "');", function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                let loggedInUserInfoVm = mapper(loggedInUserInfo, res[0][0]);
                resolve(loggedInUserInfoVm);
            }
        });
    });
};
data.getSinglePersonInfo = async function (partyRoleId) {
    return new Promise((resolve, reject) => {
        sql.query("CALL usp_GetPerson('" + partyRoleId + "');", function (err, res) {
            if (err) {
                reject(err);
            }
            else {

                if (res[0].length == 0) {
                    resolve([]);
                }
                else {
                    let personVm = mapper(person, res[0][0]);
                    filter.filterObject(personVm);
                    resolve(personVm);
                }
            }
        });
    });
};

data.getAllPerson = async function (roleTypeId) {
    var personList = [];
    return new Promise((resolve, reject) => {

        var params = [roleTypeId];
        var sp_query = "SET @RoleTypeId = ?; CALL usp_GetPersonList (@RoleTypeId);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                res[1].forEach(entry => {
                                let personVm = mapper(person, entry);
                                filter.filterObject(personVm);
                                personList.push(personVm);
                            });
                            resolve(personList);
            }
        });
    });
};
data.validateUsername = async function (username, partyRoleId) {
    return new Promise((resolve, reject) => {
        var params = [username, partyRoleId];
        var sp_query = "SET @Username = ?,@PartyRoleID = ?; CALL usp_ValidateUsername (@Username,@PartyRoleID);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};
data.addUser = async function (userModel, resetPasswordValidityTime) {
    return new Promise((resolve, reject) => {
        partyIdentificationList = [];
        partySettingList = [];
        electronicAddressList = [];
        let personVm = mapper(person, userModel)

        personVm.partyIdentification.forEach(entry => {
            let partyIdentificationVm = mapper(partyIdentification, entry);
            partyIdentificationList.push(partyIdentificationVm);
        });

        personVm.partySetting.forEach(entry => {
            let partySettingVm = mapper(partySetting, entry);
            partySettingList.push(partySettingVm);
        });

        var params = [personVm.status, personVm.roleTypeId, personVm.title, personVm.firstName, personVm.middleName, personVm.lastName, personVm.surname, personVm.fullName, personVm.password, personVm.userName, personVm.gender, personVm.nationality, personVm.maritialStatus, personVm.dob, personVm.imageUrl, JSON.stringify({ partyIdentification: partyIdentificationList }), JSON.stringify({ partySetting: partySettingList })];
        var sp_query = "SET @Status = ?,@RoleTypeID = ?,@Title = ?,@FirstName = ?,@MiddleName = ?,@LastName = ?,@Surname = ?,@FullName = ?, @Password=?, @UserName = ?,@Gender = ?,@Nationality = ?,@MaritialStatus = ?,@DOB = ?,@ImageURL = ?, @PartyIdentification = ?, @PartySetting = ?; CALL usp_SavePerson (@Status,@RoleTypeID,@Title,@FirstName,@MiddleName,@LastName,@Surname,@FullName,@Password, @UserName,@Gender,@Nationality,@MaritialStatus,@DOB,@ImageURL,@PartyIdentification,@PartySetting);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res[1][0].result);
            }
        });
    });
};
data.updateUser = async function (userModel) {

    return new Promise((resolve, reject) => {
        partyIdentificationList = [];
        partySettingList = [];

        let personVm = mapper(person, userModel)

        personVm.partyIdentification.forEach(entry => {
            let partyIdentificationVm = mapper(partyIdentification, entry);
            partyIdentificationList.push(partyIdentificationVm);
        });

        personVm.partySetting.forEach(entry => {
            let partySettingVm = mapper(partySetting, entry);
            partySettingList.push(partySettingVm);
        });

        var params = [personVm.partyRoleId, personVm.status, personVm.roleTypeId, personVm.title, personVm.firstName, personVm.middleName, personVm.lastName, personVm.surname, personVm.fullName, personVm.userName, personVm.gender, personVm.nationality, personVm.maritialStatus, personVm.dob, personVm.imageUrl, JSON.stringify({ partyIdentification: partyIdentificationList }), JSON.stringify({ partySetting: partySettingList })];
        var sp_query = "SET @PartyRoleID = ?, @Status = ?,@RoleTypeID = ?,@Title = ?,@FirstName = ?,@MiddleName = ?,@LastName = ?,@Surname= ?,@FullName= ?, @UserName = ?,@Gender = ?,@Nationality = ?,@MaritialStatus = ?,@DOB = ?,@ImageURL = ?, @PartyIdentification = ?, @PartySetting = ?; CALL usp_UpdatePerson (@PartyRoleID,@Status,@RoleTypeID,@Title,@FirstName,@MiddleName,@LastName,@Surname,@FullName,@UserName,@Gender,@Nationality,@MaritialStatus,@DOB,@ImageURL,@PartyIdentification,@PartySetting);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.deletePerson = async function (partyRoleId) {
    return new Promise((resolve, reject) => {
        var sp_query = "SET @PartyRoleID = ?; CALL usp_DeletePerson (@PartyRoleID);";
        sql.query(sp_query, partyRoleId, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.inactivePerson = async function (partyRoleId) {
    return new Promise((resolve, reject) => {
        var sp_query = "SET @PartyRoleID = ?; CALL usp_InactivePerson (@PartyRoleID);";
        sql.query(sp_query, partyRoleId, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

data.passwordVerify = async function (userModel) {
    return new Promise((resolve, reject) => {
        var sp_query = "SET @UserName = ?; CALL usp_GetHashedPassword (@UserName);";
        sql.query(sp_query, userModel.username, (err, res) => {
            if (res[1].length != 0) {
                if (bcryptjs.compareSync(userModel.plainpassword, res[1][0].result)) {
                    resolve("OK");
                }
                else {
                    resolve("Error");
                }
            }
            else {
                reject("Invalid User");
            }

        });
    });
};

data.saveTempPassword = async function (tempPassword, username, expTimeInMinutes) {
    return new Promise((resolve, reject) => {
        var params = [tempPassword, username, expTimeInMinutes];
        const sp_query = "SET @TempPassword = ?,@Username = ?,@ExpTimeInMinutes = ? ;CALL usp_SaveTempPassword (@TempPassword,@Username,@ExpTimeInMinutes);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[1][0].status);
            }
        });
    });
};


data.passwordChange = async function (partyroleId, password) {
    return new Promise((resolve, reject) => {
        var params = [password, partyroleId];
        const sp_query = "SET @HashedPassword = ?,@PartyRoleID = ? ;CALL usp_UpdatePassword(@HashedPassword,@PartyRoleID);";
        sql.query(sp_query, params, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve("OK");
            }
        });
    });
};

data.getPersonProgress = async function (partyRoleId) {
    return new Promise((resolve, reject) => {
        sql.query("CALL usp_GetPersonProgress('" + partyRoleId + "');", function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                let personVm = mapper(person, res[0][0]);
                filter.filterObject(personVm);
                resolve(personVm);
            }
        });
    });
};

data.getEmployeeIDList = async function () {
    return new Promise((resolve, reject) => {
        sql.query("CALL usp_GetUnassignedEmployeeIDList();", function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                if (res[0].length == 0)
                    resolve([]);
                else
                    resolve(res[0]);
            }
        });
    });
};

module.exports = data;