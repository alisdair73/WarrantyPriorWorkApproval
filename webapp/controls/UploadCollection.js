sap.ui.define(
    ['sap/m/UploadCollection'],
    function(UploadCollection) {
        return UploadCollection.extend("hnd.dpe.warranty.prior_work_approval.controls.UploadCollection",{

            renderer: function(oRm,oControl){
                sap.m.UploadCollectionRenderer.render(oRm,oControl); //use supercass renderer routine
            },

            _onCloseMessageBoxDeleteItem : function(oAction){
            	
				if (oAction === sap.m.MessageBox.Action.OK) {
					var aItems = this.getItems();
					this.fireFileDeleted({
						item : aItems[this._oItemForDelete._iLineNumber]
					});
				}
            }
        });
    }
);