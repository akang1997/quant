
import Account = require("./account");
import Context = require("./context");
import Log = require("./log");

interface Holding {
    count: number,      // 数量
    profitLose: number, // 总盈亏
    costPrice: number   // 成本价 ，卖出成本价不变，买入更新成本价？？？TODO
}

/// 订单/仓位系统
class Order {
    private ctx: Context;
    history: any[] = [];        // 记录所有发生的买卖
    holdingStock: { [key: string]: Holding } = {}; // 当前持有证券列表
    changeFee: number = 0.003;     // 手续费默认千三把

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    // 下买单，目前只能以当前价买入卖出吧
    billBuy(code: string, amount: number): boolean {
        var priceObj = this.ctx.currentPriceMap[code];
        //// 检测证券代码
        if (priceObj == null) {
            Log.error("Error: invalid stock code");
            return false;
        }
        var price = priceObj.adj_close;
        // TODO 如何控制 mount 是手的合法数量。。。先不管
        //// 检测余额
        amount = Math.round(amount);
        var fee = price * amount * this.changeFee;  // 平均摩擦成本加手续费
        var needMoney = price * amount + fee;
        if (this.ctx.account.remainMoney < needMoney) {
            Log.error("Error: not enough money to buy " + 
                code + " needMoney " + needMoney + " remainMoney " + this.ctx.account.remainMoney);
            return false;
        }
        //// 执行买入，滑点/手续费 就是实际买入成本比当前价始终高一点。。。
        // 先简单合并为千三把
        this.ctx.account.expenditure(needMoney, {  // 减钱
            desc: "buy stock " + code
            , time: this.ctx.currentTime
        });
        this._updateHolding(code, amount, price, fee);  // 增加持有
        // 更新order历史
        this._makeRecord(code, amount, price, fee);
    }

    // 相当于负的数目
    billSell(code: string, amount: number): boolean {
        var priceObj = this.ctx.currentPriceMap[code];
        //// 检测证券代码
        if (priceObj == null) {
            Log.error("Error: invalid stock code");
            return false;
        }
        var price = priceObj.adj_close;
        ///// 检测股票存量
        var stockState = this.holdingStock[code] || { count: 0, profitLose: 0, costPrice: 0 };
        if (stockState.count < amount) {
            Log.error("Error: not enough stock to sell " + code);
            return false;
        }
        var money = amount * price;
        this._updateHolding(code, -amount, price, 0);
        this.ctx.account.income(money, {
            desc: "income for sell stock " + code + " amount " + amount + " price " + price
            , time: this.ctx.currentTime
        });
        this._makeRecord(code, -amount, price, 0);
        return true;
    }

    _updateHolding(code: string, mount: number, price: number, fee: number): void {
        var stockState = this.holdingStock[code] || { count: 0, profitLose: 0, costPrice: 0 };

        stockState.count += mount;
        stockState.profitLose -= fee;  // 减去手续费
        let deltaPercent = mount / stockState.count;
        if (mount > 0) {  // 买入才更新平均价格，卖出不影响平均价格
            stockState.costPrice = price * deltaPercent + stockState.costPrice * (1 - deltaPercent);      // 平均成本
        }
        this.holdingStock[code] = stockState;
    }

    _makeRecord(code: string, mount: number, price: number, fee: number): void {
        var isBuy = mount > 0;
        this.history.push({
            code: code
            , isBuy: isBuy
            , mount: mount
            , time: this.ctx.currentTime
            , price: price
            , fee: fee
        });
    }
}
export = Order;