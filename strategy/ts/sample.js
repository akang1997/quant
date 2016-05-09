"use strict";
var g; // 用户的全局对象，这种方式免去this。。。
var ctx; // 
// 定投策略，默认剩余资金能够按照年利率5%获得利息，按月获得把
var Average = (function () {
    function Average(c) {
        this._g = {}; // 通过同一引用，暴露给外部
        g = this._g;
        ctx = c;
    }
    Average.prototype.init = function (account, order) {
        // 一定要设置所有需要操作的股票代码
        g.code = "000001";
        ctx.set_stocks(g.code);
        g.moneyPiece = Math.round(account.initMoney / 36); // 资金均分为36份，3年买完
    };
    Average.prototype.tick = function (account, order, crtTime, currentPriceMap) {
        // null
    };
    Average.prototype.run_monthly = function (account, order, crtTime, currentPriceMap) {
        var price = currentPriceMap[g.code];
        var unit = 100; // 100股 一手么。。。
        // 计算应该买多少手
        var count = g.moneyPiece / (price * unit);
        count = Math.round(count);
        if (count > 0)
            order.billBuy(g.code, count * unit);
    };
    Average.prototype.run_weekly = function (account, order, crtTime, currentPriceMap) {
        // 每周定投百分之一
    };
    Average.prototype.run_daily = function (account, order, crtTime, currentPriceMap) {
    };
    return Average;
}());
module.exports = Average;
//# sourceMappingURL=sample.js.map