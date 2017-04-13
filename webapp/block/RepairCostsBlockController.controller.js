sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter",
"sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, Filter, UploadCollectionParameter, JSONModel) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlockController", {
		
		onInit: function() {
    		
			var oViewModel = new JSONModel({
				"PartsSplitHonda": 0,
				"LabourSplitHonda": 0,
				"SubletSplitHonda": 0
			});
			this.getView().setModel(oViewModel, "CostsHelper");
    	},
		
		calculateTotalCost: function(){
			
			this.getView().getModel("ViewHelper").setProperty("/UI/requestedTotal",
				this.getView().getModel("PWA").getProperty("/RequestedLabourCost") +
				this.getView().getModel("PWA").getProperty("/RequestedPartsCost") +
				this.getView().getModel("PWA").getProperty("/RequestedSubletCost")
			);
		}
	});

});