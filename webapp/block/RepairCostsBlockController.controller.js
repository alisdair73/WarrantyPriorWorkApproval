sap.ui.define([
  "hnd/dpe/warranty/prior_work_approval/controller/BaseController",
  "hnd/dpe/warranty/prior_work_approval/model/PWA",
  "sap/ui/core/format/NumberFormat"
], function(BaseController, PWA, NumberFormat) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlockController", {
		
		onInit: function() {
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages,this);
			
			this._hoursFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 1,
				groupingEnabled: false,
            	decimalSeparator: '.'
			});
			
			this._costFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
				minFractionDigits: 2,
				maxFractionDigits: 2,
				groupingEnabled: false,
            	decimalSeparator: '.'
			});
    	},
    	
   		onExit: function() {
			sap.ui.getCore().getEventBus().unsubscribe("Validation","Refresh",this._refreshValidationMessages,this);
    	},
		
		onRequestedLabourHoursChanged: function(){

			this.getView().getModel("PWA").setProperty("/RequestedLabourHours/value",
				this._hoursFormatter.format(this.getView().getModel("PWA").getProperty("/RequestedLabourHours/value"))
			);
			
			PWA.validateRequestedLabourHours();
			this.logValidationMessage("RequestedLabourHours");
		},
		
		partsChanged: function(event) {
			
			this._sanitisePercentageInputs("/RequestedPartsSplitOwner",event);
			this._sanitisePercentageInputs("/RequestedPartsSplitDealer",event);

			this.getView().getModel("PWA").setProperty("/RequestedPartsSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitDealer") 
				)
			);
    	},
		
		subletChanged: function(event) {
			
			this._sanitisePercentageInputs("/RequestedSubletSplitOwner",event);
			this._sanitisePercentageInputs("/RequestedSubletSplitDealer",event);
			
			this.getView().getModel("PWA").setProperty("/RequestedSubletSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitDealer") 
				)
			);			
    	},
		
		labourChanged: function(event) {
			
			this._sanitisePercentageInputs("/RequestedLabourSplitOwner",event);
			this._sanitisePercentageInputs("/RequestedLabourSplitDealer",event);
			
			this.getView().getModel("PWA").setProperty("/RequestedLabourSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedLabourSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedLabourSplitDealer") 
				)
			);
    	},
		
		calculateTotalCost: function(){
			
			this.getView().getModel("PWA").setProperty("/RequestedPartsCost",
				this._costFormatter.format(this.getView().getModel("PWA").getProperty("/RequestedPartsCost"))
			);
			
			this.getView().getModel("PWA").setProperty("/RequestedSubletCost",
				this._costFormatter.format(this.getView().getModel("PWA").getProperty("/RequestedSubletCost"))
			);
			
			var requestedTotal = 
				this.getView().getModel("PWA").getProperty("/RequestedLabourCost") +
				this.getView().getModel("PWA").getProperty("/RequestedPartsCost") +
				this.getView().getModel("PWA").getProperty("/RequestedSubletCost");
			
			this.getView().getModel("PWA").setProperty("/RequestedTotalCost/value", requestedTotal);
			
			PWA.validateTotalCostIsGreaterThanZero();
			this.logValidationMessage("RequestedTotalCost");
			
			var approvedTotal = 
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedLabourCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedPartsCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedSubletCost"), 2);
			
			this.getView().getModel("ViewHelper").setProperty("/UI/approvedTotal", approvedTotal);
		},
		
		_sanitisePercentageInputs: function(fieldName,event){
		
			//If a non-numeric is entered this will be blank - default to zero
			var valueSource = "/" + event.getSource().getBindingPath("value");
			if(valueSource === fieldName && event.getSource().getValue() === "" ){
				this.getView().getModel("PWA").setProperty(fieldName,0);
			}
			
			//Convert to Integer
			this.getView().getModel("PWA").setProperty(fieldName, Math.round(this.getView().getModel("PWA").getProperty(fieldName)));
		
			if (this.getView().getModel("PWA").getProperty(fieldName) > 100){
				this.getView().getModel("PWA").setProperty(fieldName,100);
			}
			
			if (this.getView().getModel("PWA").getProperty(fieldName) < 0){
				this.getView().getModel("PWA").setProperty(fieldName,0);
			}
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("RequestedLabourHours");
			this.logValidationMessage("RequestedTotalCost");
		}		
	});
});