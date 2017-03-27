sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"sap/ui/model/Filter"
], function(BaseController, JSONModel, PWA, Filter) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.controller.PWAObjectPage", {
 
    	onInit: function() {
    		
			var oViewModel = new JSONModel({
				"busy": false,
				"delay": 0,
				"readOnly": false,
				"UI": {
					"dealerNumber":"",
					"dealerDescription":""
				}
			});
			this.setModel(oViewModel, "ViewHelper");
    		
			this.getRouter().getRoute("PWAMain").attachPatternMatched(this._onPWAMainMatched, this);
    	},
      
      	companyCodeSelected:function(event){
			this._filterPWAType(event.getParameter("selectedItem").getBindingContext("SalesAreas").getObject().SalesOrg);
		},
		
		onPWATypeCancel: function(){
			this.navigateToLaunchpad();
			this._PWATypeSelection.close();
		},
		
		onPWATypeListSelect: function(oEvent){
			
/*			var claimType = oEvent.getParameter("listItem").getBindingContext().getObject().Code;
			var claimTypeDescription = oEvent.getParameter("listItem").getBindingContext().getObject().Description;
			var claimTypeGroup = oEvent.getParameter("listItem").getBindingContext().getObject().Group;
			
			this.getModel("WarrantyClaim").setProperty("/ClaimType",claimType);
			this.getModel("WarrantyClaim").setProperty("/ClaimTypeDescription", claimTypeDescription);
			this.getModel("WarrantyClaim").setProperty("/ClaimTypeGroup", claimTypeGroup);*/
			
			this.getModel("ViewHelper").setProperty("/busy", false);
			this._PWATypeSelection.close();
		},		
      
		_onPWAMainMatched: function(oEvent) {
			
			this.getModel().metadataLoaded().then(function() {
				// check that the user has an active Dealership assigned if not we don't allow them to continue
				this.getOwnerComponent().getModel().read(
					"/DealershipSet?$filter=active eq true", {
						success: function(oData) {
							if (!oData.results.length) {
								this._showNoDealershipDialog();
							} else {
								this.getModel("ViewHelper").setProperty("/UI/dealerNumber", oData.results[0].dealer);
								var dealerDescription = oData.results[0].dealerName + ", " + oData.results[0].description;
								this.getModel("ViewHelper").setProperty("/UI/dealerDescription", dealerDescription);
								this._openPWAMaintenance();
							}
						}.bind(this),
						error: function() {
							this._showNoDealershipDialog();
						}.bind(this)
					}
				);
			}.bind(this));
		},      
    	_openPWAMaintenance: function(){
			//See if PWA Number is passed in the Startup Parameters
			var PWANumber = "";
			if (this.getOwnerComponent().getComponentData() &&
				this.getOwnerComponent().getComponentData().startupParameters.PWA &&
				this.getOwnerComponent().getComponentData().startupParameters.PWA[0]) {
				
				PWANumber = this.getOwnerComponent().getComponentData().startupParameters.PWA[0];
			}
			
			//Testing
			//PWANumber = '100000000651';
				
			if (PWANumber){
				var entityPath = "/PriorWorkApprovalSet('" + PWANumber + "')";
				this._bindView(entityPath);
			}else{
				this._openPWATypeSelectDialog( );
			}
    	},
    	
		_bindView: function(entityPath) {
			this.getView().bindElement({
				path: entityPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						this.getModel("ViewHelper").setProperty("/busy", true);
					},
					dataReceived: function() {
						this.getModel("ViewHelper").setProperty("/busy", false);
					}
				}
			});
		},
		
		_onBindingChange: function(oData) {
			//Check if there is any data first
			PWA.updatePWAFromOdata(oData);
		},
		
		_openPWATypeSelectDialog: function(){
			
			//Need to determine the Sales Organisations being used and filter PWA Types List
			this.getModel().read(
				"/DealerSalesAreaSet", {
					success: function(oData) {
						if (oData.results.length) {
							if (! this._PWATypeSelection) {
								this._PWATypeSelection = sap.ui.xmlfragment("hnd.dpe.warranty.prior_work_approval.fragment.PWATypeSelection", this);
								this.setModel(new JSONModel(this._buildSalesOrgList(oData)),"SalesAreas");
								this.getView().addDependent(this._PWATypeSelection);
							}
							this._PWATypeSelection.open();
							this._filterPWAType(this.getModel("PWA").getProperty("/SalesOrganisation"));
						}
					}.bind(this)
				}
			);
		},
		
		_buildSalesOrgList: function(oSalesAreas){
			var distinctCompanyCodes = [];
			var salesOrganisations = [];
			
			for (var i = 0; i < oSalesAreas.results.length; i++) {
				var salesArea = oSalesAreas.results[i];
				if (distinctCompanyCodes.indexOf(salesArea.CompCode) === -1){
					salesOrganisations.push({
						"CompanyCode": salesArea.CompCode,
						"CompanyCodeName": salesArea.CompCodeDescr,
						"SalesOrg": salesArea.SalesOrg
					});
					distinctCompanyCodes.push(salesArea.CompCode);
				}
			}
			// Set the default as the first entry in the list
			this.getModel("PWA").setProperty("/CompanyCode",salesOrganisations[0].CompanyCode);
			this.getModel("PWA").setProperty("/SalesOrganisation",salesOrganisations[0].SalesOrg);
			return salesOrganisations;
		},
		
		_filterPWAType: function(salesOrganisation){

			var filters = [];

			filters.push(new Filter(
				"SalesOrg",
				sap.ui.model.FilterOperator.EQ, 
				salesOrganisation
			));
			
			sap.ui.getCore().byId("PWATypeList").getBinding("items").filter(filters);	
		}
	});
});