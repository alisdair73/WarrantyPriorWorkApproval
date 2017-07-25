sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"sap/ui/model/Filter",
	"sap/m/MessageStrip",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, PWA, Filter, MessageStrip, MessageToast, MessageBox) {
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
					"requestedTotal": 0,
					"approvedTotal": 0
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
			
			this.getModel("PWA").setProperty("/PWAType",PWAType);
			this.getModel("PWA").setProperty("/PWATypeDescription", PWATypeDescription);
			this.getModel("PWA").setProperty("/PWATypeGroup", PWATypeGroup);
			
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
			this._clearHeaderMessages();
			
			this.getView().getModel().create("/PriorWorkApprovalSet",
				PWA.convertToODataForUpdate(), 
				{
					"success": this._onActionSuccess.bind(this),
					"error": this._onActionError.bind(this),
					"headers": { "pwaaction": actionName },
					"async": true
				}
			);
		},

		_onActionSuccess: function(responseData,response){
			
			var leadingMessage = JSON.parse(response.headers['sap-message']);
			MessageToast.show(leadingMessage.message);
			
			this._addMessagesToHeader(leadingMessage.details);
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
			
			this.getView().getModel("ViewHelper").setProperty("/UI/requestedTotal", requestedTotal);
		},
		
		_onActionError: function(error){
			switch(error.statusCode){
				case "400":
					var errorDetail = JSON.parse(error.responseText);
					this._addMessagesToHeader(errorDetail.error.innererror.errordetails);
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
			//PWANumber = "200000000556";
				
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
		
		_clearHeaderMessages: function(){
			this.getView().byId("messageArea").destroyContent();
		},
		
		_addMessagesToHeader: function(messages){
		
			var messageArea = this.getView().byId("messageArea");
			messageArea.destroyContent();
			
			for (var i = 0; i < messages.length; i++) {
				var messageStrip = new MessageStrip("msgStrip" + i, {
					text: messages[i].message,
					showCloseButton: false,
					showIcon: true,
					type: messages[i].severity === "error" ? "Error" : "Warning"
				});
				messageArea.addContent(messageStrip);
			}
			//Scroll to the top of the page so messages are visible
			var objectLayout = this.getView().byId("PWA");
			objectLayout.scrollToSection(this.getView().byId("vehicleDetails_sub1").getId(), 0, -200);
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
						actions : [MessageBox.Action.CLOSE],
						onClose : function () {
							//this.navigateToLaunchpad();
						}
					}	
				);
				return false;
			} else {
				return true;
			}	

		}
	});
});