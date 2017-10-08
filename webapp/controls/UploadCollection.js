sap.ui.define(
    ['sap/m/UploadCollection'],
    function(UploadCollection) {
        return UploadCollection.extend("hnd.dpe.warranty.prior_work_approval.controls.UploadCollection",{

            renderer: function(oRm,oControl){
                sap.m.UploadCollectionRenderer.render(oRm,oControl); //use supercass renderer routine
            },
            
/*            _handleDelete: function(oEvent, oContext) {
            	UploadCollection.prototype._handleDelete(oEvent, oContext);
            	this.context = oContext;
            },*/
            
            _onCloseMessageBoxDeleteItem : function(oAction){
            	
           // 	sap.m.UploadCollection.prototype._onCloseMessageBoxDeleteItem(oAction).bind(this);
            	
				var aItems = this.getItems();
				var oItemToBeDeleted;
				if (this.getInstantUpload()) {
					for (var i = 0; i < aItems.length; i++) {
						if (aItems[i].getDocumentId() === this._oItemForDelete.documentId) {
							oItemToBeDeleted = aItems[i];
						}
					}
				 } else {
				 	oItemToBeDeleted = aItems[this._oItemForDelete._iLineNumber];
				 }
				if (oAction === sap.m.MessageBox.Action.OK) {
					this._oItemForDelete._status = UploadCollection._toBeDeletedStatus;
					if (this.getInstantUpload()) {
						// fire event
						this.fireFileDeleted({
							// deprecated
							documentId : this._oItemForDelete.documentId,
							// new
							item : oItemToBeDeleted
						});
						
						// do not save the item after the item is deleted in instant mode
						this._oItemForDelete = null;
					 } else {
					 	if (this.aItems.length === 1) {
					 		this.sFocusId = this._oFileUploader.$().find(":button")[0].id;
					 	} else {
					 		if (this._oItemForDelete._iLineNumber < this.aItems.length - 1) {
					 			this.sFocusId = this.aItems[this._oItemForDelete._iLineNumber + 1].getId() + "-cli";
					 		} else {
					 			this.sFocusId = this.aItems[0].getId() + "-cli";
					 		}
					 	}
						
/*					 	this._aDeletedItemForPendingUpload.push(oItemToBeDeleted);
					 	this.aItems.splice(this._oItemForDelete._iLineNumber, 1);
					 	this.removeAggregation("items", oItemToBeDeleted, false);*/
					// //	this._aDeletedItemForPendingUpload = [];
					// //	this.sDeletedItemId = null;
						
					 	this.fireFileDeleted({
					 		item : oItemToBeDeleted
					 	});

					 }
				}
            }
  
        });
    }
);