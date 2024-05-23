var logLevel = {
    Info: 'info',
    Error: 'error',
    Debug: 'debug',
    StyAPIInfo: 'styapiinfo',
    StyAPIError: 'styapierror',
};
var roleType = {
    Organization: 1,
    SuperUser: 2,
    Unassign: 3,
    HRAdmin: 4,
    HRAssistant: 5,
};
var partyRelationshipType = {
    OrganizationAdmin: 1,
    OrganizationalEmployee: 2,
    ImergencyContact: 3
};
var partyIdentificationType = {
    NIC: 1,
    DriversLicense: 2,
    EmployeeID: 3,
    Something: 4
};
var PartySettingType = {
    BloodGroup: 1,
    Allergies: 2,
    LongTermMedications: 3
};


module.exports = { logLevel, roleType, partyRelationshipType, partyIdentificationType, PartySettingType };