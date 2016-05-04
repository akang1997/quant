"use strict";
var Order = (function () {
    function Order(ctx) {
        this.ctx = ctx;
    }
    // 下买单，目前只能以当前价买入卖出吧
    Order.prototype.billBuy = function (code, mount) {
        var price = this.ctx.currentPriceMap[code];
        if (price == null) {
            console.log("Error: invalid stock code");
            return false;
        }
        // TODO 如何控制 mount 是手的合法数量。。。
        // 先不管
        mount = Math.round(mount);
        var needMoney = price * mount;
        if (this.ctx.account.remainMoney < needMoney) {
            console.log("Error: invalid stock code");
            return false;
        }
    };
    Order.prototype.billSell = function (code, mount) {
        return false;
    };
    return Order;
}());
module.exports = Order;
//# sourceMappingURL=order.js.map