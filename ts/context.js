/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/lodash-3.10.d.ts" />
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
var DAILY = 'daily';
var MINUTE = 'minute';
var Context = (function (_super) {
    __extends(Context, _super);
    function Context(startDate, endDate, initMoney) {
        if (startDate === void 0) { startDate = "1900-01-01"; }
        if (endDate === void 0) { endDate = "2016-12-12"; }
        if (initMoney === void 0) { initMoney = 100000; }
        _super.call(this); // 初始化
        this._index = 0; /// time index
        this.priceMap = {};
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
        this.timeArr = _.pluck(this.priceMap[stocks[0]], "");
        this.emit("init_done");
    };
    Context.prototype.set_stocks = function (stocks) {
        var _this = this;
        if (!stocks)
            return console.warn("no valid stock set");
        if (!Array.isArray(stocks))
            stocks = [stocks];
        console.log("stocks to operate is ", stocks);
        var count = stocks.length;
        var self = this;
        stocks.forEach(function (element) {
            httpRequest.queryPrice(element, _this.account.startDate, _this.account.endDate, function (data) {
                self._add_price(element, data);
                count--;
                if (count === 0) {
                    self._init_timeArr();
                }
            });
        });
    };
    Context.prototype.get_securities = function (types) {
        if (types === void 0) { types = []; }
        console.log("get stock list for ", types);
    };
    // 获取指定股票的价格数据
    Context.prototype.get_price = function (security, start_date, end_date, frequency) {
        if (start_date === void 0) { start_date = '2015-01-01'; }
        if (end_date === void 0) { end_date = '2015-12-31'; }
        if (frequency === void 0) { frequency = DAILY; }
    };
    // 设定滑点
    Context.prototype.set_slip = function (slip) {
    };
    return Context;
}(events.EventEmitter));
module.exports = Context;
//# sourceMappingURL=context.js.map