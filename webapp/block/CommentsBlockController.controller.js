sap.ui.define([
	"hnd/dpe/warranty/prior_work_approval/controller/BaseController",
	"sap/ui/model/Filter",
	"hnd/dpe/warranty/prior_work_approval/model/PWA"
], function(BaseController,  Filter, PWA) {
	"use strict";

	return BaseController.extend("hnd.dpe.warranty.prior_work_approval.block.CommentsBlockController", {
	
		onInit: function(){
			sap.ui.getCore().getEventBus().subscribe("Validation","Refresh",this._refreshValidationMessages.bind(this),this);
		},
		
		onCustomerConcernedChanged: function(){
			PWA.validateCustomerConcern();
			this.logValidationMessage("CustomerConcern");
		},
		
		onDealerCommentChanged: function(){
			PWA.validateDealerComment();
			this.logValidationMessage("DealerComment");
		},
		
		_refreshValidationMessages: function(){
			this.logValidationMessage("CustomerConcern");
			this.logValidationMessage("DealerComment");
		}
	});
});