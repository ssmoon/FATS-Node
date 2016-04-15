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

function n6_to_OuterSubject(obj) {
    let target = new V_BankAcceptBill_OuterSubject();
    map(obj, target)
        .forMember('PayeeBank', 'BankName')
        .forMember('IncomeBillDate', 'TimeMark')
        .directSetVal('CurrStatus', 0)
        .directSetVal('OpResult', '接受申请');
   return target;
}

function n20_to_OuterSubject(obj) {
    let target = new V_BankAcceptBill_OuterSubject();
    map(obj, target)
        .forMember('PayeeBank', 'BankName')
        .forMember('DrawBillDate', 'TimeMark')
        .directSetVal('CurrStatus', 1)
        .directSetVal('OpResult', '已划款');
   return target;
}

function n10_to_OuterSubject(obj) {
    let target = new V_CollectAccept_OuterSubject();
    map(obj, target)
        .forMember('RemitterBank', 'BankName')
        .forMember('TimeMark', 'IncomeBillDate')
        .forMember('DrawBillDate', 'AcceptDate')
        .forMember('IncomeBillDate', 'CollectDate')
        .directSetVal('BillTitle', '托收承付登记簿')
        .directSetVal('OpResult', '待承付');
   return target;
}

function n26_to_OuterSubject(obj) {
    let target = new V_CollectAccept_OuterSubject();
    map(obj, target)
        .forMember('RemitterBank', 'BankName')
        .forMember('TimeMark', 'DrawBillDate')
        .forMember('DrawBillDate', 'AcceptDate')
        .forMember('IncomeBillDate', 'CollectDate')
        .directSetVal('BillTitle', '托收承付登记簿')
        .directSetVal('OpResult', '已承付');
   return target;
}

module.exports = function (items, stepIdx) {
    switch (stepIdx) {
        /* normal converter */
        case 2: {
            let target = new V_TradeAcceptance();
            map(items[0], target);
            return target;
        }
        case 9: {
            let target = new V_CollectVoucher();
            map(items[0], target)
                .forMember('IncomeBillDate', 'CollectDate')
                .forMember('RemitterBank', 'BankName')
                .forMember('DrawBillDate', 'AcceptDate');
            return target;
        }
        case 12: {
            let target = new V_SpecialTransferVoucher();
            map(items[0], target)
                .forMember('DrawBillDate', 'TimeMark')
                .forMember('BillNo', 'OrgVoucherNo')
                .forMember('MoneyAmount', 'OrgVoucherAmount')
                .forMember('RemitterBank', 'BankName')
                .directSetVal('OrgVoucherName', '银行承兑汇票')
                .directSetVal('TransferOrient', '借方')
                .directSetVal('TransferReason', '收取承兑汇票票款');
            return target;
        }
        case 17: {
            let target = new V_ElectronicVoucher();
            map(items[0], target)
                .forMember('DrawBillDate', 'TimeMark')
                .forMember('RemitterBank', 'BankName');
            return target;
        }
        /* register book converter */
        case 6: {            
            return n6_to_OuterSubject(items[0]);
        }
        case 10: {
            return [
                n10_to_OuterSubject(items[0])
            ]
        }
        case 20: {
            return n20_to_OuterSubject(items[0]);
        }
        case 26: {
            return [
                n10_to_OuterSubject(items[0]),
                n26_to_OuterSubject(items[0])
            ]
        }
    }
}