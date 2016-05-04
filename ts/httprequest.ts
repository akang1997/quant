/// <reference path="../d.ts/request.d.ts" />

import request = require('request');

export function queryPrice(code:string, fromDate:string, toDate:string, succ?:any, err?, complete?) {
    /// http://localhost:8089/json/s?_fw_service=findListBySqlMap&sqlId=com.ain.persist.db.dao.ITickerHisDao.selectTickerHis&jsonData={code:000001,%20fromDate:%271900-01-01%27,toDate:%271998-01-01%27}

    return post({
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

export function post(cfg: any) {
    return request.post({
        url: cfg.url,
        form: cfg.data || {}
    }, function (errInfo, httpResponse, body) {
        reqBack(cfg, errInfo, httpResponse, body);
    });
}

export function get(url: string, succ?, err?, complete?) {
    request(url, function (errInfo, httpResponse, body) {
        reqBack({
            success: succ,
            error: err,
            complete: complete
        }, errInfo, httpResponse, body);
    })
}

function reqBack(cfg, errInfo, httpResponse, body) {
    if (!errInfo && httpResponse.statusCode == 200) {  // no cache
        // console.log(body)
        cfg.success && cfg.success(body);
    } else {
        cfg.err && cfg.err(errInfo, httpResponse, body)
    }
    cfg.complete && cfg.complete(errInfo, httpResponse, body);
}