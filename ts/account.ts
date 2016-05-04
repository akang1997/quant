// 资金管理，市值显示
import Context = require("./context");

class Account {
    // 默认剩余资金能够按照年利率5%获得利息，按月获得把

    remainMoney: number; // 剩余资金 
    marketValue: number; // 总市值
    history: any[];      // 记录所有剩余资金的变动

    constructor(
        public startDate: string,
        public endDate: string,
        public initMoney: number,  // 初始资金
        public ctx: Context,
        public interest: number = 0.03  // 剩余资金年利率
    ) {
        this.remainMoney = this.initMoney;
        this.marketValue = this.initMoney;
    }
    
    // 更新每月一次的利息收入
    updateInterestIncome(){
        var delta = this.remainMoney * this.interest / 12;
    }
    
    // 支出 money
    expenditure(amount:number, reason:any){
        
    }
    // 收入money
    income(amount:number, reason:any){
        
    }
}

export = Account;