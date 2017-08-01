sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/message/Message"
], function(Controller, JSONModel, DateFormat, Message) {
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
		},
		
		logValidationMessage:function(fieldId, modelName, target){
			
			this._removeErrorMessageFromMessageManager("UI_" + fieldId);
			
			var model = this.getView().getModel(modelName ? modelName : "PWA");
			var messageTarget = target ? target : "/" + fieldId;
			var field = model.getProperty(messageTarget);

			if(!field.ruleResult.valid){

				//Get the Field Name 
				var fieldName = this.getView().getModel("i18n").getResourceBundle().getText(fieldId);
				
				this._addErrorMessageToMessageManager(
					"UI_" + fieldId,
					model,
					this.getView().getModel("i18n").getResourceBundle().getText(
						field.ruleResult.errorTextID,[fieldName]
					),
					messageTarget + "/value"
				);
			}
		},

		_doesMessageExistInMessageManager: function (messageID){
			var registeredMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData().filter(
  				function(registeredMessage){
					return registeredMessage.id ===  messageID;
				}
			);
    		
    		if(registeredMessages.length > 0){
    			return registeredMessages[0];
    		}  
		},	
	
		_removeErrorMessageFromMessageManager:function(messageID){
			
			var message = this._doesMessageExistInMessageManager(messageID);
			if(message){
				sap.ui.getCore().getMessageManager().removeMessages(message);
			}
		},
		
		_addErrorMessageToMessageManager:function(messageID, messageProcessor, messageText, messageTarget){
			
			if( !this._doesMessageExistInMessageManager(messageID)){
			
				var message = new Message({
					"id": messageID,
	            	"message": messageText,
	                "type": 'Error',
	                "target": messageTarget,
	                "processor": messageProcessor
	        	});
      			sap.ui.getCore().getMessageManager().addMessages(message);
			}
		}
	});
});