"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Only = exports.All_Admin = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
exports.All_Admin = [Role.ADMIN, Role.SUPER_ADMIN];
exports.User_Only = [Role.USER];
