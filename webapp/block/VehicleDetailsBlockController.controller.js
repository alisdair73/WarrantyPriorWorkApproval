sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/ui/model/Filter"
], function(Controller,  Filter) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlockController", {
		
		//VIN Search
		onVINSuggest:function(event){
			var searchString = event.getParameter("suggestValue");
			var filters = [];
			if (searchString) {
				filters.push(new Filter("VIN", sap.ui.model.FilterOperator.StartsWith, searchString));
			}
			event.getSource().getBinding("suggestionRows").filter(filters);
		}, 
		
		onVINChanged: function(event){
			var searchString = event.getParameter("suggestValue");
			var filters = [];
			if (searchString) {
				filters.push(new Filter("VIN", sap.ui.model.FilterOperator.StartsWith, searchString));
			}
			event.getSource().getBinding("suggestionRows").filter(filters);	
		},
		
		//MCPN
		onMCPNChanged: function(){
			
		},
		
		onMCPNSuggest: function(event){
			
			var searchString = event.getParameter("suggestValue");
			var filters = [];
			if (searchString) {
				filters.push(new Filter([
					new Filter("materialNo", sap.ui.model.FilterOperator.StartsWith, searchString),
					new Filter("description", sap.ui.model.FilterOperator.Contains, searchString)
				], false));
			}
			event.getSource().getBinding("suggestionRows").filter(filters);
		},
		
		onMCPNSelected: function(event){
			
			var dataObject = null;
			if (event.getId() === "suggestionItemSelected"){
				dataObject = event.getParameter("selectedRow").getBindingContext().getObject();
			} else {
				dataObject = event.getParameter("selectedItem").getBindingContext().getObject();
			}
			
			//Update Here
			this.getView().getModel("PWA").setProperty("/MCPN",dataObject.materialNo);
            this.getView().getModel("PWA").setProperty("/MCPNDescription",dataObject.description);
		},	
		
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
			
			var searchString = event.getParameter("value");
			var filters = [];
			filters.push(new Filter([
				new Filter("materialNo", sap.ui.model.FilterOperator.StartsWith, searchString),
				new Filter("description", sap.ui.model.FilterOperator.Contains, searchString)
			], false));
			event.getSource().getBinding("items").filter(filters);
		}
	});
});