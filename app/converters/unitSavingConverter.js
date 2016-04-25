'use strict';

const V_BusinessProxy = require('../viewModels/V_BusinessProxy');
const V_BankDraft = require('../viewModels/V_BankDraft');
const V_BankAcceptBill_OuterSubject = require('../viewModels/V_BankAcceptBill_OuterSubject');
const V_CashCheck = require('../viewModels/V_CashCheck');
const V_CashPayInBill = require('../viewModels/V_CashPayInBill');
const V_CollectAccept_OuterSubject = require('../viewModels/V_CollectAccept_OuterSubject');
const V_CollectVoucher = require('../viewModels/V_CollectVoucher');
const V_DiscountingVoucher = require('../viewModels/V_DiscountingVoucher');
const V_ElectronicVoucher = require('../viewModels/V_ElectronicVoucher');
const V_EntrustCorpPayment_OuterSubject = require('../viewModels/V_EntrustCorpPayment_OuterSubject');
const V_EntrustPaymentVoucher = require('../viewModels/V_EntrustPaymentVoucher');
const V_IncomeBill = require('../viewModels/V_IncomeBill');
const V_IndividualDeposit = require('../viewModels/V_IndividualDeposit');
const V_IndividualWithdraw = require('../viewModels/V_IndividualWithdraw');
const V_InterestSummons = require('../viewModels/V_InterestSummons');
const V_InterestVoucher = require('../viewModels/V_InterestVoucher');
const V_LoanVoucher = require('../viewModels/V_LoanVoucher');
const V_SpecialTransferVoucher = require('../viewModels/V_SpecialTransferVoucher');
const V_TradeAcceptance = require('../viewModels/V_TradeAcceptance');
const V_TransferCheck = require('../viewModels/V_TransferCheck');
const V_UnitWithdrawVoucher = require('../viewModels/V_UnitWithdrawVoucher');

const map = require('./map');

module.exports = function(items, routineTag, subStep) {
    switch (routineTag) {
        case 'CMHQ~Deposit': {
            let target = new V_CashPayInBill();
            map(items[0], target);
            return target;
        }      
        case 'CMHQ~Withdraw': {
            let target = new V_CashCheck();
            map(items[0], target);
            return target;
        }  
        case 'CMHQ~Interest': {
            let target = new V_InterestVoucher();
            map(items[0], target)
                .forMember('ClientName', 'InterestClient')
                .forMember('TimeMark', 'InterestTime')
                .directSetVal('Abstract', '结息');
            return target;
        } 
        case 'CMDQ~Deposit': {
            switch (subStep) {
                case 1: {
                    let target = new V_IncomeBill();
                    map(items[0], target)
                        .forMember('EntryAmount', 'MoneyAmount')
                        .forMember('TimeMark', 'IncomeBillDate')
                        .forMember('BankName', 'PayeeBank')
                        .forMember('ClientAcc', 'PayeeAcc')
                        .forMember('ClientName', 'PayeeName')
                        .forMember('ClientName', 'RemitterName')                        
                        .forMember('BankName', 'RemitterBank')
                        .directSetVal('RemitterAcc', '001800101000116'); //案例中没有给出定期账户账号
                    return target;
                }      
                case 2: {
                    let target = new V_TransferCheck();
                    map(items[0], target)
                        .forMember('EntryAmount', 'MoneyAmount')
                        .forMember('BankName', 'PayeeBank')
                        .forMember('ClientName', 'RemitterName')
                        .forMember('ClientAcc', 'PayeeAcc')
                        .forMember('TimeMark', 'ChequeDate')
                        .directSetVal('Purpose', '转存定期');
                    return target;
                }
            }   
            break;         
        } 
         case 'CMDQ~Interest': {
            let target = new V_SpecialTransferVoucher();
            map(items[0], target);
            return target;
        } 
        case 'CMDQ~Withdraw': {
            switch (subStep) {
                case 1: {
                    let target = new V_UnitWithdrawVoucher();
                    map(items[0], target);
                    return target;
                }
                case 2: {
                    let target = new V_InterestSummons();
                    map(items[0], target);
                    return target;
                }
            }
            break;            
        }        
    }
}