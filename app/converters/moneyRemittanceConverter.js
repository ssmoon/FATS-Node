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

module.exports = function(items, stepIdx) {
    switch (stepIdx) {
        /* normal converter */
        case 2: {
            let target = new V_BusinessProxy();
            map(items[0], target)
                .forMember('RemitterBank', 'BankName');
            return target;
        }      
        case 7: {
            let target = new V_ElectronicVoucher();
            map(items[0], target)
                .forMember('RemitterBank', 'BankName');
            return target;
        }  
    }
}