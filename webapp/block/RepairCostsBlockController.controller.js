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
			
			this.getView().getModel("PWA").setProperty("/RequestedPartsSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedPartsSplitDealer") 
				)
			);
    	},
		
		subletChanged: function() {
			this.getView().getModel("PWA").setProperty("/RequestedSubletSplitHonda",
				100 - ( 
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitOwner") +
					this.getView().getModel("PWA").getProperty("/RequestedSubletSplitDealer") 
				)
			);			
    	},
		
		labourChanged: function() {
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
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("RequestedLabourHours");
		}		
	});
});