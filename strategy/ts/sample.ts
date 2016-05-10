import Account = require('../../ts/account');
import Context = require('../../ts/context');
import Order = require('../../ts/order');
import Strategy = require("../../ts/IStrategy");
import Log = require("../../ts/log");

var g: any;  // 用户的全局对象，这种方式免去this。。。
var ctx: Context; // 

// 定投策略，默认剩余资金能够按照年利率5%获得利息，按月获得把
class Average implements Strategy.IStrategy {
    _g: any;
    constructor(c: Context) {
        this._g = {};  // 通过同一引用，暴露给外部
        g = this._g;
        ctx = c;
    }

    ///// 上面的代码为通用代码


    init(account: Account, order: Order) {
        // 一定要设置所有需要操作的股票代码
        g.code = "000001";
        ctx.set_stocks(g.code);
        g.moneyPiece = Math.round(account.initMoney / 36);  // 资金均分为36份，3年买完
        console.log("moneyPiece:" + g.moneyPiece);
        g.lastMarketValue = account.initMoney;
    }

    tick(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: any }) {
        // null
    }

    run_monthly(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: any }) {
        Log.info(crtTime + ":" + JSON.stringify(order.holdingStock));
        if (account.marketValue > g.lastMarketValue * 2) { // sell all when double
            Log.info(">>>> doubled , sell all, MarketValue: " + account.marketValue);
            var count = order.holdingStock[g.code].count;
            order.billSell(g.code, count);  // sell all
            g.lastMarketValue = account.marketValue;
            g.moneyPiece = Math.round(account.marketValue / 36);  // 资金均分为36份，3年买完
        }

        var priceObj = currentPriceMap[g.code];
        var price = priceObj.adj_close;
        var unit = 100;  // 100股 一手么。。。
        // 计算应该买多少手
        var count = g.moneyPiece / (price * unit);
        count = Math.floor(count);
        if (count > 0 && count * unit * price < account.remainMoney) order.billBuy(g.code, count * unit);
    }

    run_weekly(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: any }) {
        // 每周定投百分之一
    }

    run_daily(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: any }) {
    }

    end() {
        // Log.info(ctx.order);
        // Log.info(ctx.account);
        // Log.info(ctx.account.historyMarketValue);
        Log.info(ctx.order.history);
        Log.info(ctx.account.historyMarketValue);
    }
}

export = Average;