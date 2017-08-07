sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/Filter",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"sap/ui/model/json/JSONModel"
], function(BaseController, Filter, PWA, JSONModel) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlockController", {
		
		onInit: function(){
			
			this.setModel(
				new JSONModel({"Description": ""}),
				"SerialUIHelper"
			);
			
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages.bind(this),this);
		},
		
		onExternalObjectNumberSuggest:function(event){
			
			event.getSource().getBinding("suggestionRows").filter(this._applyExternalObjectNumberFilter(event.getParameter("suggestValue")));
		}, 
		
		onExternalObjectNumberChanged: function(event){
			
			this.getView().getModel("PWA").setProperty("/ExternalObjectNumber/value",
				this.getView().getModel("PWA").getProperty("/ExternalObjectNumber/value").toUpperCase()
			);
			
			PWA.validateExternalObjectNumber();
			this.logValidationMessage("ExternalObjectNumber");
		},
		
		onExternalObjectNumberVELOSelected: function(event){

			var dataObject = event.getParameter("selectedRow").getBindingContext().getObject();
			this.getView().getModel("PWA").setProperty("/ExternalObjectDescription",dataObject.Description);
		},
		
		onExternalObjectNumberSERNSelected: function(event){
			
			var dataObject = event.getParameter("selectedRow").getBindingContext().getObject();
			this.getView().getModel("PWA").setProperty("/ExternalObjectDescription",dataObject.Equipment_Text);
			this.getView().getModel("PWA").setProperty("/ExternalObjectModelCode",dataObject.ModelCode);
		},
		
		_applyExternalObjectNumberFilter: function(filterString){
			
			var filters = [];
			if (filterString) {
						
				var filterName = this.getView().getModel("PWA").getProperty("/ObjectType") === "VELO" ? "VIN" : "SerialNumber";
				filters.push(new Filter(filterName, sap.ui.model.FilterOperator.StartsWith, filterString));
			}
			return filters;
		},
		
		onDateOfFailureChanged: function(){
			PWA.validateDateOfFailure();
			this.logValidationMessage("DateOfFailure");
		},
		
		//MCPN
		onMCPNChanged: function(){
			PWA.validateMCPN();
			this.logValidationMessage("MCPN");
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