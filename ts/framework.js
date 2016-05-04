// 运行框架，加载库，然后加载用户策略，然后执行策略，done。。。
"use strict";
var Context = require("./context");
var oneDayTime = 1000 * 60 * 60 * 24; // 一天毫秒数
// 先假设，同一个策略不会同时执行
function run(UserStrategy) {
    // init environment
    var ctx = new Context();
    var strategy = new UserStrategy(ctx);
    ctx.once("init_done", function () {
        runTick(ctx);
    });
    ctx.init(strategy);
}
exports.run = run;
function runTick(ctx) {
    var account = ctx.account;
    var order = ctx.order;
    var strategy = ctx.strategy;
    var lastTime = 0; // 时间戳
    var currentTime = 0;
    var lastWeek = 8; // 星期几
    var currentWeek;
    var lastMonth = -1; // 月份
    var currentMonth;
    var dateStr = "";
    var date;
    while (ctx.hasNext()) {
        dateStr = ctx.next();
        date = new Date("2016-01-01");
        // +++++ tick first
        strategy.tick(account, order, dateStr);
        // +++++ check week
        currentWeek = date.getDay();
        currentTime = date.getTime();
        //// 由于日期可能有断隔，只能假设current时间大于last，别的不能假设
        //// 星期小于，或者日期间隔超过6天
        if (currentWeek <= lastWeek || (currentWeek - lastTime) / oneDayTime >= 7) {
            strategy.run_weekly(account, order, dateStr);
        }
        lastWeek = currentWeek;
        lastTime = currentTime;
        // +++++ check month
        currentMonth = date.getMonth();
        if (currentMonth != lastMonth) {
            strategy.run_monthly(account, order, dateStr);
            lastMonth = currentMonth;
        }
    }
}
//# sourceMappingURL=framework.js.map