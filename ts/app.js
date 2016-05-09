"use strict";
var Average = require("../strategy/ts/sample");
var framework = require("./framework");
var Log = require("./log");
framework.run(Average, function () {
    Log.info("app done..."); // 异步代码。。。
});
//# sourceMappingURL=app.js.map