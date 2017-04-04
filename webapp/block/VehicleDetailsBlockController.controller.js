sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/ui/model/Filter"
], function(Controller,  Filter) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlockController", {
		
		onSelectMCPN: function(){
			
			// Create the dialog if it isn't already
			if (!this._MCPNDialog) {
				this._MCPNDialog = sap.ui.xmlfragment("hnd.dpe.warranty.prior_work_approval.fragment.MCPNHelpDialog", this);
				this.getView().addDependent(this._MCPNDialog);
			}

			// Display the popup
			this._MCPNDialog.open();
		},
		
		onValueHelpSearch: function(event) {
			
			var searchValue = event.getParameter("value");
			var filters = [];
			filters.push(new Filter(
				"PartNumber",
				sap.ui.model.FilterOperator.Contains, searchValue
			));
			filters.push(new Filter(
				"Description",
				sap.ui.model.FilterOperator.Contains, searchValue
			));
			event.getSource().getBinding("items").filter(filters);
		},
		
		onMCPNSelected: function(event){

			this.getView().getModel("PWA").setProperty("/MCPN",event.getParameter("selectedContexts")[0].getObject().PartNumber);
            this.getView().getModel("PWA").setProperty("/MCPNDescription",event.getParameter("selectedContexts")[0].getObject().Description);

		}
		
		
	});
});