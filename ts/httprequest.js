/// <reference path="../d.ts/request.d.ts" />
"use strict";
var request = require('request');
function queryPrice(code, fromDate, toDate, succ, err, complete) {
    /// http://128.160.181.71:8089/json/s?_fw_service=findListBySqlMap&sqlId=com.ain.persist.db.dao.ITickerHisDao.selectTickerHis&jsonData={"code":"000001","fromDate":"1900-01-01","toDate":"1998-01-01"}
    return postJson({
        url: 'http://128.160.181.71:8089/json/s' + "?_=" + Math.random(),
        data: {
            "_fw_service": "findListBySqlMap",
            "sqlId": "com.ain.persist.db.dao.ITickerHisDao.selectTickerHis",
            "jsonData": JSON.stringify({
                "code": code,
                "fromDate": fromDate,
                "toDate": toDate
            })
        },
        success: succ,
        error: err,
        complete: complete
    });
}
exports.queryPrice = queryPrice;
function post(cfg, isJson) {
    if (isJson === void 0) { isJson = false; }
    return request.post({
        url: cfg.url,
        form: cfg.data || {}
    }, function (errInfo, httpResponse, body) {
        reqBack(cfg, errInfo, httpResponse, body, isJson);
    });
}
exports.post = post;
function postJson(cfg) {
    post(cfg, true);
}
exports.postJson = postJson;
function getJson(url, succ, err, complete) {
    get(url, succ, err, complete, true);
}
exports.getJson = getJson;
function get(url, succ, err, complete, isJson) {
    if (isJson === void 0) { isJson = false; }
    request(url, function (errInfo, httpResponse, body) {
        reqBack({
            success: succ,
            error: err,
            complete: complete
        }, errInfo, httpResponse, body, isJson);
    });
}
exports.get = get;
// 请求完成后的处理
function reqBack(cfg, errInfo, httpResponse, body, isJson) {
    if (!errInfo && httpResponse.statusCode == 200) {
        // Log.info(body)
        if (isJson)
            body = JSON.parse(body);
        cfg.success && cfg.success(body);
    }
    else {
        cfg.err && cfg.err(errInfo, httpResponse, body);
    }
    cfg.complete && cfg.complete(errInfo, httpResponse, body);
}
//# sourceMappingURL=httprequest.js.map