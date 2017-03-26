sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var vehicleDetailsBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.CustomerDetailsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.CustomerDetailsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.CustomerDetailsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return vehicleDetailsBlock;
}, true);