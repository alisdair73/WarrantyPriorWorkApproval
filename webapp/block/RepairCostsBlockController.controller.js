sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter"
], function(Controller, MessageToast, Filter, UploadCollectionParameter) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlockController", {
		
		calculateTotalCost: function(){
			
			this.getView().getModel("ViewHelper").setProperty("/UI/requestedTotal",
				this.getView().getModel("PWA").getProperty("/RequestedLabourCost") +
				this.getView().getModel("PWA").getProperty("/RequestedPartsCost") +
				this.getView().getModel("PWA").getProperty("/RequestedSubletCost")
			);
		}
	});

});