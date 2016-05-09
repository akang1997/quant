/// <reference path="../d.ts/request.d.ts" />

import request = require('request');

export function queryPrice(code: string, fromDate: string, toDate: string, succ?: any, err?, complete?) {
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

export function post(cfg: any, isJson = false) {
    return request.post({
        url: cfg.url,
        form: cfg.data || {}
    }, function (errInfo, httpResponse, body) {
        reqBack(cfg, errInfo, httpResponse, body, isJson);
    });
}

export function postJson(cfg: any) {
    post(cfg, true);
}
export function getJson(url: string, succ?, err?, complete?) {
    get(url, succ, err,complete, true);
}

export function get(url: string, succ?, err?, complete?, isJson = false) {
    request(url, function (errInfo, httpResponse, body) {
        reqBack({
                success: succ,
                error: err,
                complete: complete
            }
            , errInfo
            , httpResponse
            , body
            , isJson);
    })
}

// 请求完成后的处理
function reqBack(cfg, errInfo, httpResponse, body, isJson: boolean) {
    if (!errInfo && httpResponse.statusCode == 200) {  // no cache
        // Log.info(body)
        if (isJson) body = JSON.parse(body);
        cfg.success && cfg.success(body);
    } else {
        cfg.err && cfg.err(errInfo, httpResponse, body)
    }
    cfg.complete && cfg.complete(errInfo, httpResponse, body);
}