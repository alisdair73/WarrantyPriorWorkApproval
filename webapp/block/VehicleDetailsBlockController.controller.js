sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/Filter",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/NumberFormat"
], function(BaseController, Filter, PWA, JSONModel, NumberFormat) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlockController", {
		
		onInit: function(){
			
			this._kmFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 0,
				groupingEnabled: false
			});
			
			this.setModel(
				new JSONModel({"Description": ""}),
				"SerialUIHelper"
			);
			
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages,this);
			
		 //   this.getView().byId("failureKM").attachBrowserEvent("mousewheel", function(event) {
			// 	event.preventDefault();
			// });
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
		
		onEngineNumberChanged: function(){
			PWA.validateEngineNumber();
			this.logValidationMessage("EngineNumber");
		},
		
		onFailureKmHrsChanged: function(){
			this.getView().getModel("PWA").setProperty("/FailureMeasure/value",
				this._kmFormatter.format(this.getView().getModel("PWA").getProperty("/FailureMeasure/value"))
			);
			
			PWA.validateFailureKmHrs();
			this.logValidationMessage("FailureMeasure");
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
					this.getView().getModel("PWA").getProperty("/SalesOrg")));
			} else {
				filters.push( new Filter("salesOrg",sap.ui.model.FilterOperator.EQ, 
						this.getView().getModel("PWA").getProperty("/SalesOrg")));
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
				this.getView().getModel("PWA").getProperty("/SalesOrg")));

			this._MCPNDialog.getBinding("items").filter(filters);

			// Display the popup
			this._MCPNDialog.open();
		},
		
		onValueHelpSearch: function(event) {
			
			event.getSource().getBinding("items").filter(this._partSearchFilter(event.getParameter("value")));
		},
		
		onCheckLON: function(){
			
			// Create the dialog if it isn't already
			if (!this._CheckLONDialog) {
				this._CheckLONDialog = sap.ui.xmlfragment(
					this.getView().getId(), "hnd.dpe.warranty.prior_work_approval.fragment.CheckLONDialog", this
				);
				this.getView().addDependent(this._CheckLONDialog);
			}

			var filters = [];
			filters.push(new Filter("VIN",sap.ui.model.FilterOperator.EQ, 
				this.getView().getModel("PWA").getProperty("/ExternalObjectNumber/value"))
			);
			
			filters.push(new Filter("MCPN",sap.ui.model.FilterOperator.EQ, 
				this.getView().getModel("PWA").getProperty("/MCPN/value"))
			);

			this.getView().byId("LONCodes").getBinding("items").filter(filters);

			// Display the popup
			this._CheckLONDialog.open();
		},
		
		onCloseCheckLON: function(){
			this._CheckLONDialog.close();
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("ExternalObjectNumber");
			this.logValidationMessage("EngineNumber");
			this.logValidationMessage("DateOfFailure");
			this.logValidationMessage("FailureMeasure");
			this.logValidationMessage("MCPN");
		}
	});
});