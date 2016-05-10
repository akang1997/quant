/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/lodash.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// 提供上下文对象
var Account = require("./account");
var Order = require("./order");
var events = require('events');
var httpRequest = require("./httprequest");
var _ = require("lodash");
var Log = require("./log");
var DAILY = 'daily';
var MINUTE = 'minute';
var Context = (function (_super) {
    __extends(Context, _super);
    function Context(startDate, endDate, initMoney) {
        if (startDate === void 0) { startDate = "1900-01-01"; }
        if (endDate === void 0) { endDate = "2020-12-12"; }
        if (initMoney === void 0) { initMoney = 100000; }
        _super.call(this); // 初始化
        this._index = 0; /// time index
        this.priceMap = {}; // 历史价格数据
        this.DAILY = DAILY; // 为了便于用户使用，弄成实例变量。。。
        this.MINUTE = MINUTE;
        this.account = new Account(startDate, endDate, initMoney, this);
        this.order = new Order(this);
        this.timeArr = ["2015-01-01", "2015-01-02", "2015-01-03"];
    }
    Context.prototype.init = function (strategy) {
        this.strategy = strategy;
        // init user strategy
        strategy.init(this.account, this.order);
    };
    // tick 周期
    Context.prototype.hasNext = function () {
        return this.timeArr.length > this._index;
    };
    Context.prototype.next = function () {
        return this.timeArr[this._index++];
    };
    Context.prototype._add_price = function (code, priceArr) {
        this.priceMap[code] = priceArr;
    };
    Context.prototype._init_timeArr = function () {
        var stocks = Object.keys(this.priceMap);
        var stockPriceArr = this.priceMap[stocks[0]];
        this.timeArr = stockPriceArr.map(function (e) { return e.date; }); // 使用<>进行类型转换
        this.emit("init_done");
    };
    Context.prototype._update_current_price = function (dateStr) {
        this.currentPriceMap = this.getOneDayPriceMap(dateStr);
    };
    Context.prototype.getOneDayPriceMap = function (dateStr) {
        var cp = {};
        for (var code in this.priceMap) {
            cp[code] = _.find(this.priceMap[code], function (e) { return e.date === dateStr; });
        }
        return cp;
    };
    Context.prototype.set_stocks = function (stocks) {
        var _this = this;
        if (!stocks)
            return Log.error("no valid stock set");
        if (!Array.isArray(stocks))
            stocks = [stocks];
        Log.info("stocks to operate is ", stocks);
        var count = stocks.length;
        var self = this;
        stocks.forEach(function (code) {
            httpRequest.queryPrice(code, _this.account.startDate, _this.account.endDate, function (data) {
                if (data.success == true) {
                    self._add_price(code, data.result);
                    count--;
                    if (count === 0) {
                        self._init_timeArr();
                    }
                }
                else {
                    Log.error("Error get price of ", code, data.error);
                }
            });
        });
    };
    Context.prototype.get_securities = function (types) {
        if (types === void 0) { types = []; }
        Log.info("get stock list for ", types);
    };
    // 获取指定股票的价格数据
    Context.prototype.get_price = function (security, start_date, end_date, frequency) {
        if (start_date === void 0) { start_date = '2015-01-01'; }
        if (end_date === void 0) { end_date = '2015-12-31'; }
        if (frequency === void 0) { frequency = DAILY; }
        var priceArr = this.priceMap[security], ret;
        if (priceArr == null) {
            Log.error("Error: no security in setting");
            ret = [];
        }
        else {
            var startIndex = priceArr.indexOf(start_date); // 采用二分查找？？？
            startIndex = startIndex === -1 ? 0 : startIndex; // 边界检查
            var endIndex = void 0;
            if (start_date === end_date) {
                endIndex = startIndex;
            }
            else {
                endIndex = priceArr.indexOf(end_date);
                endIndex = endIndex === -1 ? priceArr.length - 1 : endIndex;
            }
            ret = priceArr.slice(startIndex, endIndex + 1);
        }
        return ret;
    };
    // 设定滑点
    Context.prototype.set_slip = function (slip) {
    };
    return Context;
}(events.EventEmitter));
module.exports = Context;
//# sourceMappingURL=context.js.map