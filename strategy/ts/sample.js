"use strict";
var g; // 用户的全局对象，这种方式免去this。。。
var ctx; // 
var Average = (function () {
    function Average(c) {
        this._g = {}; // 通过同一引用，暴露给外部
        g = this._g;
        ctx = c;
    }
    Average.prototype.init = function (account, order) {
        // 一定要设置所有需要操作的股票代码
        ctx.set_stocks("000001");
    };
    Average.prototype.tick = function (account, order, crtTime) {
    };
    Average.prototype.run_monthly = function (account, order, crtTime) {
    };
    Average.prototype.run_weekly = function (account, order, crtTime) {
        // 每周定投百分之一
    };
    Average.prototype.run_daily = function (account, order, crtTime) {
    };
    return Average;
}());
module.exports = Average;
//# sourceMappingURL=sample.js.map