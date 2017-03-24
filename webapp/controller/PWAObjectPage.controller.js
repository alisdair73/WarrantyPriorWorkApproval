sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.controller.PWAObjectPage", {
 
      onInit: function() {
		this.getRouter().getRoute("PWAMain").attachPatternMatched(this._onCreatePWA, this);
      },
      
      _onCreatePWA: function(){
      	
      }

	});
});