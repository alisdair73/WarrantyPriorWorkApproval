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
				"LaborSplitOwner": 0,
				"LaborSplitDealer": 0,
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
				"Attachments": [
					{
						"documentId": "12345",
						"fileName": "test.pdf",
						"mimeType": "application/pdf",
						"url":"test.pdf",
						"enableDelete": true
					},
					{
						"documentId": "54321",
						"fileName": "A new file.xls",
						"mimeType": "application/msexcel",
						"url":"test.pdf",
						"enableDelete": true
					}
				]
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
		},
		
		updatePWAFromOdata: function(oServerOData) {
			
			var oSource = oServerOData.getSource ? oServerOData.getSource() : oServerOData;
			var oODataModel = oSource.getModel();
			var sPath = oSource.getPath();
			var oWarrantyClaim = oODataModel.getObject(sPath);
		
			this.warrantyClaim.ClaimNumber = oWarrantyClaim.ClaimNumber;
			this.warrantyClaim.ClaimType = oWarrantyClaim.ClaimType;
			this.warrantyClaim.ClaimTypeDescription = oWarrantyClaim.ClaimTypeDescription;
			this.warrantyClaim.ClaimTypeGroup = oWarrantyClaim.ClaimTypeGroup;
			this.warrantyClaim.DealerContact = oWarrantyClaim.DealerContact;
			this.warrantyClaim.EngineNumber = oWarrantyClaim.EngineNumber;
			this.warrantyClaim.AuthorisationNumber = oWarrantyClaim.AuthorisationNumber;
			this.warrantyClaim.VIN = oWarrantyClaim.VIN;
			this.warrantyClaim.RecallNumber = oWarrantyClaim.RecallNumber;
			this.warrantyClaim.RepairOrderNumber = oWarrantyClaim.RepairOrderNumber;
			this.warrantyClaim.ClaimCurrency = oWarrantyClaim.ClaimCurrency;
			this.warrantyClaim.SubmittedOn = oWarrantyClaim.SubmittedOn;
			this.warrantyClaim.DateOfRepair = oWarrantyClaim.DateOfRepair;
			this.warrantyClaim.DateOfFailure = oWarrantyClaim.DateOfFailure;
			this.warrantyClaim.FailureMeasure = oWarrantyClaim.FailureMeasure;
			this.warrantyClaim.MilIndicator = oWarrantyClaim.MilIndicator;
			this.warrantyClaim.DTC1 = oWarrantyClaim.DTC1;
			this.warrantyClaim.DTC2 = oWarrantyClaim.DTC2;
			this.warrantyClaim.DTC3 = oWarrantyClaim.DTC3;
			this.warrantyClaim.Technician = oWarrantyClaim.Technician;
			this.warrantyClaim.ServiceAdvisor = oWarrantyClaim.ServiceAdvisor;
			this.warrantyClaim.OldSerialNumber = oWarrantyClaim.OldSerialNumber;
			this.warrantyClaim.NewSerialNumber = oWarrantyClaim.NewSerialNumber;
			this.warrantyClaim.PartsInstallDate = oWarrantyClaim.PartsInstallDate;
			this.warrantyClaim.PartsInstallKm = oWarrantyClaim.PartsInstallKm;
			this.warrantyClaim.OriginalInvoiceNumber = oWarrantyClaim.OriginalInvoiceNumber;
			this.warrantyClaim.DealerComments = oWarrantyClaim.DealerComments;
			this.warrantyClaim.DefectCode = oWarrantyClaim.DefectCode;
			this.warrantyClaim.CustomerConcern = oWarrantyClaim.CustomerConcern;
			this.warrantyClaim.SymptomCode = oWarrantyClaim.SymptomCode;
			this.warrantyClaim.AssessmentComments = oWarrantyClaim.AssessmentComments;
			this.warrantyClaim.AssessmentResults = oWarrantyClaim.AssessmentResults;
			this.warrantyClaim.CurrentVersionNumber = oWarrantyClaim.CurrentVersionNumber;
			this.warrantyClaim.CurrentVersionCategory = oWarrantyClaim.CurrentVersionCategory;
			this.warrantyClaim.TotalMaterial = oWarrantyClaim.TotalMaterial;
			this.warrantyClaim.TotalExternalServices = oWarrantyClaim.TotalExternalServices;
			this.warrantyClaim.TotalLabour = oWarrantyClaim.TotalLabour;
			this.warrantyClaim.StatusDescription = oWarrantyClaim.StatusDescription;
			this.warrantyClaim.StatusIcon = oWarrantyClaim.StatusIcon;
			this.warrantyClaim.CanEdit = oWarrantyClaim.CanEdit;
			this.warrantyClaim.VersionIdentifier = oWarrantyClaim.VersionIdentifier;
			
			var oWarrantyClaimItems = oODataModel.getObject(sPath + "/WarrantyClaimItems");
			if (oWarrantyClaimItems){
				for (var i = 0; i < oWarrantyClaimItems.length; i++) {
					var oWarrantyClaimItem = oODataModel.getObject("/" + oWarrantyClaimItems[i]);
					switch(oWarrantyClaimItem.ItemType) {
    					case "MAT":
    						if(this.warrantyClaim.Parts.length === 0){
    							oWarrantyClaimItem.isMCPN = true;
    						}
    						this.warrantyClaim.Parts.push(oWarrantyClaimItem);
				        	break;
				    	case "FR":
				    		this.warrantyClaim.Labour.push(oWarrantyClaimItem);
				    	  break;
				    	case "SUBL":
				    		this.warrantyClaim.Sublet.push(oWarrantyClaimItem);
				    	 break;
					}
				} 
			}
			
			this.resetChanges();
		},
		
		convertToODataForUpdate: function() {
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