"use strict";
var Context = require('./context');
var utils = require('./ak.utils');
var ctx = Context.prototype;
// 技术指标库。。。 所有计算出来的数据做缓存吧。。。
// 求N天平均价格
function avg(stock, date, period, price_type) {
    if (period === void 0) { period = 5; }
    if (price_type === void 0) { price_type = 'close'; }
    var priceTotal = ctx.get_price(stock, date)[price_type]; // 如何处理往前天数不够的情况。。。
    for (var i = 1; i < period; i++) {
        priceTotal += ctx.get_price(stock, utils.dateBefore(date, i))[price_type];
        if (isNaN(priceTotal))
            return NaN;
    }
    return priceTotal / period;
}
exports.avg = avg;
//# sourceMappingURL=indicator.js.map