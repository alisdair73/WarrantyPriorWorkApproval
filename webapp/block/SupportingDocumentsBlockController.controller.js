sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter"
], function(Controller, MessageToast, Filter, UploadCollectionParameter) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlockController", {
		
		onInit: function () {
			// Sets the text to the label
			this.getView().byId("pwaAttachmentCollection").addEventDelegate({
				onBeforeRendering : function () {
					this.getView().byId("attachmentTitle").setText(this._getAttachmentTitleText());
				}.bind(this)
			});
			
			//Set up Event Listener to Upload Files
			sap.ui.getCore().getEventBus().subscribe("PWA","Saved",this._uploadAttachmentCollection.bind(this),this);
		},

		onUploadComplete: function(oEvent) {

			var fileResponse = JSON.parse( oEvent.getParameter("mParameters").responseRaw );
			var PWANumber = this.getView().getModel("PWA").getProperty("/PWANumber");
			var attachments = this.getView().getModel("PWA").getProperty("/Attachments");
		    var attachment = {
		    	"DocumentID": fileResponse.d.DocumentID,
		    	"MimeType": fileResponse.d.MimeType,
		    	"FileName": fileResponse.d.FileName,
		    	"URL": "/sap/opu/odata/sap/ZWTY_WARRANTY_CLAIMS_SRV/PriorWorkApprovalSet('" + PWANumber + "')/Attachments('" + fileResponse.d.DocumentID + "')/$value"
		    };
		    attachments.push(attachment);
		    
		    var uploadCollection = this.getView().byId("pwaAttachmentCollection");

		    for (var i = 0; i < uploadCollection.getItems().length; i++) {
				if (uploadCollection.getItems()[i].getFileName() === fileResponse.d.FileName) {
					uploadCollection.removeItem(uploadCollection.getItems()[i]);
					break;
				}
			}

		    this.getView().getModel("PWA").setProperty("/Attachments", attachments);
		},
		
		onUploadTerminated: function(oEvent) {
		
/*			var sFileName = oEvent.getParameter("fileName");
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();*/
		},
		
		onBeforeUploadStarts: function(oEvent){
			
    		oEvent.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getView().getModel("PWA").getProperty("/PWANumber") + "|" + oEvent.getParameter("fileName")
            }));
            
    		oEvent.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({
                name: "accept",
                value: "application/json"
            }));
            
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
		
			var path = oEvent.getParameter("item").getBindingContext("PWA").getPath();
			this.getView().getModel("PWA").setProperty(path + "/deleted", true);

           	var filters = [];

			filters.push(new Filter(
				"deleted",
				sap.ui.model.FilterOperator.EQ, 
				false
			));
			
			this.getView().byId("pwaAttachmentCollection").getBinding("items").filter(filters);
		    
		},		
		
		onFileSizeExceed : function(oEvent) {
			MessageToast.show("The maximum allowed size for file attachments is 25MB.");
		},

		_getAttachmentTitleText: function(){
			var aItems = this.getView().byId("pwaAttachmentCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},
		
		_uploadAttachmentCollection: function(){
			//Start the File Upload
			var attachmentCollection = this.getView().byId("pwaAttachmentCollection");
			attachmentCollection.upload();
		}
	});

});