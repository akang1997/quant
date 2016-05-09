"use strict";
var Log = require("./log");
var Account = (function () {
    function Account(startDate, endDate, initMoney, // 初始资金
        ctx, interest // 剩余资金年利率
        ) {
        if (interest === void 0) { interest = 0.03; }
        this.startDate = startDate;
        this.endDate = endDate;
        this.initMoney = initMoney;
        this.ctx = ctx;
        this.interest = interest;
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
    Account.prototype.updateMarketValue = function () {
        // TODO
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