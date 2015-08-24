var smsReader = (function (smsReader) {

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
    

      
  var convertTranData = function(extractData,index) {
    if(extractData && tranSmsSpec.attrTypes && tranSmsSpec.attrTypes[index]) {
        var attrConverter = smsReader.getConverter(tranSmsSpec.attrTypes[index]);
        if(attrConverter) {
           return attrConverter(extractData);
        } else {
           return extractData;
        }
    } else {
        return extractData;
    }
  };
      
  var reduceToTranData = function(tranData,extractData, index) {
     if(extractData && tranSmsSpec.attributtes[index]) {
        tranData[tranSmsSpec.attributtes[index]] = extractData;
        tranData.type = tranSmsSpec.type;
        tranData.trackType = tranSmsSpec.trackType;
     }
     return tranData; 
  };
      
  var extractDatasConverted = _.map(extractDatas,convertTranData);
      
    
  var tranData = _.reduce(extractDatasConverted,reduceToTranData,{});
      
  tranData.accType = tranSmsSpec.type;
  return tranData
  
  };
  
  
  
  smsReader.getMatchedTranSmsSpec = function(tranSms){
      var tranSmsSpecs = _.map(this.getTranSmsSpecs(tranSms), function(tranSmsSpec) {
            return _.extend({foundMsgIndexes: [] },tranSmsSpec);
      });
      
      var matchedSmsSpec  = _.find(tranSmsSpecs, function(tranSmsSpec) {
        var foundMsgIndexes = getFoundMsgIndexes(tranSmsSpec,tranSms);
        tranSmsSpec.foundMsgIndexes = foundMsgIndexes;
        return isTemplateMatched(foundMsgIndexes);
      });
      return matchedSmsSpec;
  };
  
  smsReader.toTranData = function(matchedTranSmsSpec,tranSms) {
    if(matchedTranSmsSpec) {
      var extractDatas = extractTranDatas(matchedTranSmsSpec,tranSms,matchedTranSmsSpec.foundMsgIndexes);
      return toTranData(matchedTranSmsSpec,tranSms,extractDatas);
    } else {
      throw "spec doesn't match the sms for the given msg: check the available config sms spec:" + tranSms;
    }
  };                                                    
  
  smsReader.parse = function(tranSms,onSuccess,onError){
    try{
        var tranData = this.toTranData(this.getMatchedTranSmsSpec(tranSms),tranSms);
        onSuccess(tranData);
    } catch (e) {
        console.error(e);
        onError(e);
    }
  }; 
  
  return smsReader;

}(smsReader || {})); 