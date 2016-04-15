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

function n2_to_OuterSubject(obj) {
    let target = new V_EntrustCorpPayment_OuterSubject();
    map(obj, target)
        .forMember('MoneyAmount', 'FinalAmount')
        .forMember('EntrustDate', 'TimeMark')
        .directSetVal('BillTitle', '表外科目登记簿')
        .directSetVal('OpResult', '待收款');
   return target;
}

function n11_to_OuterSubject(obj) {
    let target = new V_EntrustCorpPayment_OuterSubject();
    map(obj, target)
        .forMember('PaymentDate', 'TimeMark')
        .directSetVal('FinalAmount', 0)
        .directSetVal('BillTitle', '表外科目登记簿')
        .directSetVal('OpResult', '已划款');
   return target;
}

module.exports = function(items, stepIdx) {
    switch (stepIdx) {
        /* normal converter */
        case 4: {
            let target = new V_CollectVoucher();
            map(items[0], target);
            return target;
        }     
        case 8: {
            let target = new V_ElectronicVoucher();
            map(items[0], target)
                .forMember('RemitterBank', 'BankName');
            return target;
        }  
        /* register book converter */
        case 2: {            
            return [
                n2_to_OuterSubject(items[0])
            ];
        }
        case 11: {            
            return [
                n2_to_OuterSubject(items[0]),
                n11_to_OuterSubject(items[0])
            ];
        }
    }
}