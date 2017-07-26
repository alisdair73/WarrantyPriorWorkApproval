sap.ui.define([], function() {
	"use strict";

	return {

        validateDateIsNotMoreThan60DaysPrior: function(fieldValue){
        	
        	var validated = true;
        	
        	var now = new Date();   
			var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
			var dateToValidate = new Date(fieldValue.getFullYear(), fieldValue.getMonth(), fieldValue.getDate());
			
			var diffInMS = Math.abs(today.getTime() - dateToValidate.getTime());
			var diffInDays = Math.ceil(diffInMS / (1000 * 3600 * 24));
			
			if(diffInDays > 60){
				validated = false;
			}
			return {"valid": validated, "errorTextID":"notMoreThan60DaysPrior"};
        },

		validateDateIsNotFutureDate: function(fieldValue){
			
			var now = new Date();   
			var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
			var dateToValidate = new Date(fieldValue.getFullYear(), fieldValue.getMonth(), fieldValue.getDate());
			
			var validated = true;

			if(fieldValue){
				
				if(dateToValidate.valueOf() > today.valueOf()){
					validated = false;
				}
			}
			return {"valid": validated, "errorTextID":"noFutureDates"};
		},
		
		validateRequiredFieldIsPopulated: function(fieldValue){
			
			var validated = false;
			
			if (fieldValue){
				if (fieldValue !== ""){
                  validated = true;
				}
			}
			return {"valid": validated, "errorTextID":"mandatoryField"};
		},
		
		validateIsANumber: function(fieldValue){
			return {"valid": !isNaN(fieldValue), "errorTextID":"notANumber"};
		}
	};

});