
import Account = require("./account");
import Context = require("./context");

class Order {
    private ctx : Context;
    history : any[];        // 记录所有发生的买卖
    holdingStock : any;     // 当前持有列表
    
    constructor(ctx : Context){
        this.ctx = ctx;
    }
    
    // 下买单，目前只能以当前价买入卖出吧
    billBuy(code:string, mount:number):boolean{
        var price = this.ctx.currentPriceMap[code];
        if(price == null){
            console.log("Error: invalid stock code");
            return false;
        }
        // TODO 如何控制 mount 是手的合法数量。。。
        // 先不管
        mount = Math.round(mount);
        var needMoney = price * mount;
        if(this.ctx.account.remainMoney < needMoney){
            console.log("Error: invalid stock code");
            return false;
        }
    }
    billSell(code:string, mount:number):boolean{
        return false;
    }
}
export = Order;