sap.ui.define(["sap/ui/core/mvc/Controller" 
], function(Controller) {
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

		_getAttachmentTitleText: function(){
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		}
	});

});