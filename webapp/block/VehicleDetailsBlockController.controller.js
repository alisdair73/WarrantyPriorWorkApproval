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
			
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages,this);
		},
		
		onExit: function(){
			sap.ui.getCore().getEventBus().unsubscribe("Validation","Refresh",this._refreshValidationMessages,this);
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
			event.getSource().getBinding("suggestionRows").filter(this._partSearchFilter(event.getParameter("suggestValue")));
		},
		
		_partSearchFilter: function(searchString){
			
			var filters = [];
			if (searchString) {
				var partsFilterString = searchString.replace(/[^a-zA-Z0-9]/g, "");
				filters.push(new Filter([
					new Filter("materialNo", sap.ui.model.FilterOperator.StartsWith, partsFilterString),
					new Filter("description", sap.ui.model.FilterOperator.Contains, searchString)
				], false));
				filters.push( new Filter("salesOrg",sap.ui.model.FilterOperator.EQ, 
					this.getView().getModel("PWA").getProperty("/SalesOrganisation")));
			} else {
				filters.push( new Filter("salesOrg",sap.ui.model.FilterOperator.EQ, 
						this.getView().getModel("PWA").getProperty("/SalesOrganisation")));
			}
			return filters;
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

			var filters = [];
			filters.push(new Filter("salesOrg",sap.ui.model.FilterOperator.EQ, 
				this.getView().getModel("PWA").getProperty("/SalesOrganisation")));

			this._MCPNDialog.getBinding("items").filter(filters);

			// Display the popup
			this._MCPNDialog.open();
		},
		
		onValueHelpSearch: function(event) {
			
			event.getSource().getBinding("items").filter(this._partSearchFilter(event.getParameter("value")));
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("ExternalObjectNumber");
			this.logValidationMessage("DateOfFailure");
			this.logValidationMessage("MCPN");
		}
	});
});