var smsReader = (function(smsReader) {

  var getSmsSpecs = function() {
    var smsSpecs = [];
    
    var crCardTranSmsSpec = {
        bank : "ICICI",
        type : "CREDIT",
        trackType : "expense",
        msgTemplates : ["Tranx of","using Credit Card", "is made at", "on", "Avbl Cr lmt:", "Total Cr lmt:"],
        attributtes : ["amount", "account","merchant", "date","availCrLimit","totalCrLimit"],
        attrTypes : [ "INR" ,"cardnumber","alphanumeric","DATE","INR",""],
        charsToRemove : ["","","",".",",","."]
    };
    
    var drEcsTranSmsSpec = {
        bank : "ICICI",
        type : "DEBIT-ECS",
        trackType : "expense",
        msgTemplates : ["Dear Customer, Your Ac","is debited with", "on", "Info.ECS*","Your Total Avbl. Bal is"],
        attributtes : ["account", "amount","date", "merchant", "totalAvailable"],
        attrTypes : [ "alphanumeric", "INR", "DDMM","alphanumeric","INR"],
        charsToRemove : ["","",".",".","."]
    };
      
    var drBillTranSmsSpec = {
        bank : "ICICI",
        type : "DEBIT-BILL",
        trackType : "expense",
        msgTemplates : ["Dear Customer, Your Ac","is debited with", "on", "Info.BIL*","Your Total Avbl. Bal is"],
        attributtes : ["account", "amount","date", "merchant", "totalAvailable"],
        attrTypes : [ "alphanumeric", "INR", "DDMM","alphanumeric","INR"],
        charsToRemove : ["","",".",".","."]
    };
    
    var drCardTranSmsSpec = {
        bank : "ICICI",
        type : "DEBIT",
        trackType : "expense",
        msgTemplates : ["Dear Customer, You have made a Debit Card purchase of","on", "Info.", "Your Net Available Balance is"],
        attributtes : ["amount", "date","merchant", "netAvailable"],
        attrTypes : [ "INR" ,"DDMON","alphanumeric","INR"],
        charsToRemove : ["",".","",""]
    };

    var drCardAtmWithdrawSpec = {
        bank : "ICICI",
        type : "DEBIT-CASH",
        trackType : "expense",
        msgTemplates : ["Your Ac", "is debited with","NFS*CASH WDL*", "Avbl Bal", "To bank on phone with iMobile, click mobile.icicibank.com/dl"],
        attributtes : ["account", "amount","date", "netAvailable", "others"],
        attrTypes : [ "alphanumeric" ,"INR","DDMMYY","INR", "alphanumeric"],
        charsToRemove : ["",".",".",""]
    };
      


    var ccCardBillRemainder = {
        bank : "ICICI",
        type : "DUE-CREDIT-BILL",
        trackType : "remainder",
        msgTemplates : ["Dear Customer, Total payment of", "on Credit Card A/c", "is due.Pls pay min amt of", "by","to avoid charges. Please ignore if paid."],
        attributtes : ["osAmount", "account","minAmount", "dueDate", "others"],
        attrTypes : [ "INR" ,"alphanumeric","INR","DDMMYY", "alphanumeric"],
        charsToRemove : ["","","","",""]
    };    
      
    smsSpecs.push(crCardTranSmsSpec);
    smsSpecs.push(drEcsTranSmsSpec);
    smsSpecs.push(drBillTranSmsSpec);
    smsSpecs.push(drCardTranSmsSpec);
    smsSpecs.push(drCardAtmWithdrawSpec);
    smsSpecs.push(ccCardBillRemainder);
    return smsSpecs;   
  };
    
  var getAllowedSenderCodes = function(){
  return [ { code: "ICICIB", name: "Icici Bank", bank: "ICICI"},
           { code: "HDFCBK", name: "HDFC Bank", bank: "HDFC" }];
  };
  
  var smsSpecsBySenderCode = _.groupBy(getSmsSpecs(), function(smsSpec) { return smsSpec.bank} );
  var expSender = /([A-Z]){2}-[A-Z]{6}/;
  var allowedSendersByCode = _.indexBy(getAllowedSenderCodes(),function(sender) {return sender.code});
  
  smsReader.getSenderToTrack = function(tranSms) {
    var sender = tranSms.sender;
    return (sender && sender.length==9 
                   && expSender.test(sender) 
                   && (allowedSendersByCode[sender.substr(3)] ));
  };
  
  smsReader.getTranSmsSpecs = function(tranSms) {
      var senderTracked = this.getSenderToTrack(tranSms);
      if(senderTracked) {
          var matchedTranSmsSpecs = smsSpecsBySenderCode[senderTracked.bank];
          if(matchedTranSmsSpecs && matchedTranSmsSpecs.length > 0 ){
             return matchedTranSmsSpecs; 
          } else {
             throw "no match sms specs found for sender " + tranSms.sender + " kindly check the configuration of sms specs for the sender" + senderTracked;
          }
      } else  {
        throw "sms Sender: " + tranSms.sender + " cannot be tracked";
      }    
  };

  return smsReader;
  
}(smsReader || {})); 