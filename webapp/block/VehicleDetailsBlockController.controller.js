sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/Filter",
	"hnd/dpe/warranty/prior_work_approval/model/PWA"
], function(BaseController,  Filter, PWA) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlockController", {
		
		onInit: function(){
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages.bind(this),this);
		},
		
		//VIN Search
		
		//This needs the SERN/VELO stuff
		
		onExternalObjectNumberSuggest:function(event){
			var searchString = event.getParameter("suggestValue");
			var filters = [];
			if (searchString) {
				filters.push(new Filter("VIN", sap.ui.model.FilterOperator.StartsWith, searchString));
			}
			event.getSource().getBinding("suggestionRows").filter(filters);
		}, 
		
		onExternalObjectNumberChanged: function(event){
			var searchString = event.getParameter("suggestValue");
			var filters = [];
			if (searchString) {
				filters.push(new Filter("VIN", sap.ui.model.FilterOperator.StartsWith, searchString));
			}
			event.getSource().getBinding("suggestionRows").filter(filters);	
			
			PWA.validateExternalObjectNumber();
			this.logValidationMessage("ExternalObjectNumber");
		},
		
		onDateOfFailureChanged: function(){
			PWA.validateDateOfFailure();
			this.logValidationMessage("DateOfFailure");
		},
		
		//MCPN
		onMCPNChanged: function(){
			PWA.validateMCPN();
			this.logValidationMessage("PWA");
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
			this.getView().getModel("PWA").setProperty("/MCPN/value",dataObject.materialNo);
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
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("ExternalObjectNumber");
			this.logValidationMessage("DateOfFailure");
			this.logValidationMessage("MCPN");
		}
	});
});