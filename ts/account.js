"use strict";
var Account = (function () {
    function Account(startDate, endDate, initMoney, // 初始资金
        ctx) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.initMoney = initMoney;
        this.ctx = ctx;
        this.remainMoney = this.initMoney; // 剩余资金
        this.marketValue = this.initMoney; // 市值
        this.remainMoney = this.initMoney; // 剩余资金
        this.marketValue = this.initMoney; // 市值
    }
    return Account;
}());
module.exports = Account;
//# sourceMappingURL=account.js.map