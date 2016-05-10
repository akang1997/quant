// 资金管理，市值显示
import Context = require("./context");
import types = require("./types");
import Log = require("./log");

interface MarketValueMap {
    date: string;
    marketValue: number;
}
class Account {
    // 默认剩余资金能够按照年利率5%获得利息，按月获得把

    remainMoney: number; // 剩余资金 
    marketValue: number; // 总市值
    history: any[] = [];      // 记录所有剩余资金的变动
    historyMarketValue: MarketValueMap[] = []; // 记录历史市值变动 

    constructor(
        public startDate: string,
        public endDate: string,
        public initMoney: number = 100000,  // 初始资金
        public ctx: Context,
        public interest: number = 0.03  // 剩余资金年利率
    ) {
        this.remainMoney = this.initMoney;
        this.marketValue = this.initMoney;
    }

    // 更新利息收入
    updateInterestIncome(dayCount: number) {
        dayCount = Math.round(dayCount);
        var delta = this.remainMoney * this.interest / 365 * dayCount;
        var reason = {
            desc: "interest income"
            , dayCount: dayCount
            , time: this.ctx.currentTime
        };
        this.income(delta, reason);  // 直接传入对象字面量会进行强类型检查。。。
    }

    // 支出 money；； 合法检查什么的，先不管
    expenditure(amount: number, reason: types.AccountReason) {
        if (amount < this.remainMoney) {  // this.remainMoney 不能为负
            this._makeRecord(false, amount, reason);
            this.remainMoney -= amount;
            return true;
        } else {  // 失败：余额不足
            Log.error("Error, not enough money for " + amount);
            return false;
        }
    }
    // 收入money
    income(amount: number, reason: types.AccountReason) {
        this._makeRecord(false, amount, reason);
        this.remainMoney += amount;
        return true;
    }

    // 更新市值;; 市值算不算余额哦
    updateMarketValue() {
        var values = 0;
        var holdings = this.ctx.order.holdingStock;
        for (var code in holdings) {
            values += holdings[code].count * this.ctx.currentPriceMap[code].adj_close;
        }
        this.marketValue = values + this.remainMoney;
        this.historyMarketValue.push({date: this.ctx.currentTime, marketValue: this.marketValue});
    }

    private _makeRecord(isIncome: boolean, amount: number, reason: types.AccountReason) {
        this.history.push({
            isIncome: isIncome
            , amount: amount
            , reason: reason
            , time: this.ctx.currentTime
            , lastRemainMoney: this.remainMoney
            , lastMarketValue: this.marketValue // ???
        });
    }
}

export = Account;