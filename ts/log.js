"use strict";
function info() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
    }
    console.info(params);
}
exports.info = info;
function error() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
    }
    console.error(params);
}
exports.error = error;
function debug() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
    }
    console.log(params);
}
exports.debug = debug;
//# sourceMappingURL=log.js.map