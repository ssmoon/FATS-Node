'use strict';

const XLSX = require('xlsx');
const dbContext = require('./db-context');
const co = require('co');

module.exports = {
    importPaySettle: function (callback) {
        
        let workbook = XLSX.readFile('data/paysettle.xls');        
        let sRoutine = XLSX.utils.sheet_to_json(workbook.Sheets['主流程']);
        
        let sGroup = XLSX.utils.sheet_to_json(workbook.Sheets['案例分组']);
        let sTemplateNode = XLSX.utils.sheet_to_json(workbook.Sheets['详细流程']);
        let sSubjectItem = XLSX.utils.sheet_to_json(workbook.Sheets['科目']);
        let sCashJournal = XLSX.utils.sheet_to_json(workbook.Sheets['现金账']);
        let sDetailedLedger = XLSX.utils.sheet_to_json(workbook.Sheets['明细账']);
        let sCustomerLedger = XLSX.utils.sheet_to_json(workbook.Sheets['分户账']);
        let sGeneralLedger = XLSX.utils.sheet_to_json(workbook.Sheets['总账']);
        let sOuterSubject = XLSX.utils.sheet_to_json(workbook.Sheets['表外科目']);
        
        let sBankDraft = XLSX.utils.sheet_to_json(workbook.Sheets['银行汇票']);
        let sBankAcceptBill = XLSX.utils.sheet_to_json(workbook.Sheets['银行承兑汇票']);
        let sMoneyRemittance = XLSX.utils.sheet_to_json(workbook.Sheets['汇兑']);
        let sCollectAccept = XLSX.utils.sheet_to_json(workbook.Sheets['托收承付']);
        let sEntrustCorpPayment = XLSX.utils.sheet_to_json(workbook.Sheets['委托收款']);
        let sEntrustBankPayment = XLSX.utils.sheet_to_json(workbook.Sheets['委托收款-银行']);
       
        co(function *() {
            let idStr = "(''2'', ''3'', ''4'', ''5'', ''6'', ''7'')";
            yield dbContext.Container.query("CALL DelTestRoutine('" + idStr + "');");   
                   
            let tmpRoutineList = sRoutine.map((item) => {
                return {
                    Row_ID: item.编号,
                    RoutineName: item.流程名称,
                    RoutineDesc: '',
                    RoutineType: 1,
                    RoutineTag: item.RoutineTag
                }
            });            
            yield dbContext.TemplateRoutine.bulkCreate(tmpRoutineList);
            
            let tmpNodeList = sTemplateNode.map((item) => {
                return {
                    Row_ID: item.步骤编号,
                    RoutineID: item.流程,
                    NodeIndex: item.顺序号,
                    NodeName: item.步骤名称,
                    GroupIdx: item.分组号,
                    RequireRecord: item.分录数量,
                    Tag: item.Tag,
                    NodeType: item.NodeType                    
                }
            })
            let templateNodeMapper = {};
            tmpNodeList.forEach((n) => {
                templateNodeMapper[n.Row_ID] = n;
            })
            yield dbContext.TemplateNode.bulkCreate(tmpNodeList);
            
            let teachingRList = tmpRoutineList.map((n) => {
                return {
                    CurrStatus: 0,
                    CaseName: n.RoutineName,
                    TmpRoutineID: n.Row_ID
                }
            })
            for (let i = 0; i <= teachingRList.length - 1; i ++) {
                teachingRList[i].Row_ID = (yield dbContext.TeachingRoutine.create(teachingRList[i])).dataValues.Row_ID;
            }
            
            let teachingNList = tmpNodeList.map((n) => {
                return {
                    CurrStatus: 0,
                    TmpNodeID: n.Row_ID,
                    RoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.RoutineID }).Row_ID
                }
            })
               
            let templateTeachingNodeMapper = {};
            for (let i = 0; i <= teachingNList.length - 1; i ++) {
                teachingNList[i].Row_ID = (yield dbContext.TeachingNode.create(teachingNList[i])).dataValues.Row_ID;
                templateTeachingNodeMapper[teachingNList[i].TmpNodeID] = teachingNList[i];
            }
            
            let groupList = sGroup.map((n) => {
                return {
                    GroupText: n.案例文字,
                    GroupIdx: n.分组号,
                    RoutineIntro: n.案例介绍,
                    RoutineDesc: n.分组号 + "." + n.分组名称,
                    TchRoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID
                }
            })
            
            let groupMapper = {};
            for (let i = 0; i <= groupList.length - 1; i ++) {
                groupList[i].Row_ID = (yield dbContext.RoutineGroup.create(groupList[i])).dataValues.Row_ID;
                groupMapper[groupList[i].TchRoutineID + "-" + groupList[i].GroupIdx] = groupList[i];
            }
            
            yield dbContext.SubjectItem.bulkCreate(sSubjectItem.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    SubjectName: n.科目,
                    SubjectOrient: n.方向,
                    SubjectType: n.类型,
                    ChangeOrient: n.增减,
                    SubSubject: n.子科目,
                    NextLedger: n.下一步,
                    Amount: n.金额
                }
            }))
            
            yield dbContext.OuterSubject.bulkCreate(sOuterSubject.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    Abstract: n.摘要,
                    ClientAcc: n.客户账号,
                    SubjectName: n.科目,
                    MoneyAmount: n.金额,
                    TimeMark: n.时间,
                }
            }))
            
            if ((sCashJournal.length > 0) && (sCashJournal[0].流程)) {  
                yield dbContext.CashJournal.bulkCreate(sCashJournal.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        CashOrient: n.账簿类型,
                        ClientAcc: n.客户账号,
                        CounterSubject: n.对方科目,
                        MoneyAmount: n.金额,
                        TimeMark: n.时间,
                        VoucherNo: n.凭证号,
                    }
                }))
            }
            
            yield dbContext.DetailedLedger.bulkCreate(sDetailedLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方,
                    CreditSum: n.贷方,
                    BalanceSum: n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }))
            
            if ((sCustomerLedger.length > 0) && (sCustomerLedger[0].流程))
            {       
                yield dbContext.CustomerLedger.bulkCreate(sCustomerLedger.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        BalanceAbstract: n.余额摘要,
                        Abstract: n.摘要,
                        SubjectName: n.科目,
                        DebitSum: n.借方,
                        CreditSum: n.贷方,
                        BalanceSum: n.余额,
                        FinalSum: n.最终金额,
                        TimeMark: n.时间,
                        BalanceTime: n.余额时间,
                        DCChoice: n.借或贷,
                        CustomerAccNo: n.客户账号,
                        CustomerName: n.客户名称,
                        VoucherNo: n.凭证号,
                    }
                }));
            }
            yield dbContext.GeneralLedger.bulkCreate(sGeneralLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方,
                    CreditSum: n.贷方,
                    BalanceSum:  n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }))
            
            /*******************************************************************/
            
            yield dbContext.BankDraft.bulkCreate(sBankDraft.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',               
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: n.付款人账号,
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,
                    CloseAmount: n.实际结算金额,                    
                    DraftDate: n.汇票日期,
                    IncomeBillDate: n.进账单日期,
                    DraftBillNo: n.汇票号
                }
            }))
                      
            yield dbContext.BankAcceptBill.bulkCreate(sBankAcceptBill.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',               
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: n.付款人账号,
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,
                    BillNo: n.商业汇票号,                    
                    DrawBillDate: n.出票日期,
                    IncomeBillDate: n.进账单日期,
                }
            }))
            
             yield dbContext.MoneyRemittance.bulkCreate(sMoneyRemittance.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',                
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: n.付款人账号,
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,
                    AffluxDate: n.汇入日期,
                    RemitDate: n.汇出日期,
                    SettlementNo: n.结算号,
                }
            }))
            
            yield dbContext.CollectAccept.bulkCreate(sCollectAccept.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',                
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: n.付款人账号,
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,                                        
                    CollectDate: n.托收日期,
                    AcceptDate: n.承付期满日,
                    SettlementNo: n.结算号,
                }
            }))
            
            yield dbContext.EntrustCorpPayment.bulkCreate(sEntrustCorpPayment.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',                
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: n.付款人账号,
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,
                    EntrustDate: n.委托日期,
                    PaymentDate: n.付款日期,
                    SettlementNo: n.结算号,
                }
            }))
            
            yield dbContext.EntrustBankPayment.bulkCreate(sEntrustBankPayment.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',                
                    RemitterName: n.收款人名称,
                    RemitterAcc: n.收款人账号,
                    RemitterBank: n.收款方银行,
                    PayeeName: n.付款人名称,
                    PayeeAcc: '',
                    PayeeBank: n.付款方银行,
                    MoneyAmount: n.金额,
                    Purpose: n.目的,
                    EntrustDate: n.委托日期,
                    PaymentDate: n.付款日期,
                    SettlementNo: n.结算号,
                }
            }))
            
       
            
        }).then(() => {
            callback(null);
        })
    },
    
    importIndividualSaving: function (callback) {
        let workbook = XLSX.readFile('data/individualsaving.xls');        
        let sRoutine = XLSX.utils.sheet_to_json(workbook.Sheets['主流程']);
        
        let sGroup = XLSX.utils.sheet_to_json(workbook.Sheets['案例分组']);
        let sTemplateNode = XLSX.utils.sheet_to_json(workbook.Sheets['详细流程']);
        let sSubjectItem = XLSX.utils.sheet_to_json(workbook.Sheets['科目']);
        let sCashJournal = XLSX.utils.sheet_to_json(workbook.Sheets['现金账']);
        let sDetailedLedger = XLSX.utils.sheet_to_json(workbook.Sheets['明细账']);
        let sCustomerLedger = XLSX.utils.sheet_to_json(workbook.Sheets['分户账']);
        let sGeneralLedger = XLSX.utils.sheet_to_json(workbook.Sheets['总账']);
        let sOuterSubject = XLSX.utils.sheet_to_json(workbook.Sheets['表外科目']);
        
        let sIndividualSaving = XLSX.utils.sheet_to_json(workbook.Sheets['个人存款']);
        
        co(function *() {
            let idStr  = "(''9-1'', ''9-2'', ''9-3'', ''9-4'', ''10-1'', ''10-2'', ''11-1'', ''11-2'', ''12-1'', ''12-2'', ''12-3'', ''13-1'', ''13-2'', ''13-3'')";
            yield dbContext.Container.query("CALL DelTestRoutine('" + idStr + "');");   
                   
            let tmpRoutineList = sRoutine.map((item) => {
                return {
                    Row_ID: item.编号,
                    RoutineName: item.流程名称,
                    RoutineDesc: '',
                    RoutineType: 1,
                    RoutineTag: item.RoutineTag
                }
            });            
            yield dbContext.TemplateRoutine.bulkCreate(tmpRoutineList);
            
            let tmpNodeList = sTemplateNode.map((item) => {
                return {
                    Row_ID: item.步骤编号,
                    RoutineID: item.流程,
                    NodeIndex: item.顺序号,
                    NodeName: item.步骤名称,
                    GroupIdx: item.分组号,
                    RequireRecord: item.分录数量,
                    Tag: item.Tag,
                    NodeType: item.NodeType                    
                }
            })
            let templateNodeMapper = {};
            tmpNodeList.forEach((n) => {
                templateNodeMapper[n.Row_ID] = n;
            })
            yield dbContext.TemplateNode.bulkCreate(tmpNodeList);
            
            let teachingRList = tmpRoutineList.map((n) => {
                return {
                    CurrStatus: 0,
                    CaseName: n.RoutineName,
                    TmpRoutineID: n.Row_ID
                }
            })
            for (let i = 0; i <= teachingRList.length - 1; i ++) {
                teachingRList[i].Row_ID = (yield dbContext.TeachingRoutine.create(teachingRList[i])).dataValues.Row_ID;
            }
            
            let teachingNList = tmpNodeList.map((n) => {
                return {
                    CurrStatus: 0,
                    TmpNodeID: n.Row_ID,
                    RoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.RoutineID }).Row_ID
                }
            })
               
            let templateTeachingNodeMapper = {};
            for (let i = 0; i <= teachingNList.length - 1; i ++) {
                teachingNList[i].Row_ID = (yield dbContext.TeachingNode.create(teachingNList[i])).dataValues.Row_ID;
                templateTeachingNodeMapper[teachingNList[i].TmpNodeID] = teachingNList[i];
            }
            
            let groupList = sGroup.map((n) => {
                return {
                    GroupText: n.案例文字,
                    GroupIdx: n.分组号,
                    RoutineIntro: n.案例介绍,
                    RoutineDesc: n.分组号 + "." + n.分组名称,
                    TchRoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID
                }
            })
            
            let groupMapper = {};
            for (let i = 0; i <= groupList.length - 1; i ++) {
                groupList[i].Row_ID = (yield dbContext.RoutineGroup.create(groupList[i])).dataValues.Row_ID;
                groupMapper[groupList[i].TchRoutineID + "-" + groupList[i].GroupIdx] = groupList[i];
            }
            
            yield dbContext.SubjectItem.bulkCreate(sSubjectItem.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    SubjectName: n.科目,
                    SubjectOrient: n.方向,
                    SubjectType: n.类型,
                    ChangeOrient: n.增减,
                    SubSubject: n.子科目,
                    NextLedger: n.下一步,
                    Amount: n.金额
                }
            }))
            
            yield dbContext.OuterSubject.bulkCreate(sOuterSubject.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    Abstract: n.摘要,
                    ClientAcc: n.客户账号,
                    SubjectName: n.科目,
                    MoneyAmount: n.金额,
                    TimeMark: n.时间,
                }
            }))
            
            if ((sCashJournal.length > 0) && (sCashJournal[0].流程)) {  
                yield dbContext.CashJournal.bulkCreate(sCashJournal.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        CashOrient: n.账簿类型,
                        ClientAcc: n.客户账号,
                        CounterSubject: n.对方科目,
                        MoneyAmount: n.金额,
                        TimeMark: n.时间,
                        VoucherNo: n.凭证号,
                    }
                }))
            }
            
            yield dbContext.DetailedLedger.bulkCreate(sDetailedLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方 ? n.借方 : 0,
                    CreditSum: n.贷方 ? n.贷方 : 0,
                    BalanceSum: n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }));
            
            if ((sCustomerLedger.length > 0) && (sCustomerLedger[0].流程))
            {       
                yield dbContext.CustomerLedger.bulkCreate(sCustomerLedger.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        BalanceAbstract: n.余额摘要,
                        Abstract: n.摘要,
                        SubjectName: n.科目,
                        DebitSum: n.借方 ? n.借方 : 0,
                        CreditSum: n.贷方 ? n.贷方 : 0,
                        BalanceSum: n.余额,
                        FinalSum: n.最终金额,
                        TimeMark: n.时间,
                        BalanceTime: n.余额时间,
                        DCChoice: n.借或贷,
                        CustomerAccNo: n.客户账号,
                        CustomerName: n.客户名称,
                        VoucherNo: n.凭证号,
                    }
                }));
            }
            
            
            yield dbContext.GeneralLedger.bulkCreate(sGeneralLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方 ? n.借方 : 0,
                    CreditSum: n.贷方 ? n.贷方 : 0,
                    BalanceSum:  n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }))
            
            /*******************************************************************/
                      
            yield dbContext.IndividualSaving.bulkCreate(sIndividualSaving.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.TchRoutineID }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',               
                    InterestTime: n.InterestTime,
                    AccountCreateTime: n.AccountCreateTime,
                    DepositTime: n.DepositTime,
                    WithdrawTime: n.WithdrawTime,
                    InterestAmount: n.InterestAmount ? n.InterestAmount : 0,
                    EntryAmount: n.EntryAmount ? n.EntryAmount : 0,                 
                    ClientAcc: n.ClientAcc,
                    DepositClient: n.DepositClient,
                    WithdrawClient: n.WithdrawClient,
                    BankName: n.BankName,
                    InterestClient: n.InterestClient,
                    VoucherNo: n.VoucherNo,
                    DepositPeriod: n.DepositPeriod
                }
            }))
            
            
        }).then(() => {
            callback(null);
        })
    },
    
    importUnitSaving: function (callback) {
        let workbook = XLSX.readFile('data/unitsaving.xls');        
        let sRoutine = XLSX.utils.sheet_to_json(workbook.Sheets['主流程']);
        
        let sGroup = XLSX.utils.sheet_to_json(workbook.Sheets['案例分组']);
        let sTemplateNode = XLSX.utils.sheet_to_json(workbook.Sheets['详细流程']);
        let sSubjectItem = XLSX.utils.sheet_to_json(workbook.Sheets['科目']);
        let sCashJournal = XLSX.utils.sheet_to_json(workbook.Sheets['现金账']);
        let sDetailedLedger = XLSX.utils.sheet_to_json(workbook.Sheets['明细账']);
        let sCustomerLedger = XLSX.utils.sheet_to_json(workbook.Sheets['分户账']);
        let sGeneralLedger = XLSX.utils.sheet_to_json(workbook.Sheets['总账']);
        let sOuterSubject = XLSX.utils.sheet_to_json(workbook.Sheets['表外科目']);
        
        let sUnitSaving = XLSX.utils.sheet_to_json(workbook.Sheets['单位存款']);
        let sDiscounting =  XLSX.utils.sheet_to_json(workbook.Sheets['贴现']);
        let sLoan =  XLSX.utils.sheet_to_json(workbook.Sheets['贷款']);
        
        co(function *() {
            let idStr  = "(''8-1'', ''8-2'', ''8-3'', ''8-4'', ''8-5'', ''8-6'', ''15-1'', ''15-2'', ''16-1'', ''16-2'', ''17-1'', ''17-2'')";
            yield dbContext.Container.query("CALL DelTestRoutine('" + idStr + "');");   
                   
            let tmpRoutineList = sRoutine.map((item) => {
                return {
                    Row_ID: item.编号,
                    RoutineName: item.流程名称,
                    RoutineDesc: '',
                    RoutineType: 1,
                    RoutineTag: item.RoutineTag
                }
            });            
            yield dbContext.TemplateRoutine.bulkCreate(tmpRoutineList);
            
            let tmpNodeList = sTemplateNode.map((item) => {
                return {
                    Row_ID: item.步骤编号,
                    RoutineID: item.流程,
                    NodeIndex: item.顺序号,
                    NodeName: item.步骤名称,
                    GroupIdx: item.分组号,
                    RequireRecord: item.分录数量,
                    Tag: item.Tag,
                    NodeType: item.NodeType                    
                }
            })
            let templateNodeMapper = {};
            tmpNodeList.forEach((n) => {
                templateNodeMapper[n.Row_ID] = n;
            })
            yield dbContext.TemplateNode.bulkCreate(tmpNodeList);
            
            let teachingRList = tmpRoutineList.map((n) => {
                return {
                    CurrStatus: 0,
                    CaseName: n.RoutineName,
                    TmpRoutineID: n.Row_ID
                }
            })
            for (let i = 0; i <= teachingRList.length - 1; i ++) {
                teachingRList[i].Row_ID = (yield dbContext.TeachingRoutine.create(teachingRList[i])).dataValues.Row_ID;
            }
            
            let teachingNList = tmpNodeList.map((n) => {
                return {
                    CurrStatus: 0,
                    TmpNodeID: n.Row_ID,
                    RoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.RoutineID }).Row_ID
                }
            })
               
            let templateTeachingNodeMapper = {};
            for (let i = 0; i <= teachingNList.length - 1; i ++) {
                teachingNList[i].Row_ID = (yield dbContext.TeachingNode.create(teachingNList[i])).dataValues.Row_ID;
                templateTeachingNodeMapper[teachingNList[i].TmpNodeID] = teachingNList[i];
            }
            
            let groupList = sGroup.map((n) => {
                return {
                    GroupText: n.案例文字,
                    GroupIdx: n.分组号,
                    RoutineIntro: n.案例介绍,
                    RoutineDesc: n.分组号 + "." + n.分组名称,
                    TchRoutineID: teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID
                }
            })
            
            let groupMapper = {};
            for (let i = 0; i <= groupList.length - 1; i ++) {
                groupList[i].Row_ID = (yield dbContext.RoutineGroup.create(groupList[i])).dataValues.Row_ID;
                groupMapper[groupList[i].TchRoutineID + "-" + groupList[i].GroupIdx] = groupList[i];
            }
            
            yield dbContext.SubjectItem.bulkCreate(sSubjectItem.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    SubjectName: n.科目,
                    SubjectOrient: n.方向,
                    SubjectType: n.类型,
                    ChangeOrient: n.增减,
                    SubSubject: n.子科目,
                    NextLedger: n.下一步,
                    Amount: n.金额
                }
            }))
            
            yield dbContext.OuterSubject.bulkCreate(sOuterSubject.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    Abstract: n.摘要,
                    ClientAcc: n.客户账号,
                    SubjectName: n.科目,
                    MoneyAmount: n.金额,
                    TimeMark: n.时间,
                }
            }))
            
            if ((sCashJournal.length > 0) && (sCashJournal[0].流程)) {  
                yield dbContext.CashJournal.bulkCreate(sCashJournal.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        CashOrient: n.账簿类型,
                        ClientAcc: n.客户账号,
                        CounterSubject: n.对方科目,
                        MoneyAmount: n.金额,
                        TimeMark: n.时间,
                        VoucherNo: n.凭证号,
                    }
                }))
            }
            
            yield dbContext.DetailedLedger.bulkCreate(sDetailedLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方 ? n.借方 : 0,
                    CreditSum: n.贷方 ? n.贷方 : 0,
                    BalanceSum: n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }));
            
            if ((sCustomerLedger.length > 0) && (sCustomerLedger[0].流程))
            {       
                yield dbContext.CustomerLedger.bulkCreate(sCustomerLedger.map((n) => {
                    let refNode = templateTeachingNodeMapper[n.步骤编号];
                    let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                    return {
                        TchRoutineID: tchRoutineID,
                        TchNodeID: refNode.Row_ID,
                        RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                        BankName: n.银行名称,
                        BalanceAbstract: n.余额摘要,
                        Abstract: n.摘要,
                        SubjectName: n.科目,
                        DebitSum: n.借方 ? n.借方 : 0,
                        CreditSum: n.贷方 ? n.贷方 : 0,
                        BalanceSum: n.余额,
                        FinalSum: n.最终金额,
                        TimeMark: n.时间,
                        BalanceTime: n.余额时间,
                        DCChoice: n.借或贷,
                        CustomerAccNo: n.客户账号,
                        CustomerName: n.客户名称,
                        VoucherNo: n.凭证号,
                    }
                }));
            }
            
            
            yield dbContext.GeneralLedger.bulkCreate(sGeneralLedger.map((n) => {
                let refNode = templateTeachingNodeMapper[n.步骤编号];
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchNodeID: refNode.Row_ID,
                    RoutineDesc: groupMapper[tchRoutineID + '-' + templateNodeMapper[refNode.TmpNodeID].GroupIdx].RoutineDesc,
                    BankName: n.银行名称,
                    BalanceAbstract: n.余额摘要,
                    Abstract: n.摘要,
                    SubjectName: n.科目,
                    DebitSum: n.借方 ? n.借方 : 0,
                    CreditSum: n.贷方 ? n.贷方 : 0,
                    BalanceSum:  n.余额,
                    FinalSum: n.最终金额,
                    TimeMark: n.时间,
                    BalanceOrient: n.余额方向
                }
            }))
            
            /*******************************************************************/
                      
            yield dbContext.UnitSaving.bulkCreate(sUnitSaving.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',               
                    TimeMark: n.日期,
                    InterestAmount: n.利息,
                    EntryAmount: n.金额,
                    ClientAcc: n.账号,
                    ClientName: n.单位名称,
                    BankName: n.银行名称,
                    VoucherNo: n.凭证号码,
                    MoneySource: n.来源,
                    Purpose: n.用途,
                }
            }))
            
            yield dbContext.Loan.bulkCreate(sLoan.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',   
                    InterestAmount: n.利息,
                    MoneyAmount: n.金额,
                    ClientName: n.单位名称,
                    BankName: n.银行名称,
                    Purpose: n.用途,
                    InterestRate: n.利率,
                    LoanType: n.贷款种类,
                    LoanAcc: n.贷款户账号,
                    RepayAcc: n.存款户账号,
                    LoanDate: n.借款日期,
                    RepayDate: n.还贷日期
                }
            }))
            
            yield dbContext.Discounting.bulkCreate(sDiscounting.map((n) => {
                let tchRoutineID = teachingRList.find((r) => { return r.TmpRoutineID == n.流程 }).Row_ID;
                return {
                    TchRoutineID: tchRoutineID,
                    TchRoutineTag: '',               
                    TimeMark: n.日期,
                    ClientAcc: n.单位名称,
                    BankName: n.银行名称,
                    EntryAmount: n.汇票金额,
                    DiscountInterest: n.贴现利息,
                    DiscountAmount: n.实付贴现金额,
                    DiscountRate: n.贴现率,
                    AcceptBank: n.承兑银行,
                    VoucherNo: n.汇票号,
                    VoucherType: n.汇票种类,
                    DraftDate: n.出票日,
                    DueDate: n.到期日
                }
            }))
            
            
        }).then(() => {
            callback(null);
        })
    }
}