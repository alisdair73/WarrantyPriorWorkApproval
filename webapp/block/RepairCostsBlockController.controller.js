sap.ui.define([
  "hnd/dpe/warranty/prior_work_approval/controller/BaseController",
  "hnd/dpe/warranty/prior_work_approval/model/PWA"
], function(BaseController, PWA) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlockController", {
		
		onInit: function() {
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages.bind(this),this);
    	},
		
		onRequestedLabourHoursChanged: function(){
			PWA.validateRequestedLabourHours();
			this.logValidationMessage("RequestedLabourHours");
		},
		
		partsChanged: function() {
			
			this._sanitisePercentageInputs("/RequestedPartsSplitOwner");
			this._sanitisePercentageInputs("/RequestedPartsSplitDealer");

			this.getView().getModel("PWA").setProperty("/RequestedPartsSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitDealer") 
				)
			);
    	},
		
		subletChanged: function() {
			
			this._sanitisePercentageInputs("/RequestedSubletSplitOwner");
			this._sanitisePercentageInputs("/RequestedSubletSplitDealer");
			
			this.getView().getModel("PWA").setProperty("/RequestedSubletSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitDealer") 
				)
			);			
    	},
		
		labourChanged: function() {
			
			this._sanitisePercentageInputs("/RequestedLabourSplitOwner");
			this._sanitisePercentageInputs("/RequestedLabourSplitDealer");
			
			this.getView().getModel("PWA").setProperty("/RequestedLabourSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedLabourSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedLabourSplitDealer") 
				)
			);
    	},
		
		calculateTotalCost: function(){
			
			var requestedTotal = 
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedLabourCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedPartsCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedSubletCost"), 2);
			
			this.getView().getModel("ViewHelper").setProperty("/UI/requestedTotal", requestedTotal);
			
			var approvedTotal = 
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedLabourCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedPartsCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedSubletCost"), 2);
			
			this.getView().getModel("ViewHelper").setProperty("/UI/approvedTotal", approvedTotal);
			
		},
		
		_sanitisePercentageInputs: function(fieldName){
		
		
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
		}		
	});
});