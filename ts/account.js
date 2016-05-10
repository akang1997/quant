"use strict";
var Log = require("./log");
var Account = (function () {
    function Account(startDate, endDate, initMoney, // 初始资金
        ctx, interest // 剩余资金年利率
        ) {
        if (initMoney === void 0) { initMoney = 100000; }
        if (interest === void 0) { interest = 0.03; }
        this.startDate = startDate;
        this.endDate = endDate;
        this.initMoney = initMoney;
        this.ctx = ctx;
        this.interest = interest;
        this.history = []; // 记录所有剩余资金的变动
        this.historyMarketValue = []; // 记录历史市值变动 
        this.remainMoney = this.initMoney;
        this.marketValue = this.initMoney;
    }
    // 更新利息收入
    Account.prototype.updateInterestIncome = function (dayCount) {
        dayCount = Math.round(dayCount);
        var delta = this.remainMoney * this.interest / 365 * dayCount;
        var reason = {
            desc: "interest income",
            dayCount: dayCount,
            time: this.ctx.currentTime
        };
        this.income(delta, reason); // 直接传入对象字面量会进行强类型检查。。。
    };
    // 支出 money；； 合法检查什么的，先不管
    Account.prototype.expenditure = function (amount, reason) {
        if (amount < this.remainMoney) {
            this._makeRecord(false, amount, reason);
            this.remainMoney -= amount;
            return true;
        }
        else {
            Log.error("Error, not enough money for " + amount);
            return false;
        }
    };
    // 收入money
    Account.prototype.income = function (amount, reason) {
        this._makeRecord(false, amount, reason);
        this.remainMoney += amount;
        return true;
    };
    // 更新市值;; 市值算不算余额哦
    Account.prototype.updateMarketValue = function () {
        var values = 0;
        var holdings = this.ctx.order.holdingStock;
        for (var code in holdings) {
            values += holdings[code].count * this.ctx.currentPriceMap[code].adj_close;
        }
        this.marketValue = values + this.remainMoney;
        this.historyMarketValue.push({ date: this.ctx.currentTime, marketValue: this.marketValue });
    };
    Account.prototype._makeRecord = function (isIncome, amount, reason) {
        this.history.push({
            isIncome: isIncome,
            amount: amount,
            reason: reason,
            time: this.ctx.currentTime,
            lastRemainMoney: this.remainMoney,
            lastMarketValue: this.marketValue // ???
        });
    };
    return Account;
}());
module.exports = Account;
//# sourceMappingURL=account.js.map