var smsModule = (function(smsModule) {
  
  var getFoundMsgIndexes = function(tranSmsSpec,tranSms) {
    var mapIndexOfMsg = function(msgTemplate) {
       return tranSms.msg.indexOf(msgTemplate);
    };
    var foundMsgIndexes = _.map(tranSmsSpec.msgTemplates,mapIndexOfMsg);
    foundMsgIndexes.push(tranSms.msg.length);
    return foundMsgIndexes;
  };
  
  var isTemplateMatched = function(foundMsgIndexes) {
    return _.every(foundMsgIndexes, function(msgIndex) { return msgIndex != -1});
  }  
  
  var extractTranDatas = function(tranSmsSpec,tranSms,foundMsgIndexes) {
    var mapExtractData = function(foundMsgIndex, index) {
      if(index < (foundMsgIndexes.length-1)){
        var extractStartIdx = foundMsgIndex + tranSmsSpec.msgTemplates[index].length;
        var extractEndIdx = foundMsgIndexes[index+1];
        var extractData = tranSms.msg.substring(extractStartIdx,extractEndIdx);
        if(extractData) {
         if( tranSmsSpec.charsToRemove[index] 
              && extractData.lastIndexOf(tranSmsSpec.charsToRemove[index]) != -1) {
            return extractData.substring(0,extractData.lastIndexOf(tranSmsSpec.charsToRemove[index])).trim(); 
          }
          else {
            return extractData.trim();
          }
        } 
      }
    };
    return _.first(_.map(foundMsgIndexes, mapExtractData),tranSmsSpec.msgTemplates.length);      
  };
  
  var toTranData = function(tranSmsSpec,tranSms,extractDatas) {
    var reduceToTranData = function(tranData,extractData, index) {
     if(extractData && tranSmsSpec.attributtes[index]) {
        tranData[tranSmsSpec.attributtes[index]] = extractData;
     }
     return tranData; 
    };
    var tranData = _.reduce(extractDatas,reduceToTranData,{});
    tranData.accType = tranSmsSpec.type;
    return tranData
  }
  
  smsModule.parseSmsToTranData = function(tranSmsSpec,tranSms) {
    var foundMsgIndexes = getFoundMsgIndexes(tranSmsSpec,tranSms);
    if(isTemplateMatched(foundMsgIndexes)) {
      var extractDatas = extractTranDatas(tranSmsSpec,tranSms,foundMsgIndexes);
      return toTranData(tranSmsSpec,tranSms,extractDatas);
    } else {
      console.log("template doesn't match the sms for the given msg:", tranSmsSpec);
    }
  };
  
  return smsModule;
  
}(smsModule || {})); 