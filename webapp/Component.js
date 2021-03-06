sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"hnd/dpe/warranty/prior_work_approval/model/models",
	"hnd/dpe/warranty/prior_work_approval/model/PWA",
	"hnd/dpe/warranty/prior_work_approval/controller/ErrorHandler"
], function(UIComponent, Device, models,PWA, ErrorHandler) {
	"use strict";

	return UIComponent.extend("hnd.dpe.warranty.prior_work_approval.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			
			//Register the Error Handler
			this._oErrorHandler = new ErrorHandler(this);
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			//set the initial PWA Model
			this.setModel(PWA.createPWAModel(),"PWA");		
		
			this.getRouter().initialize();			
		}
	});
});