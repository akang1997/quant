"use strict";
var Log = require("./log");
/// 订单/仓位系统
var Order = (function () {
    function Order(ctx) {
        this.history = []; // 记录所有发生的买卖
        this.holdingStock = {}; // 当前持有证券列表
        this.changeFeeRatio = 0.003; // 手续费率默认千三把
        this.accumulateFee = 0; // 累计手续费
        this.ctx = ctx;
    }
    // 下买单，目前只能以当前价买入卖出吧
    Order.prototype.billBuy = function (code, amount) {
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
        var fee = price * amount * this.changeFeeRatio; // 平均摩擦成本加手续费
        var needMoney = price * amount + fee;
        if (this.ctx.account.remainMoney < needMoney) {
            Log.error("Error: not enough money to buy " + code + " amount " + amount +
                " needMoney " + needMoney + " remainMoney " + this.ctx.account.remainMoney);
            return false;
        }
        //// 执行买入，滑点/手续费 就是实际买入成本比当前价始终高一点。。。
        // 先简单合并为千三把
        this.ctx.account.expenditure(needMoney, {
            desc: "buy stock " + code,
            time: this.ctx.currentTime
        });
        this._updateHolding(code, amount, price, fee); // 增加持有
        // 更新order历史
        this._makeRecord(code, amount, price, fee);
        // 累计手续费
        this.accumulateFee += fee;
    };
    // 相当于负的数目
    Order.prototype.billSell = function (code, amount) {
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
            desc: "income for sell stock " + code + " amount " + amount + " price " + price,
            time: this.ctx.currentTime
        });
        this._makeRecord(code, -amount, price, 0);
        return true;
    };
    Order.prototype._updateHolding = function (code, mount, price, fee) {
        var stockState = this.holdingStock[code] || { count: 0, profitLose: 0, costPrice: 0 };
        stockState.count += mount;
        stockState.profitLose -= fee; // 减去手续费
        var deltaPercent = mount / stockState.count;
        if (mount > 0) {
            stockState.costPrice = price * deltaPercent + stockState.costPrice * (1 - deltaPercent); // 平均成本
        }
        if (stockState.count > 0)
            this.holdingStock[code] = stockState;
        else
            delete this.holdingStock[code];
    };
    Order.prototype._makeRecord = function (code, mount, price, fee) {
        var isBuy = mount > 0;
        this.history.push({
            code: code,
            isBuy: isBuy,
            mount: mount,
            time: this.ctx.currentTime,
            price: price,
            fee: fee
        });
    };
    return Order;
}());
module.exports = Order;
//# sourceMappingURL=order.js.map