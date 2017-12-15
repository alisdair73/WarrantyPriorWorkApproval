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
				"busy": true,
				"delay": 0,
				"readOnly": false,
				"UI": {
					"dealerNumber":"",
					"dealerDescription":"",
					"approvedTotal": 0,
					"hasBeenValidated":false,
					"showRequestedCosts":true,
					"showApprovedCosts":false
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
			var status = oEvent.getParameter("listItem").getBindingContext().getObject().InitialStatus;
			var statusDescription = oEvent.getParameter("listItem").getBindingContext().getObject().InitialStatusDescription;
			var statusIcon = oEvent.getParameter("listItem").getBindingContext().getObject().InitialStatusIcon;
			
			this.getModel("PWA").setProperty("/PWAType",PWAType);
			this.getModel("PWA").setProperty("/PWATypeDescription", PWATypeDescription);
			this.getModel("PWA").setProperty("/PWATypeGroup", PWATypeGroup);
			this.getModel("PWA").setProperty("/ObjectType", objectType);
			
			this.getModel("PWA").setProperty("/Status",status);
			this.getModel("PWA").setProperty("/StatusDescription",statusDescription);
			this.getModel("PWA").setProperty("/StatusIcon",statusIcon);
			
			this.getModel("ViewHelper").setProperty("/busy", false);
			this._PWATypeSelection.close();
		},	
		
		onNewPWA: function(){
			this.navigateToApp("#PriorWorkApproval-create");
		},
		
		onDuplicatePWA: function(){
			//Reset the Status based on the Claim Type
			var PWAType = this.getView().getModel("PWA").getProperty("/PWAType");
			
			this.getOwnerComponent().getModel().read(
				"/ClaimTypeSet", {
					context: null,
					filters: [new Filter("Code",sap.ui.model.FilterOperator.EQ, PWAType)],
					success: function(oData) {
						if (oData.results.length && oData.results.length > 0) {

							this.getModel("ViewHelper").setProperty("/readOnly", false);
							
							this.getView().getModel("PWA").setProperty("/PWANumber","");
							this.getView().getModel("PWA").setProperty("/SubmittedOn",null);
							this.getView().getModel("PWA").setProperty("/CurrentVersionNumber","0001");
							this.getView().getModel("PWA").setProperty("/CurrentVersionCategory","IC");
							this.getView().getModel("PWA").setProperty("/CanEdit",true);
							this.getView().getModel("PWA").setProperty("/VersionIdentifier",null);
							
							this.getModel("PWA").setProperty("/Status",oData.results[0].InitialStatus);
							this.getModel("PWA").setProperty("/StatusDescription",oData.results[0].InitialStatusDescription);

							sap.ui.getCore().getMessageManager().removeAllMessages();
							
							MessageBox.success("PWA Duplicated.");
							
						} else {
							this._showWarrantyClaimErrorMessage();
						}
					}.bind(this),
					error: this._showWarrantyClaimErrorMessage
				}
			);
			
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
		
		viewMyDealerships: function() {
			var crossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			// View the Sales Order Factsheet
			crossAppNavigator.toExternal({
				target: {
					semanticObject: "Dealer",
					action: "setDealership" 
				}
			});
		},
		
		openMessages: function(event){
			
			if (!this._messagePopover)  {
				this._messagePopover = sap.ui.xmlfragment( "hnd.dpe.warranty.prior_work_approval.fragment.Messages" );
				this.getView().addDependent(this._messagePopover );
			}

			if(event){
				this._messagePopover.openBy(event.getSource());
			} else {
				this._messagePopover.openBy(this.getView().byId("messagePopup"));
			}
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
			
			var isValid = false;
			var leadingMessage = JSON.parse(response.headers['sap-message']);

			var errorMessages = leadingMessage.details.filter(function(message){
				return message.severity === "error";
			});
			
			if(errorMessages.length > 0){
				
				MessageBox.error(
					leadingMessage.message,
					{
						actions : [MessageBox.Action.CLOSE],
						onClose: function(){ this.openMessages(); }.bind(this)
					}	
				);
				
			} else {
			
				isValid = true;

				var warningMessages = leadingMessage.details.filter(function(message){
					return message.severity === "warning";
				});
				
				if(warningMessages.length > 0 && actionName !== "SubmitPWA"){

					MessageBox.warning(
						leadingMessage.message + "\n" + "Please review the Warning messages before submitting PWA.",
						{
							actions : [MessageBox.Action.CLOSE],
							onClose: function(){ 
								this.openMessages(); 
							}.bind(this)
						}	
					);
					
				} else {
					MessageBox.success(
						leadingMessage.message 
							+ ( actionName === "SubmitPWA" ? "" : "\nPlease observe any additional notes provided." ),
						{
							actions : [MessageBox.Action.CLOSE],
							onClose: function(){
								if(actionName === "SubmitPWA"){
									this.navigateToApp("#PriorWorkApproval-create?PriorWorkApproval=" + 
										this.getView().getModel("PWA").getProperty("/PWANumber")
									);
								}
							}.bind(this)
							
						}	
					);
				}
			}
			
			PWA.updatePWAFromJSONModel(responseData, actionName === "ValidatePWA" );
			this._determineCostsVisibility();
			this._updateEstimatedTotal();
			sap.ui.getCore().getEventBus().publish("PWA","Saved");
			
			if(actionName === "ValidatePWA"){
				this.getModel("ViewHelper").setProperty("/UI/hasBeenValidated", isValid);
			}
				
			this.getModel("ViewHelper").setProperty("/busy", false);
		},
		
		_determineCostsVisibility:function(){
			
			
			var showRequestedCosts = true;
			var status = this.getModel("PWA").getProperty("/Status");
			
			if (status === 'Y004' || status === 'Y019'){
				//Show Approved Costs
				showRequestedCosts = false;
			}
			
			this.getModel("ViewHelper").setProperty("/UI/showRequestedCosts", showRequestedCosts);
			this.getModel("ViewHelper").setProperty("/UI/showApprovedCosts", !showRequestedCosts);
				
				
/*			var requestedCosts = this.getModel("PWA").getProperty("/CanEdit") ||
			(
				!this.getModel("PWA").getProperty("/CanEdit") &&
    			this.getModel("PWA").getProperty("/Status") === 'X002'
    		);
    		
    		this.getModel("ViewHelper").setProperty("/UI/showRequestedCosts", requestedCosts);
    		
    		var approvedCosts = !requestedCosts;
    		this.getModel("ViewHelper").setProperty("/UI/showApprovedCosts", approvedCosts);*/
  
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
					
					//REMOVE THE DUPLICATED LEAD MESSAGE - "SY/530"
					var registeredMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData().filter(
		  				function(registeredMessage){
							return registeredMessage.code === 'SY/530';
						}
					);
		    		
		    		if(registeredMessages.length > 0){
		    			sap.ui.getCore().getMessageManager().removeMessages(registeredMessages[0]);
		    		}  
					break;
					
				case "500":
					//Technical Error
					break;
			}
			
			MessageBox.error(
				"An error occurred while processing the PWA.",
				{
					id : "errorMessageBox",
					actions : [MessageBox.Action.CLOSE]
				}	
			);
			
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
			//PWANumber = "1210000141";

			if (PWANumber){
				var entityPath = "/PriorWorkApprovalSet('" + PWANumber + "')";
				this._bindView(entityPath);
			}else{
				this._openPWATypeSelectDialog( );
			}
    	},
    	
    	
		_showNoDealershipDialog: function() {

			// Create the success dialog if it isn't already
			if (!this._noDealershipDialog) {
				this._noDealershipDialog = sap.ui.xmlfragment("hnd.dpe.warranty.prior_work_approval.fragment.NoDealershipAssignedDialog", this);
				this.getView().addDependent(this._noDealershipDialog);
			}

			// Show the success dialog
			this._noDealershipDialog.open();
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
			
			//Are we showing Requested or Aproved Splits
			this._determineCostsVisibility();
			
			//Update Total Cost
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
							this._filterPWAType(this.getModel("PWA").getProperty("/SalesOrg"));
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
			this.getModel("PWA").setProperty("/SalesOrg",salesOrganisations[0].SalesOrg);
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