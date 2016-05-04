// 资金管理，市值显示
import Context = require("./context");

class Account {
    remainMoney = this.initMoney; // 剩余资金
    marketValue = this.initMoney; // 市值

    constructor(
        public startDate: string,
        public endDate: string,
        public initMoney: number,  // 初始资金
        public ctx: Context) {
        this.remainMoney = this.initMoney; // 剩余资金
        this.marketValue = this.initMoney; // 市值
    }
}

export = Account;