var Main;
(function (Main) {
    var Account = (function () {
        function Account() {
        }
        return Account;
    }());
    Main.Account = Account;
})(Main || (Main = {}));
/// <reference path="account.ts" />
var Main;
(function (Main) {
    var Container = (function () {
        function Container() {
        }
        Container.main = function () {
            console.log('Hello World');
            return 0;
        };
        return Container;
    }());
    Main.Container = Container;
})(Main || (Main = {}));
Main.Container.main();
var a = new Main.Account();
// var a :Number = 1;
// console.log(a);
// ss 
//# sourceMappingURL=app.bundle.js.map