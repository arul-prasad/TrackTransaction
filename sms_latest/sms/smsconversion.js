var smsReader = (function(smsReader) {
 
 var replaceAll = function(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
 };
 
 var numExp = /^[0-9]+$/;
 var toInrCurrency = function(currency, currencyData) {
  if(currencyData && currencyData.indexOf(currency) != -1) {
      var currencyParts =  currencyData.split(currency);
      if(currencyParts.length == 2) {
         var amountStr = replaceAll(",","",currencyParts[1].trim());
         var amountAsNum = replaceAll("\\.","",amountStr);
         if(numExp.test(amountAsNum)){
            var currencyAmount = parseFloat(amountStr);
            return { currency : currency, value : currencyAmount }
         } else {
            return currencyData;      
         }
       } else {
         return currencyData;
       }  
  } else {
    return currencyData;
  }
 };
    
 var toDate1 = function(dateValue) { return dateValue; }
 
 var toDate = function(dateValue) {
     var date = dateutil.parse(dateValue);
     if(date && date.toString() !== "Invalid Date") {
         return date;
     } else {
         return dateValue;
     }
 };
    
 var converters = {
     INR : function(currencyData) {
        return toInrCurrency("INR",currencyData); 
     },
     
     DATE :  toDate
 };
    
 smsReader.getConverter = function(attrType) {
     return converters[attrType];
 };
    
    
 return smsReader;
 
})(smsReader || {}); 