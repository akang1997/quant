
import Account = require("./account");
import Context = require("./context");

class Order {
    private ctx : Context;
    history : any[];
    
    constructor(ctx : Context){
        this.ctx = ctx;
    }
    
    // 下买单，目前只能以当前价买入卖出吧
    billBuy(code:string, mount:number){
        
    }
    billSell(code:string, mount:number){
        
    }
}
export = Order;