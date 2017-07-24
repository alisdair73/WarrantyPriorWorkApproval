sap.ui.define([], function() {
	"use strict";

	return {

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
		}
	};

});