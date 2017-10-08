sap.ui.define(["sap/ui/core/mvc/Controller",
"sap/m/MessageToast",
"sap/ui/model/Filter",
"sap/m/UploadCollectionParameter",
"hnd/dpe/warranty/prior_work_approval/model/PWA"
], function(Controller, MessageToast, Filter, UploadCollectionParameter,PWA) {
	"use strict";

	return Controller.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlockController", {
		
		onInit: function () {
			// Sets the text to the label
			this.getView().byId("pwaAttachmentCollection").addEventDelegate({
				onBeforeRendering : function () {
					this.getView().byId("attachmentTitle").setText(this._getAttachmentTitleText());
				}.bind(this)
			});
			
			var uploadCollection = this.getView().byId("pwaAttachmentCollection");
            this._UploadCollectionItemTemplate = uploadCollection.getBindingInfo("items").template;
            this._attachments = [];
            this._noOfAttachments = 0;
            //oAttachControlCreate.unbindAggregation("items");
			
			
			//Set up Event Listener to Upload Files
			sap.ui.getCore().getEventBus().subscribe("PWA","Saved",this._uploadAttachmentCollection,this);
		},

		onExit: function () {
			sap.ui.getCore().getEventBus().unsubscribe("PWA","Saved",this._uploadAttachmentCollection,this);
		},
		
		onUploadComplete: function(oEvent) {

			var fileResponse = JSON.parse( oEvent.getParameter("mParameters").responseRaw );
			var PWANumber = this.getView().getModel("PWA").getProperty("/PWANumber");
			var attachments = this.getView().getModel("PWA").getProperty("/Attachments");
		    var attachment = {
		    	"DocumentID": fileResponse.d.DocumentID,
		    	"Content":"",
		    	"Deleted": false,
		    	"MimeType": fileResponse.d.MimeType,
		    	"FileName": fileResponse.d.FileName,
		    	"URL": "/sap/opu/odata/sap/ZWTY_WARRANTY_CLAIMS_SRV/PriorWorkApprovalSet('" + PWANumber + "')/Attachments('" + fileResponse.d.DocumentID + "')/$value"
		    };
		    
		    attachments.push(attachment);
			this._noOfAttachments = this._noOfAttachments - 1;
			
			var uploadCollection = this.getView().byId("pwaAttachmentCollection");
			// var uploadCollection = oEvent.getSource();

		    for (var i = 0; i < uploadCollection.getItems().length; i++) {
			  	if (uploadCollection.getItems()[i].getFileName() === fileResponse.d.FileName) {
			  		uploadCollection.removeItem(uploadCollection.getItems()[i]);
			  		break;
			  	}
			}
			
			this.getView().getModel("PWA").setProperty("/Attachments", attachments);

/*		    if (this._noOfAttachments === 0){

				uploadCollection.removeAllAggregation("items");
				this.getView().getModel("PWA").setProperty("/Attachments", attachments);
				
				 var test = new sap.m.UploadCollectionItem({
				 	documentId:"{PWA>DocumentID}",
				 	fileName:"{PWA>FileName}",
				 	mimeType:"{PWA>MimeType}",
				 	url:"{PWA>URL}",
				 	visibleEdit:false,
				 	visibleDelete:"{PWA>CanEdit}",
				 	enableEdit:false,
				 	enableDelete:"{PWA>CanEdit}"
				 });
											
				 uploadCollection.bindAggregation("items", {
				 	path: "PWA>Attachments",
				 	template: test
				 });
		    } */
		},
		
		onUploadTerminated: function(event) {
		
			var sFileName = event.getParameter("fileName");
			var oRequestHeaders = event.getParameters().getHeaderParameter();
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
            
           // this._attachments = this.getView().getModel("PWA").getProperty("/Attachments");
            
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
			this.getView().getModel("PWA").setProperty(path + "/Deleted", true);

//this.getView().getModel("PWA").setProperty("/Attachments", this.getView().getModel("PWA").getProperty("/Attachments"));

        	var filters = [];

			filters.push(new Filter(
				"Deleted",
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
			if(attachmentCollection){
				this._noOfAttachments = attachmentCollection._aFileUploadersForPendingUpload.length
;
				attachmentCollection.upload();
				//attachmentCollection.removeAllAggregation();
				//this.getView().getModel("PWA").setProperty("/Attachments", this._attachments);
				
				//  var test = new sap.m.UploadCollectionItem({
				//  	documentId:"{PWA>DocumentID}",
				//  	fileName:"{PWA>FileName}",
				//  	mimeType:"{PWA>MimeType}",
				//  	url:"{PWA>URL}",
				//  	visibleEdit:false,
				//  	visibleDelete:"{PWA>CanEdit}",
				//  	enableEdit:false,
				//  	enableDelete:"{PWA>CanEdit}"
				//  });
				
				// attachmentCollection.bindAggregation("items", {
				//  	path: "PWA>Attachments",
				//  	template: test
				//  });
				
			//	this.getView().getModel("PWA").setProperty("/Attachments", attachments);
			}
		}
	});

});