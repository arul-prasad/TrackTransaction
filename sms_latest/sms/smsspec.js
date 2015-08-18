var smsReader = (function(smsReader) {

  var getSmsSpecs = function() {
    var smsSpecs = [];
    
    var crCardTranSmsSpec = {
        bank : "ICICI",
        type : "CREDIT",
        msgTemplates : ["Tranx of","using Credit Card", "is made at", "on", "Avbl Cr lmt:", "Total Cr lmt:"],
        attributtes : ["amount", "account","merchant", "date","availCrLimit","totalCrLimit"],
        attrTypes : [ "INR" ,"cardnumber","alphanumeric","DATE","INR",""],
        charsToRemove : ["","","",".",",","."]
    };
    
    var drCardTranSmsSpec = {
        bank : "ICICI",
        type : "DEBIT",
        msgTemplates : ["Dear Customer, You have made a Debit Card purchase of","on", "Info.", "Your Net Available Balance is"],
        attributtes : ["amount", "date","merchant", "netAvailable"],
        charsToRemove : ["",".","",""]
    };
    
    var drEcsTranSmsSpec = {
        bank : "ICICI",
        type : "DEBIT",
        tranType : "ECS",
        msgTemplates : ["Dear Customer, Your Ac","is debited with", "on", "Info.ECS*","Your Total Avbl. Bal is"],
        attributtes : ["account", "amount","date", "merchant", "totalAvailable"],
        charsToRemove : ["","",".",".","."]
    };
      
    smsSpecs.push(crCardTranSmsSpec);
    smsSpecs.push(drCardTranSmsSpec);
    smsSpecs.push(drEcsTranSmsSpec);
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