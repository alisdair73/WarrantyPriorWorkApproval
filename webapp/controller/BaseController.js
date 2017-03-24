sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, DateFormat) {
	"use strict";
	return Controller.extend("hnd.dpe.warranty.prior_work_approval.controller.BaseController", {

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		onChangeDatePicker: function(oEvent) {
			// Format date to remove UTC issue
			var oDatePicker = oEvent.getSource();
			var oNewDate = oDatePicker.getDateValue();
			if (oNewDate) {
				oDatePicker.setDateValue(this.convertDateTimeToDateOnly(oNewDate));
			}
		},
		
		convertDateTimeToDateOnly: function(oDateTime) {
			var oFormatDate = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});
			var oDate = oFormatDate.format(oDateTime);
			oDate = oDate.split("T");
			var oDateActual = oDate[0];
			return new Date(oDateActual);
		},
		
		navigateToLaunchpad: function() {
			var crossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			// Navigate back to FLP home
			crossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		}
	});
});