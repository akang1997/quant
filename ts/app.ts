import Average = require("../strategy/ts/sample")
import framework = require("./framework")
import Log = require("./log");

framework.run(Average, function () {
    Log.info("app done...");  // 异步代码。。。
});
