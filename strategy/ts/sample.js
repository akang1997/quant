"use strict";
var Log = require("../../ts/log");
var g; // 用户的全局对象，这种方式免去this。。。
var ctx; // 
// 定投策略，默认剩余资金能够按照年利率5%获得利息，按月获得把
var Average = (function () {
    function Average(c) {
        this._g = {}; // 通过同一引用，暴露给外部
        g = this._g;
        ctx = c;
    }
    ///// 上面的代码为通用代码
    Average.prototype.init = function (account, order) {
        // 一定要设置所有需要操作的股票代码
        g.code = "000088";
        g.period = 36; // 总资金分成多少份
        g.multiple = 1; // 总资金盈利多少后，全部卖出
        ctx.set_stocks(g.code);
        g.moneyPiece = Math.round(account.initMoney / g.period); // 资金均分
        console.log("moneyPiece:" + g.moneyPiece);
        g.lastMarketValue = account.initMoney;
    };
    Average.prototype.tick = function (account, order, crtTime, currentPriceMap) {
        // null
    };
    Average.prototype.run_monthly = function (account, order, crtTime, currentPriceMap) {
        // Log.info(crtTime + ":" + JSON.stringify(order.holdingStock));
        if (account.marketValue > g.lastMarketValue * (g.multiple + 1)) {
            Log.info(">>>> doubled , sell all, MarketValue: " + account.marketValue);
            var count = order.holdingStock[g.code].count;
            order.billSell(g.code, count); // sell all
            g.lastMarketValue = account.marketValue;
            g.moneyPiece = Math.round(account.marketValue / g.period); // 资金均分
        }
        var priceObj = currentPriceMap[g.code];
        var price = priceObj.adj_close;
        var unit = 100; // 100股 一手么。。。
        // 计算应该买多少手
        var count = g.moneyPiece / (price * unit);
        count = Math.floor(count);
        if (count > 0 && count * unit * price < account.remainMoney)
            order.billBuy(g.code, count * unit); // 有钱就买
    };
    Average.prototype.run_weekly = function (account, order, crtTime, currentPriceMap) {
        // 每周定投百分之一
    };
    Average.prototype.run_daily = function (account, order, crtTime, currentPriceMap) {
    };
    Average.prototype.end = function () {
        // Log.info(ctx.order);
        // Log.info(ctx.account);
        // Log.info(ctx.account.historyMarketValue);
        // Log.info(ctx.order.history);
        Log.info(ctx.account.historyMarketValue);
    };
    return Average;
}());
module.exports = Average;
//# sourceMappingURL=sample.js.map