import Account = require('../../ts/account');
import Context = require('../../ts/context');
import Order = require('../../ts/order');
import Strategy = require("../../ts/IStrategy");

var g: any;  // 用户的全局对象，这种方式免去this。。。
var ctx: Context; // 

class Average implements Strategy.IStrategy {
    _g: any;
    constructor(c: Context) {
        this._g = {};  // 通过同一引用，暴露给外部
        g = this._g;
        ctx = c;
    }
    
    init(account: Account, order: Order) {
        // 一定要设置所有需要操作的股票代码
        g.code = "000001";
        ctx.set_stocks(g.code);
        g.moneyPiece = Math.round(account.initMoney / 36);  // 资金均分为30份，3年买完
    }

    tick(account: Account, order: Order, crtTime: string) {
    }

    run_monthly(account: Account, order: Order, crtTime: string) {
        var price = ctx.get_price(g.code, crtTime, crtTime);
        
    }

    run_weekly(account: Account, order: Order, crtTime: string) {
        // 每周定投百分之一
    }

    run_daily(account: Account, order: Order, crtTime: string) {
    }
}

export = Average;