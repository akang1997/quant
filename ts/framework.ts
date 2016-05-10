// 运行框架，加载库，然后加载用户策略，然后执行策略，done。。。

import Account = require("./account");
import Order = require("./order");
import indicator = require("./indicator");
import log = require("./log");
import Context = require("./context");
import Strategy = require("./IStrategy");  // 接口类型
import Log = require("./log");

var oneDayTime = 1000 * 60 * 60 * 24; // 一天毫秒数

// 先假设，同一个策略不会同时执行
export function run(UserStrategy: Strategy.StrategyConstructable, config : {
    startDate: string,
    endDate: string,
    initMoney?: number,
    interest?: number,  // 剩余资金年利率
    changeFeeRatio?: number
} ,after): void {
    // init environment
    var ctx = new Context(  config.startDate, 
                            config.endDate, 
                            config.initMoney,
                            config.interest,
                            config.changeFeeRatio);
    var strategy = new UserStrategy(ctx);
    ctx.once("init_done", function () {
        runTick(ctx, after);
    });

    ctx.init(strategy);
}

function runTick(ctx: Context, after) {
    var account = ctx.account;
    var order = ctx.order;
    var strategy = ctx.strategy;

    var lastTime = 0;  // 时间戳
    var currentTime = 0;
    var lastWeek = 8;  // 星期几
    var currentWeek: number;
    var lastMonth = -1; // 月份
    var currentMonth: number;
    var currentDateStr = "";
    var date: Date;
    var lastMonthTime: number = -1;

    while (ctx.hasNext()) {

        currentDateStr = ctx.next();
        date = new Date(currentDateStr);
        ctx._update_current_price(currentDateStr);
        ctx.currentTime = currentDateStr;

        // +++++ tick first
        strategy.tick(account, order, currentDateStr, ctx.currentPriceMap);

        // +++++ check week
        currentWeek = date.getDay();
        currentTime = date.getTime();
        //// 由于日期可能有断隔，只能假设current时间大于last，别的不能假设
        //// 星期小于，或者日期间隔超过6天
        if (currentWeek <= lastWeek || (currentWeek - lastTime) / oneDayTime >= 7) {
            strategy.run_weekly(account, order, currentDateStr, ctx.currentPriceMap);
        }
        lastWeek = currentWeek;
        lastTime = currentTime;

        // +++++ check month
        currentMonth = date.getMonth();
        if (currentMonth != lastMonth) {
            if (lastMonthTime > 0) {
                ctx.account.updateInterestIncome((currentTime - lastMonthTime) / oneDayTime);
            }
            strategy.run_monthly(account, order, currentDateStr, ctx.currentPriceMap);
            lastMonth = currentMonth;
            lastMonthTime = currentTime;
        }

        ctx.account.updateMarketValue();
        // TODO 每天运行先不管把
    }
    
    strategy.end(account, order, currentDateStr);
    
    Log.info("end of framework...");
    after && after();
}