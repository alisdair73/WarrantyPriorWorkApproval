sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var assessmentResultsBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.AssessmentResultsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.AssessmentResultsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.AssessmentResultsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return assessmentResultsBlock;
}, true);