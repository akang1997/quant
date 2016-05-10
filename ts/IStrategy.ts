import Account = require("./account");
import Order = require("./order");
import Context = require("./context");
import types = require("./types");

// 用户策略接口
export interface IStrategy {
    // 初始化函数，仅仅执行一次；执行一些初始化设置
    // 一定要设置所有需要操作的股票代码（好一次性取回所需数据。。。）
    init(account: Account, order: Order): void
    /**
     * 说明：tick函数，每一个周期（天，分钟，价格跳动）执行一次，策略的核心函数
     * crtTime : 当前时间字符串
     */
    tick(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: types.PriceObj }): void
    // TODO 每个月跑一次，可以设置是每个月的哪一天；收盘后执行
    run_monthly(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: types.PriceObj }): void
    // TODO 每个周跑一次，可以设置是每个周的哪一天；收盘后执行
    run_weekly(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: types.PriceObj }): void
    // TODO 每天跑一次，；收盘后执行 ？？
    run_daily(account: Account, order: Order, crtTime: string, currentPriceMap: { [key: string]: types.PriceObj }): void
    // 最后收尾函数
    end(account: Account, order: Order, crtTime: string)
}

export interface StrategyConstructable {
    // Construct signatures in interfaces are not implementable in classes; 
    // they're only for defining existing JS APIs that define a 'new'-able function
    new (ctx: Context): IStrategy; // 构造函数，这个有点恶心。。。
}