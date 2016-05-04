"use strict";
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
    // 更新每月一次的利息收入
    Account.prototype.updateInterestIncome = function () {
        var delta = this.remainMoney * this.interest / 12;
    };
    // 支出 money
    Account.prototype.expenditure = function (amount, reason) {
    };
    // 收入money
    Account.prototype.income = function (amount, reason) {
    };
    return Account;
}());
module.exports = Account;
//# sourceMappingURL=account.js.map