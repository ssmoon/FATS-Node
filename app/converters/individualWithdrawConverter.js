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

module.exports = function(items, routineTag) {
     switch (routineTag) {
        case 'DWHQ_Withdraw': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '活期');
            return target;
        }
        case 'DWHQ_Clear': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '活期');
            return target;
        }
        case 'DWZZ_Withdraw': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '整整');
            return target;
        }
        case 'DWLZ_Withdraw': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '零整');
            return target;
        }
        case 'DWZL_Withdraw': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '整零');
            return target;
        }
        case 'DWTI_Withdraw': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '本息');
            return target;
        }
        case 'DWZL_Interest': {
            let target = new V_IndividualWithdraw();
            map(items[0], target)
                .directSetVal('DepositType', '整零');
            return target;
        }    
 
    }
}