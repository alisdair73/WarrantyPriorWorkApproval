sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var commentsBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.CommentsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.CommentsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.CommentsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return commentsBlock;
}, true);