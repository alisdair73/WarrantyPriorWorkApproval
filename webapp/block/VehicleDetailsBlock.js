sap.ui.define(["sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";
 
	var vehicleDetailsBlock = BlockBase.extend("hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "hnd.dpe.warranty.prior_work_approval.block.VehicleDetailsBlock",
					type: "XML"
				}
			}
		}
	});
 
	return vehicleDetailsBlock;
}, true);