create PROCEDURE DelTestRoutine(IN ids varchar(1000))
begin

SET @sqlstr = CONCAT('Delete From BankDraft where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From CashJournal where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From CollectAccept where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From CustomerLedger where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From DetailedLedger where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From EntrustBankPayment where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From EntrustCorpPayment where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From OuterSubject where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From GeneralLedger where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From IndividualSaving where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From MoneyRemittance where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From SubjectItem where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From TransferCheck where TchRoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From TeachingNode where RoutineID in (Select Row_ID From TeachingRoutine Where TmpRoutineID in ', ids, ')');
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From TeachingRoutine where TmpRoutineID in ', ids);
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From TemplateNode where RoutineID in ', ids);
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

SET @sqlstr = CONCAT('Delete From TemplateRoutine where Row_ID in ', ids);
PREPARE stmt FROM @sqlstr;
EXECUTE stmt; 

end;