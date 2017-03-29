sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/UploadCollectionParameter"
], function(Controller, UploadCollectionParameter) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlockController", {
		
		onInit: function () {
			// Sets the text to the label
			this.getView().byId("UploadCollection").addEventDelegate({
				onBeforeRendering : function () {
					this.getView().byId("attachmentTitle").setText(this._getAttachmentTitleText());
				}.bind(this)
			});
		},

		onUploadComplete: function(oEvent) {
		},
		
		onUploadTerminated: function(oEvent) {
		
			var sFileName = oEvent.getParameter("fileName");
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},
		
		onBeforeUploadStarts: function(oEvent){
			
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name : "slug",
				value : oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		
		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name : "x-csrf-token",
				value : this.getView().getModel().getSecurityToken()
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
 
		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
		},		
		
		onFileSizeExceed : function(oEvent) {
		},

		_getAttachmentTitleText: function(){
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		}
	});

});