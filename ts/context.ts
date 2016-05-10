/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/lodash.d.ts" />


// 提供上下文对象
import Account = require("./account")
import Order = require("./order")
import Stragety = require("./IStrategy");
import events = require('events');
import util = require("util");
import httpRequest = require("./httprequest")
import _ = require("lodash");
import Log = require("./log");
import types = require("./types")

var DAILY = 'daily';
var MINUTE = 'minute';

class Context extends events.EventEmitter {
    // buffer: any;  // ctx缓存对象...
    timeArr: string[];
    account: Account;
    order: Order;
    _index = 0;  /// time index
    strategy: Stragety.IStrategy;
    priceMap: { [key: string]: any[] } = {};  // 历史价格数据
    currentPriceMap: { [key: string]: types.PriceObj };  // 当前tick的code/price map
    currentTime: string;

    DAILY = DAILY;  // 为了便于用户使用，弄成实例变量。。。
    MINUTE = MINUTE;

    constructor(    startDate: string = "1900-01-01", 
                    endDate: string = "2020-12-12", 
                    initMoney?: number,
                    interest?: number,
                    changeFeeRatio?: number) { 
        super();// 初始化
        this.account = new Account(startDate, endDate, initMoney, interest, this);
        this.order = new Order(changeFeeRatio, this);
        this.timeArr = ["2015-01-01", "2015-01-02", "2015-01-03"];
    }

    init(strategy: Stragety.IStrategy) {
        this.strategy = strategy;

        // init user strategy
        strategy.init(this.account, this.order);
    }

    // tick 周期
    hasNext(): boolean {
        return this.timeArr.length > this._index;
    }
    next(): string {
        return this.timeArr[this._index++];
    }

    private _add_price(code: string, priceArr: any) {
        this.priceMap[code] = priceArr;
    }

    private _init_timeArr() {
        var stocks = Object.keys(this.priceMap);
        var stockPriceArr = this.priceMap[stocks[0]];
        this.timeArr = stockPriceArr.map(e => { return <string>e.date; });  // 使用<>进行类型转换
        this.emit("init_done");
    }

    _update_current_price(dateStr: string) {
        this.currentPriceMap = this.getOneDayPriceMap(dateStr);
    }

    getOneDayPriceMap(dateStr: string): { [key: string]: types.PriceObj } {
        var cp: { [key: string]: types.PriceObj } = {};
        for (var code in this.priceMap) {
            cp[code] = _.find(this.priceMap[code], e => e.date === dateStr);
        }
        return cp;
    }

    // 用户初始化的时候，设置他要操作的所有stock，限定范围，从而一次性取回数据。。。
    // 可以调用多次？？？
    set_stocks(stock: string): void;
    set_stocks(stocks: string[]): void;
    set_stocks(stocks: any): void {
        if (!stocks) return Log.error("no valid stock set");
        if (!Array.isArray(stocks)) stocks = [stocks];
        Log.info("stocks to operate is ", stocks);
        let count = stocks.length;
        let self = this;
        stocks.forEach(code => {
            httpRequest.queryPrice(code,
                this.account.startDate,
                this.account.endDate,
                function (data: any) {
                    if (data.success == true) {
                        self._add_price(code, data.result);
                        count--;
                        if (count === 0) {
                            self._init_timeArr();
                        }
                    } else {
                        Log.error("Error get price of ", code, data.error);
                        // how to terminalor
                    }
                });
        });
    }

    // 获取指定类型的股票列表
    get_securities(types: string): string[];
    get_securities(types: string[]): { [key: string]: string[]; };  // ts 默认不支持map。。。
    get_securities(types: any = []): any {
        Log.info("get stock list for ", types);
    }

    // 获取指定股票的价格数据
    get_price(security: string, start_date = '2015-01-01', end_date = '2015-12-31', frequency = DAILY) {
        var priceArr = this.priceMap[security], ret: any[];
        if (priceArr == null) {
            Log.error("Error: no security in setting");
            ret = [];
        } else {
            let startIndex = priceArr.indexOf(start_date);  // 采用二分查找？？？
            startIndex = startIndex === -1 ? 0 : startIndex; // 边界检查
            let endIndex: number;
            if (start_date === end_date) {
                endIndex = startIndex;
            } else {
                endIndex = priceArr.indexOf(end_date);
                endIndex = endIndex === -1 ? priceArr.length - 1 : endIndex;
            }

            ret = priceArr.slice(startIndex, endIndex + 1);
        }
        return ret;
    }

    // 设定滑点
    set_slip(slip: number): void {

    }
}

// util.inherits(Context, events.EventEmitter);  // 用ts的继承算了。。。

export = Context;