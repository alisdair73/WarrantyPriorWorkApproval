sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var repairCostBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.RepairCostsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return repairCostBlock;
}, true);