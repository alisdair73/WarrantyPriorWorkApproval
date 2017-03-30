sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel,NumberFormat) {
	"use strict";

	return {
		oDataModel: null,
		PWA: {},
		PWAOriginal: {},
		
		createPWAModel: function(oData) {
			this.PWA = {
				"PWANumber": "",
				"PWAType": "",
				"SubmittedOn": null,
				"VIN": "",
				"EngineNumber": "",
				"DealerContact": "",
				"DateOfFailure": null,
				"FailureMeasure": "",
				"MCPN": "",
				"OwnerName": "",
				"CompanyName": "",
				"PhoneNumber": "",
				"SoldByDealer": false,
				"HistoryComplete": false,
				"ServicedByDealer": false,
				"OriginalOwner": false,
				"RequestedLabourHours": 0,
				"RequestedLabourCost": 0,
				"RequestedPartsCost": 0,
				"RequestedSubletCost": 0,
				"ApprovedLabourHours": 0,
				"ApprovedLabourCost": 0,
				"ApprovedPartsCost": 0,
				"ApprovedSubletCost": 0,
				"LabourSplitOwner": 0,
				"LabourSplitDealer": 0,
				"PartsSplitOwner": 0,
				"PartsSplitDealer": 0,
				"SubletSplitOwner": 0,
				"SubletSplitDealer": 0,
				"GoodwillReason": "",
				"CustomerConcern": "",
				"Rectification": "",
				"DealerComment": "",
				"AssessmentComments": "",
				"AssessmentCodes": "",
				"PWATypeDescription": "",
				"PWATypeGroup": "",
				"StatusDescription": "NEW PWA",
				"StatusIcon": "sap-icon://write-new-document",
				"MCPNDescription": "",
				"VersionIdentifier": null,
				"CurrentVersionNumber": "",
				"CurrentVersionCategory": "",
				"CanEdit": true,
				"changed": false,
				"Attachments": []
			};
			
			this.oDataModel = new JSONModel(this.PWA);
			this.oDataModel.setDefaultBindingMode("TwoWay");
			return this.oDataModel;
		},
		
/*		updateWarrantyClaimFromJSONModel: function(jsonModel){
		
			var formatOptions = {
				minFractionDigits: 2,
				maxFractionDigits: 2
			};
			var costFormat = NumberFormat.getFloatInstance(formatOptions);
			
			this.warrantyClaim.ClaimNumber = jsonModel.ClaimNumber;
			
			this.warrantyClaim.OCTotal = parseFloat(jsonModel.OCTotal);
			this.warrantyClaim.OVTotal = parseFloat(jsonModel.OVTotal);
			this.warrantyClaim.ICTotal = parseFloat(jsonModel.ICTotal);
			this.warrantyClaim.IVTotal = parseFloat(jsonModel.IVTotal);
			
			this.warrantyClaim.TotalCostOfClaim = costFormat.format(jsonModel.TotalCostOfClaim);
			this.warrantyClaim.StatusDescription = jsonModel.StatusDescription;
			this.warrantyClaim.StatusIcon = jsonModel.StatusIcon;
			this.warrantyClaim.CanEdit = jsonModel.CanEdit;
			this.warrantyClaim.VersionIdentifier = jsonModel.VersionIdentifier;
			this.warrantyClaim.CurrentVersionNumber = jsonModel.CurrentVersionNumber;
			this.warrantyClaim.CurrentVersionCategory = jsonModel.CurrentVersionCategory;
			
			this.warrantyClaim.Parts = [];
			this.warrantyClaim.Labour = [];
			this.warrantyClaim.Sublet = [];

            if(jsonModel.WarrantyClaimItems){
				for (var i = 0; i < jsonModel.WarrantyClaimItems.results.length; i++) {
					var warrantyClaimItem = jsonModel.WarrantyClaimItems.results[i];
					switch(warrantyClaimItem.ItemType) {
    					case "MAT":
    						if(this.warrantyClaim.Parts.length === 0){
    							warrantyClaimItem.isMCPN = true;
    						}
    						this.warrantyClaim.Parts.push(warrantyClaimItem);
				        	break;
				    	case "FR":
				   			this.warrantyClaim.Labour.push(warrantyClaimItem);
				   			break;
				   		case "SUBL":
				   			this.warrantyClaim.Sublet.push(warrantyClaimItem);
			    			break;
					}
				}
            }
            
            this.resetChanges();
		}, */
		
		updatePWAFromOdata: function(oServerOData) {
			
			var oSource = oServerOData.getSource ? oServerOData.getSource() : oServerOData;
			var oODataModel = oSource.getModel();
			var sPath = oSource.getPath();
			var oPWA = oODataModel.getObject(sPath);
		
			this.PWA.PWANumber = oPWA.PWANumber;
			this.PWA.PWAType = oPWA.PWAType;
			this.PWA.SubmittedOn = oPWA.SubmittedOn;
			this.PWA.VIN = oPWA.VIN;
			this.PWA.EngineNumber = oPWA.EngineNumber;
			this.PWA.DealerContact = oPWA.DealerContact;
			this.PWA.DateOfFailure = oPWA.DateOfFailure;
			this.PWA.FailureMeasure = oPWA.FailureMeasure;
			this.PWA.MCPN = oPWA.MCPN;
			this.PWA.OwnerName = oPWA.OwnerName;
			this.PWA.CompanyName = oPWA.CompanyName;
			this.PWA.PhoneNumber = oPWA.PhoneNumber;
			this.PWA.SoldByDealer = oPWA.SoldByDealer;
			this.PWA.HistoryComplete = oPWA.HistoryComplete;
			this.PWA.ServicedByDealer = oPWA.ServicedByDealer;
			this.PWA.OriginalOwner = oPWA.OriginalOwner;
			this.PWA.RequestedLabourHours = oPWA.RequestedLabourHours;
			this.PWA.RequestedLabourCost = oPWA.RequestedLabourCost;
			this.PWA.RequestedPartsCost = oPWA.RequestedPartsCost;
			this.PWA.RequestedSubletCost = oPWA.RequestedSubletCost;
			this.PWA.ApprovedLabourHours = oPWA.ApprovedLabourHours;
			this.PWA.ApprovedLabourCost = oPWA.ApprovedLabourCost;
			this.PWA.ApprovedPartsCost = oPWA.ApprovedPartsCost;
			this.PWA.ApprovedSubletCost = oPWA.ApprovedSubletCost;
			this.PWA.LabourSplitOwner = oPWA.LabourSplitOwner;
			this.PWA.LabourSplitDealer = oPWA.LabourSplitDealer;
			this.PWA.PartsSplitOwner = oPWA.PartsSplitOwner;
			this.PWA.PartsSplitDealer = oPWA.PartsSplitDealer;
			this.PWA.SubletSplitOwner = oPWA.SubletSplitOwner;
			this.PWA.SubletSplitDealer = oPWA.SubletSplitDealer;
			this.PWA.GoodwillReason = oPWA.GoodwillReason;
			this.PWA.CustomerConcern = oPWA.CustomerConcern;
			this.PWA.Rectification = oPWA.Rectification;
			this.PWA.DealerComment = oPWA.DealerComment;
			this.PWA.AssessmentComments = oPWA.AssessmentComments;
			this.PWA.AssessmentCodes = oPWA.AssessmentCodes;
			this.PWA.PWATypeDescription = oPWA.PWATypeDescription;
			this.PWA.PWATypeGroup = oPWA.PWATypeGroup;
			this.PWA.StatusDescription = oPWA.StatusDescription;
			this.PWA.StatusIcon = oPWA.StatusIcon;
			this.PWA.MCPNDescription = oPWA.MCPNDescription;
			this.PWA.VersionIdentifier = oPWA.VersionIdentifier;
			this.PWA.CurrentVersionNumber = oPWA.CurrentVersionNumber;
			this.PWA.CurrentVersionCategory = oPWA.CurrentVersionCategory;
			this.PWA.CanEdit = oPWA.CanEdit;
	
			var oAttachments = oODataModel.getObject(sPath + "/Attachments");
			if (oAttachments){
				for (var i = 0; i < oAttachments.length; i++) {
					var oAttachment = oODataModel.getObject("/" + oAttachments[i]);
					oAttachment.URL = "/sap/opu/odata/sap/ZWTY_WARRANTY_CLAIMS_SRV/PriorWorkApprovalSet('" + this.PWA.PWANumber + "')/Attachments('" + oAttachment.DocumentID + "')/$value";
					this.PWA.Attachments.push(oAttachment);
				}
			}
			
			this.resetChanges();
		},
		
/*		convertToODataForUpdate: function() {
			var warrantyClaim = {
				"WarrantyClaimItems" : []
			};
			warrantyClaim.ClaimNumber = this.warrantyClaim.ClaimNumber;
			warrantyClaim.ClaimType = this.warrantyClaim.ClaimType;
			warrantyClaim.DealerContact = this.warrantyClaim.DealerContact;
			warrantyClaim.EngineNumber = this.warrantyClaim.EngineNumber;
			warrantyClaim.AuthorisationNumber = this.warrantyClaim.AuthorisationNumber;
			warrantyClaim.VIN = this.warrantyClaim.VIN;
			warrantyClaim.RecallNumber = this.warrantyClaim.RecallNumber;
			warrantyClaim.RepairOrderNumber = this.warrantyClaim.RepairOrderNumber;
			warrantyClaim.DateOfRepair = this.warrantyClaim.DateOfRepair;
			warrantyClaim.DateOfFailure = this.warrantyClaim.DateOfFailure;
			warrantyClaim.FailureMeasure = this.warrantyClaim.FailureMeasure;
			warrantyClaim.MilIndicator = this.warrantyClaim.MilIndicator;
			warrantyClaim.DTC1 = this.warrantyClaim.DTC1;
			warrantyClaim.DTC2 = this.warrantyClaim.DTC2;
			warrantyClaim.DTC3 = this.warrantyClaim.DTC3;
			warrantyClaim.Technician = this.warrantyClaim.Technician;
			warrantyClaim.ServiceAdvisor = this.warrantyClaim.ServiceAdvisor;
			warrantyClaim.OldSerialNumber = this.warrantyClaim.OldSerialNumber;
			warrantyClaim.NewSerialNumber = this.warrantyClaim.NewSerialNumber;
			warrantyClaim.PartsInstallDate = this.warrantyClaim.PartsInstallDate;
			warrantyClaim.PartsInstallKm = this.warrantyClaim.PartsInstallKm;
			warrantyClaim.OriginalInvoiceNumber = this.warrantyClaim.OriginalInvoiceNumber;
			warrantyClaim.DealerComments = this.warrantyClaim.DealerComments;
			warrantyClaim.DefectCode = this.warrantyClaim.DefectCode;
			warrantyClaim.CustomerConcern = this.warrantyClaim.CustomerConcern;
			warrantyClaim.SymptomCode = this.warrantyClaim.SymptomCode;
			warrantyClaim.VersionIdentifier = this.warrantyClaim.VersionIdentifier;
			warrantyClaim.CurrentVersionNumber = this.warrantyClaim.CurrentVersionNumber;
			warrantyClaim.CurrentVersionCategory = this.warrantyClaim.CurrentVersionCategory;
			
			var warrantyClaimItem = null;
			
			for (var i = 0; i < this.warrantyClaim.Parts.length; i++) {
				warrantyClaimItem = this.warrantyClaim.Parts[i];
				warrantyClaimItem.Quantity = warrantyClaimItem.Quantity.toString();
				delete warrantyClaimItem.isMCPN;
				
				warrantyClaim.WarrantyClaimItems.push(warrantyClaimItem);
			}

			for (var i = 0; i < this.warrantyClaim.Labour.length; i++) {
				warrantyClaimItem = this.warrantyClaim.Labour[i];
				delete warrantyClaimItem.isMCPN;
				warrantyClaim.WarrantyClaimItems.push(warrantyClaimItem);
			}
			
			for (var i = 0; i < this.warrantyClaim.Sublet.length; i++) {
				warrantyClaimItem = this.warrantyClaim.Sublet[i];
				delete warrantyClaimItem.isMCPN;
				warrantyClaim.WarrantyClaimItems.push(warrantyClaimItem);
			}
			return warrantyClaim;
		}, */
		
		resetChanges: function() {
			this.PWAOriginal = jQuery.extend(true, {}, this.PWA);
			this.PWAOriginal.changed = false;
			this.oDataModel.setData(this.PWA);			
		}
	};
});