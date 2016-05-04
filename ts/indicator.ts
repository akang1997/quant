import Context = require('./context');
import utils = require('./ak.utils');

var ctx = Context.prototype;
// 技术指标库。。。 所有计算出来的数据做缓存吧。。。

// 求N天平均价格
export function avg(stock: string, date: string, period = 5, price_type = 'close'): number{
    var priceTotal = ctx.get_price(stock, date)[price_type];  // 如何处理往前天数不够的情况。。。
    for(var i = 1; i < period; i++){
        priceTotal += ctx.get_price(stock, utils.dateBefore(date,i))[price_type];
        if(isNaN(priceTotal)) return NaN;
    }
    return priceTotal / period;
}