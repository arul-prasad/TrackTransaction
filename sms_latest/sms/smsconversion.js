var smsReader = (function(smsReader) {
 
dateutil._parsers['dd-mm-yy'] = {
  test: /^(3[01]|[12][0-9]|0?[1-9])-(1[0-2]|0?[1-9])-(?:[0-9]{2})?[0-9]{2}$/,
  parse: function ( str ) {
    var bits = str.split('-');
    return new Date( bits[2], bits[1] -1,bits[0]);
  }
};
    
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
    
 var toDateWithOutYear = function(ddmon) {
     var dateConv = toDate(ddmon);
     if(dateConv && typeof dateConv != 'string'){
         dateConv.year = new Date().getFullYear();
         dateConv.value.setFullYear(dateConv.year);
         dateConv.value = dateConv.value;
         return dateConv;
     } else {
         return ddmon;
     }
     
 };
    
 
 var toDate = function(dateValue) {
     var date = dateutil.parse(dateValue);
     if(date && date.toString() !== "Invalid Date") {
         //TODO - bring a util method to seggeregate the parts of the date - Arul
         return { value : date , date: date.getDate(), month : date.getMonth() + 1, year : date.getFullYear(), hour : date.getHours(), min : date.getMinutes(), sec : date.getSeconds(), ms : date.getMilliseconds() };
     } else {
         return dateValue;
     }
 };
    
 var converters = {
     INR : function(currencyData) {
        return toInrCurrency("INR",currencyData); 
     },
     
     DATE :  toDate,
     
     DDMM : toDateWithOutYear,
     
     DDMMYY : toDateWithOutYear
 };
    
 smsReader.getConverter = function(attrType) {
     return converters[attrType];
 };
    
    
 return smsReader;
 
})(smsReader || {}); 