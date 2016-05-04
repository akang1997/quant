/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/lodash-3.10.d.ts" />


// 提供上下文对象
import Account = require("./account")
import Order = require("./order")
import Stragety = require("./IStrategy");
import events = require('events');
import util = require("util");
import httpRequest = require("./httprequest")
import _ = require("lodash");

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
    currentPriceMap: { [key: string]: number };  // 当前tick的code/price map

    DAILY = DAILY;  // 为了便于用户使用，弄成实例变量。。。
    MINUTE = MINUTE;

    constructor(startDate: string = "1900-01-01", endDate: string = "2016-12-12", initMoney: number = 100000) {  // default value
        super();// 初始化
        this.account = new Account(startDate, endDate, initMoney, this);
        this.order = new Order(this);
        this.timeArr = ["2015-01-01", "2015-01-02", "2015-01-03"];
    }

    init(strategy: Stragety.IStrategy) {
        this.strategy = strategy;

        // init user strategy
        strategy.init(this.account, this.order);
    }

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
    
    _update_current_price(dateStr: string){
        this.currentPriceMap = this.getOneDayPriceMap(dateStr);
    }
    
    getOneDayPriceMap(dateStr: string):{[key:string]:number}{
        var cp:{[key:string]:number} = {};
        for(var code in this.priceMap){
            cp[code] = _.find(this.priceMap[code], e => e.date === dateStr);
        }
        return cp;
    }
    
    // 用户初始化的时候，设置他要操作的所有stock，限定范围，从而一次性取回数据。。。
    // 可以调用多次？？？
    set_stocks(stock: string): void;
    set_stocks(stocks: string[]): void;
    set_stocks(stocks: any): void {
        if (!stocks) return console.warn("no valid stock set");
        if (!Array.isArray(stocks)) stocks = [stocks];
        console.log("stocks to operate is ", stocks);
        let count = stocks.length;
        let self = this;
        stocks.forEach(element => {
            httpRequest.queryPrice(element,
                this.account.startDate,
                this.account.endDate,
                function (data: any) {
                    self._add_price(element, data);
                    count--;
                    if (count === 0) {
                        self._init_timeArr();
                    }
                });
        });
    }

    // 获取指定类型的股票列表
    get_securities(types: string): string[];
    get_securities(types: string[]): { [key: string]: string[]; };  // ts 默认不支持map。。。
    get_securities(types: any = []): any {
        console.log("get stock list for ", types);
    }

    // 获取指定股票的价格数据
    get_price(security: string, start_date = '2015-01-01', end_date = '2015-12-31', frequency = DAILY) {
        var priceArr = this.priceMap[security], ret: any[];
        if (priceArr == null) {
            console.log("Error: no security in setting");
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