sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter",
"hnd/dpe/warranty/prior_work_approval/model/PWA",
"sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, Filter, UploadCollectionParameter,PWA,JSONModel) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlockController", {
		
		onInit: function () {

			// Sets the text to the label
/*			this.getView().byId("pwaAttachmentCollection").addEventDelegate({
				onBeforeRendering : function () {
					var PWANumber = this.getView().getModel("PWA").getProperty("/PWANumber");
					if(PWANumber){
						this.getView().byId("attachmentTitleMaintain").setText this._getAttachmentTitleText());
					} else {
						this.getView().byId("attachmentTitleCreate").setText(this._getAttachmentTitleText());
					}
				}.bind(this)
			});*/
			
			this.getView().setModel(new JSONModel({ "busy":false, "attachmentMode":"create", "attachments":[]}), "AttachmentHelper");
			
			//Set up Event Listener to Upload Files
			sap.ui.getCore().getEventBus().subscribe("PWA","Saved",this._uploadAttachmentCollection,this);
			this._attachmentCreateCount = 0;
			this._attachmentCreateRemaining = 0;
			
		},

		onExit: function () {
			sap.ui.getCore().getEventBus().unsubscribe("PWA","Saved",this._uploadAttachmentCollection,this);
		},
		
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
			    
			if(this.getView().getModel("AttachmentHelper").getProperty("/attachmentMode") === 'create'){
				
	        	var createdAttachments = this.getView().getModel("AttachmentHelper").getProperty("/attachments");
				createdAttachments.push(attachment);
				this.getView().getModel("AttachmentHelper").setProperty("/attachments", createdAttachments); 				
				
				if (this._attachmentCreateRemaining > 1) {
	                this._attachmentCreateRemaining -= 1;
	            } else {
					this.getView().getModel("AttachmentHelper").setProperty("/busy",false);
					this.getView().getModel("AttachmentHelper").setProperty("/attachmentMode","maintain");
					this._attachmentCreateRemaining = 0;
					
					this.getView().getModel("PWA").setProperty("/Attachments", createdAttachments);
	            }
	            
	            MessageToast.show("Attachment " + 
	            	( this._attachmentCreateCount - this._attachmentCreateRemaining ) +
	            	" of " + this._attachmentCreateCount + " loaded."
	        	);
	        
			} else {
				
				var uploadCollection = oEvent.getSource();
			    for (var i = 0; i < uploadCollection.getItems().length; i++) {
				  	if (uploadCollection.getItems()[i].getFileName() === fileResponse.d.FileName) {
				  		uploadCollection.removeItem(uploadCollection.getItems()[i]);
				  		break;
				  	}
				}
				
				var attachments = this.getView().getModel("PWA").getProperty("/Attachments");
				attachments.push(attachment);
				this.getView().getModel("PWA").setProperty("/Attachments", attachments);            
			}
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
 
 		onUploadTerminated : function(oEvent) {
			
		},
		
		onFileDeleted: function(oEvent) {
		
			var documentId = oEvent.getParameter("documentId");
			
        	this.getView().getModel().remove(
            	"/AttachmentSet(DocumentId='" + oEvent.getParameter("documentId") + "')/$value", 
            	{
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
		},
		
		_uploadAttachmentCollection: function(){
			//Start the File Upload
			var attachmentCollection = this.getView().byId("pwaAttachmentCollectionCreate");
			if(attachmentCollection){
				
				this._attachmentCreateCount = attachmentCollection.getItems().length;
				this._attachmentCreateRemaining = this._attachmentCreateCount;
				if (this._attachmentCreateCount > 0){
					this.getView().getModel("AttachmentHelper").setProperty("/busy",true);
					attachmentCollection.upload();
				} else {
					this.getView().getModel("AttachmentHelper").setProperty("/attachmentMode","maintain");
				}
			}
		}
	});

});