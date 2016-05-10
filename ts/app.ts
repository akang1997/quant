import Average = require("../strategy/ts/sample")
import framework = require("./framework")
import Log = require("./log");

framework.run(Average, {
    startDate: "1999-01-01",
    endDate: "2020-01-01"
}, function () {
    Log.info("app done...");  // 异步代码。。。
});
