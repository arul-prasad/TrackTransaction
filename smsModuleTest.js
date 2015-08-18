var testSms = (function(smsModule) {
  
  var tests = [];
  
  var testCreditCardExpParser = function() {
      var crCardTranSmsSpec = {
      bank : "ICICI",
      type : "CREDIT",
      msgTemplates : ["Tranx of","using Credit Card", "is made at", "on", "Avbl Cr lmt:", "Total Cr lmt:"],
      attributtes : ["amount", "account","merchant", "date","availCrLimit","totalCrLimit"],
      charsToRemove : ["","","",".",",","."]
    }
    
    var tranCCSms = { msg : "Tranx of INR 943.00 using Credit Card 4xxx1005 is made at HOTEL SARAVANA on 11-JUL-15. Avbl Cr lmt:INR 1,51,002.97, Total Cr lmt: INR XXXXX."};
    var tranCCData = smsModule.parseSmsToTranData(crCardTranSmsSpec,tranCCSms);
    
    console.log("tranCCSms:", tranCCSms.msg);
    console.log("tranCCData:", tranCCData);

  };
  
  tests.push(testCreditCardExpParser);
  
  var testDrCardTranSmsParser = function () {
  
    var drCardTranSmsSpec = {
      bank : "ICICI",
      type : "DEBIT",
      msgTemplates : ["Dear Customer, You have made a Debit Card purchase of","on", "Info.", "Your Net Available Balance is"],
      attributtes : ["amount", "date","merchant", "netAvailable"],
      charsToRemove : ["",".","",""]
    }
  
    var tranDrSms = { msg : "Dear Customer, You have made a Debit Card purchase of INR350.00 on 06 Jul. Info.VIN*ACCELYST SO. Your Net Available Balance is INRxxxxx."};
    var tranDrData = smsModule.parseSmsToTranData(drCardTranSmsSpec,tranDrSms);
    
    console.log("tranDrSms:", tranDrSms.msg);
    console.log("tranDrData:", tranDrData);

  };
  tests.push(testDrCardTranSmsParser);
  
  
  var testEcsSmsParser = function() {
    var drEcsTranSmsSpec = {
      bank : "ICICI",
      type : "DEBIT",
      tranType : "ECS",
      msgTemplates : ["Dear Customer, Your Ac","is debited with", "on", "Info.ECS*","Your Total Avbl. Bal is"],
      attributtes : ["account", "amount","date", "merchant", "totalAvailable"],
      charsToRemove : ["","",".",".","."]
    }
    
    var tranEcsSms = { msg : "Dear Customer, Your Ac XXXXXXXX0137 is debited with INR 63,500.00  on 06 Jul. Info.ECS*SBI,RACPC,CHENN*21471006. Your Total Avbl. Bal is INRXXXXXXXX."}
    var tranEcsData = smsModule.parseSmsToTranData(drEcsTranSmsSpec,tranEcsSms);
    
    console.log("tranEcsSms:", tranEcsSms.msg);
    console.log("tranEcsData:", tranEcsData);
  }
  tests.push(testEcsSmsParser);
  return {
      run : function() {
        for(i in tests) {
          tests[i]();
        }
      }
  };
}(smsModule || {}));
testSms.run();