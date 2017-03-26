sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hnd/dpe/warranty/prior_work_approval/model/PWA"
], function(BaseController,JSONModel,PWA) {
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
//				this._openPWATypeSelectDialog( );
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
		}
	});
});