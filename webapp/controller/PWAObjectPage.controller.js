sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"sap/ui/model/Filter",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, PWA, Filter, MessageBox) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.controller.PWAObjectPage", {
 
    	onInit: function() {
    		
    		this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
    		
			var oViewModel = new JSONModel({
				"busy": false,
				"delay": 0,
				"readOnly": false,
				"UI": {
					"dealerNumber":"",
					"dealerDescription":"",
//					"requestedTotal": { "value": 0, "ruleResult":{"valid": true, "errorTextID":""}},
					"approvedTotal": 0,
					"hasBeenValidated":false
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
			
			var PWAType = oEvent.getParameter("listItem").getBindingContext().getObject().Code;
			var PWATypeDescription = oEvent.getParameter("listItem").getBindingContext().getObject().Description;
			var PWATypeGroup = oEvent.getParameter("listItem").getBindingContext().getObject().Group;
			var objectType = oEvent.getParameter("listItem").getBindingContext().getObject().ClaimObjectType;
			var statusDescription = oEvent.getParameter("listItem").getBindingContext().getObject().InitialStatusDescription;
			var statusIcon = oEvent.getParameter("listItem").getBindingContext().getObject().InitialStatusIcon;
			
			this.getModel("PWA").setProperty("/PWAType",PWAType);
			this.getModel("PWA").setProperty("/PWATypeDescription", PWATypeDescription);
			this.getModel("PWA").setProperty("/PWATypeGroup", PWATypeGroup);
			this.getModel("PWA").setProperty("/ObjectType", objectType);
			this.getModel("PWA").setProperty("/StatusDescription",statusDescription);
			this.getModel("PWA").setProperty("/StatusIcon",statusIcon);
			
			this.getModel("ViewHelper").setProperty("/busy", false);
			this._PWATypeSelection.close();
		},	
		
		onDraft: function(){
			this._doPWAAction("SavePWA");
		},
		
		onSubmit: function(){
			if(this._canExecuteAction()){
				this._doPWAAction("SubmitPWA");
			}
		},
		
		onValidate: function(){
			if(this._canExecuteAction()){
				this._doPWAAction("ValidatePWA");
			}
		},
		
		onCancel: function(){
			this.navigateToLaunchpad();
		},
		
		openMessages: function(event){
			
			if (!this._messagePopover)  {
				this._messagePopover = sap.ui.xmlfragment( "hnd.dpe.warranty.prior_work_approval.fragment.Messages" );
				this.getView().addDependent(this._messagePopover );
			}
			this._messagePopover.openBy(event.getSource());
		},
		
/*      
			Private Functions 
*/		
		_doPWAAction: function(actionName){
			this.getModel("ViewHelper").setProperty("/busy", true);
			
			this.getView().getModel().create("/PriorWorkApprovalSet",
				PWA.convertToODataForUpdate(), 
				{
					"success": function(responseData,response){
						this._onActionSuccess(actionName, responseData, response);
					}.bind(this),
					"error": this._onActionError.bind(this),
					"headers": { "pwaaction": actionName },
					"async": true
				}
			);
		},

		_onActionSuccess: function(actionName,responseData,response){
			
			var leadingMessage = JSON.parse(response.headers['sap-message']);

			if(actionName === "ValidatePWA"){
				this.getModel("ViewHelper").setProperty("/UI/hasBeenValidated", true);
			}
			
			MessageBox.success(
				leadingMessage.message + "\nPlease observe any additional notes provided.",
				{
					id : "successMessageBox",
					actions : [MessageBox.Action.CLOSE]
				}	
			);
			
			PWA.updatePWAFromJSONModel(responseData);
			this._updateEstimatedTotal();
			sap.ui.getCore().getEventBus().publish("PWA","Saved");
			this.getModel("ViewHelper").setProperty("/busy", false);
		},
		
		_updateEstimatedTotal: function(){
			
			var requestedTotal = 
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedLabourCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedPartsCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/RequestedSubletCost"), 2);
			
			this.getView().getModel("PWA").setProperty("/RequestedTotalCost/value", requestedTotal);
			
			var approvedTotal = 
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedLabourCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedPartsCost"), 2) +
				parseFloat(this.getView().getModel("PWA").getProperty("/ApprovedSubletCost"), 2);
			
			this.getView().getModel("ViewHelper").setProperty("/UI/approvedTotal", approvedTotal);
		},
		
		_onActionError: function(error){
			switch(error.statusCode){
				case "400":
					
					MessageBox.error(
						"An error occurred while processing the Warranty Claim.",
						{
							id : "errorMessageBox",
							actions : [MessageBox.Action.CLOSE]
						}	
					);
					
					//REMOVE THE DUPLICATED LEAD MESSAGE - "SY/530"
					var registeredMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData().filter(
		  				function(registeredMessage){
							return registeredMessage.code === 'SY/530';
						}
					);
		    		
		    		if(registeredMessages.length > 0){
		    			sap.ui.getCore().getMessageManager().removeMessages(registeredMessages[0]);
		    		}  
					//////////////
					break;
					
				case "500":
					//Technical Error
					break;
			}
			this.getModel("ViewHelper").setProperty("/busy", false);
		},

		_onPWAMainMatched: function(oEvent) {
			
			this.getModel().metadataLoaded().then(function() {
				// check that the user has an active Dealership assigned if not we don't allow them to continue
				this.getOwnerComponent().getModel().read(
					"/DealershipSet", {
						context: null,
						filters: [new Filter("active",sap.ui.model.FilterOperator.EQ, true)],
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
				this.getOwnerComponent().getComponentData().startupParameters.PriorWorkApproval &&
				this.getOwnerComponent().getComponentData().startupParameters.PriorWorkApproval[0]) {
				
				PWANumber = this.getOwnerComponent().getComponentData().startupParameters.PriorWorkApproval[0];
			}
			
			//Testing
			//PWANumber = "200000000648";
				
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
				parameters: {
					expand: "Attachments"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						this.getModel("ViewHelper").setProperty("/busy", true);
					}.bind(this),
					dataReceived: function() {
						this.getModel("ViewHelper").setProperty("/busy", false);
					}.bind(this)
				}
			});
		},
		
		_onBindingChange: function(oData) {
			//Check if there is any data first
			PWA.updatePWAFromOdata(oData);
			this._updateEstimatedTotal();
		},
		
		_openPWATypeSelectDialog: function(){
			
			//Need to determine the Sales Organisations being used and filter PWA Types List
			this.getModel().read(
				"/ClaimTypeSet", {
					context: null,
					filters: [new Filter("IsAuthorisationType",sap.ui.model.FilterOperator.EQ, true)],					
					success: function(oData) {
						if (oData.results.length && oData.results.length > 0) {
							if (! this._PWATypeSelection) {
								this._PWATypeSelection = sap.ui.xmlfragment("hnd.dpe.warranty.prior_work_approval.fragment.PWATypeSelection", this);
								this.setModel(new JSONModel(this._buildSalesOrgList(oData)),"SalesAreas");
								this.getView().addDependent(this._PWATypeSelection);
							}
							this._PWATypeSelection.open();
							this._filterPWAType(this.getModel("PWA").getProperty("/SalesOrganisation"));
						} else {
							this._showPWAClaimErrorMessage();
						}
					}.bind(this),
					error: this._showPWAClaimErrorMessage.bind(this)
				}
			);
		},
		
		_showPWAClaimErrorMessage: function(){
			MessageBox.error(
				"An error occurred while loading Claim Types for your Dealership.\nPlease try again later.",
				{
					id : "errorMessageBox",
					actions : [MessageBox.Action.CLOSE],
					onClose : function () {
						this.navigateToLaunchpad();
					}.bind(this)
				}	
			);
		},
		
		_buildSalesOrgList: function(oSalesAreas){
			var distinctCompanyCodes = [];
			var salesOrganisations = [];
			
			for (var i = 0; i < oSalesAreas.results.length; i++) {
				var salesArea = oSalesAreas.results[i];
				if (distinctCompanyCodes.indexOf(salesArea.CompanyCode) === -1){
					salesOrganisations.push({
						"CompanyCode": salesArea.CompanyCode,
						"CompanyCodeName": salesArea.CompanyCodeName,
						"SalesOrg": salesArea.SalesOrg
					});
					distinctCompanyCodes.push(salesArea.CompanyCode);
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
		},
	
		_canExecuteAction: function(){
			
			//Run all UI Validation Rules
			sap.ui.getCore().getMessageManager().removeAllMessages();
			PWA.validateAll();
			sap.ui.getCore().getEventBus().publish("Validation","Refresh");
			
			//If there are any Frontend Issues - then don't call Action...
			if(PWA.hasFrontendValidationError()){
				MessageBox.error(
					"Please correct the data validation errors.",
					{
						id : "errorMessageBox",
						actions : [MessageBox.Action.CLOSE]
					}	
				);
				return false;
			} else {
				return true;
			}	

		}
	});
});