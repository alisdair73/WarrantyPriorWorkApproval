sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var supportingDocumentsBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.SupportingDocumentsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return supportingDocumentsBlock;
}, true);