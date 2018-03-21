sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/m/MessageBox",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter",
"hnd/dpe/warranty/prior_work_approval/model/PWA",
"sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, MessageBox, Filter, UploadCollectionParameter,PWA,JSONModel) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlockController", {
		
		onUploadComplete: function(oEvent) {
			
			var fileResponse = JSON.parse( oEvent.getParameter("mParameters").responseRaw );
			var PWANumber = this.getView().getModel("PWA").getProperty("/PWANumber");
		    var attachment = {
		    	"DocumentID": fileResponse.d.DocumentID,
		    	"Content":"",
		    	"Deleted": false,
		    	"MimeType": fileResponse.d.MimeType,
		    	"FileName": fileResponse.d.FileName,
		    	"URL": "/sap/opu/odata/sap/ZWTY_WARRANTY_CLAIMS_SRV/PriorWorkApprovalSet('" + PWANumber + "')/Attachments('" + fileResponse.d.DocumentID + "')/$value"
		    };
		
			var attachments = this.getView().getModel("PWA").getProperty("/Attachments");
			attachments.push(attachment);
			this.getView().getModel("PWA").setProperty("/Attachments", attachments);            
			
			this.getView().getModel("ViewHelper").setProperty("/busy", false);
		},
		
		onBeforeUploadStarts: function(oEvent){
			
			//Set the Busy Indicator to stop additional uploads and other actions
			this.getView().getModel("ViewHelper").setProperty("/busy", true);
			
    		oEvent.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getView().getModel("PWA").getProperty("/PWANumber") + "|" + oEvent.getParameter("fileName").replace(/[^\x20-\x7E]/g, "")
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
		
		onFileTypeMismatch: function(event){
			var docTypes = this.getView().getModel("ViewHelper").getProperty("/UI/docTypes");
			MessageBox.error("The following Doc Types can be uploaded: \n" + docTypes.join());
		},
		
		onFileDeleted: function(oEvent) {
		
			var documentId = oEvent.getParameter("documentId");

        	this.getView().getModel().remove(
            	"/AttachmentSet(DocumentId='" + documentId + "')", ///$value", 
            	{
            		"headers": {"objectkey": this.getView().getModel("PWA").getProperty("/PWANumber")},
            		"success":function(oData, Response) {
            			this._refreshAfterDelete(documentId);
            		}.bind(this),
            		"error": function(e) {
            			MessageToast.show(JSON.parse(e.response.body).error.message.value, "");
            		}
            	} 
        	);
		},		
		
		_refreshAfterDelete: function(documentId){
			MessageToast.show("File deleted");
            			
			//Remove Deleted Attachments from Attachment Collection
            var attachments = this.getView().getModel("PWA").getProperty("/Attachments").filter(function(item) { 
				return item.DocumentID !== documentId;
			});
			this.getView().getModel("PWA").setProperty("/Attachments",attachments);
		},
		
		onFileSizeExceed : function(oEvent) {
			MessageToast.show("The maximum allowed size for file attachments is 25MB.");
		},

		_getAttachmentTitleText: function(){
			var aItems = this.getView().byId("pwaAttachmentCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		}
	});
});