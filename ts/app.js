"use strict";
var Average = require("../strategy/ts/sample");
var framework = require("./framework");
var Log = require("./log");
framework.run(Average, {
    startDate: "1999-01-01",
    endDate: "2020-01-01"
}, function () {
    Log.info("app done..."); // 异步代码。。。
});
//# sourceMappingURL=app.js.map