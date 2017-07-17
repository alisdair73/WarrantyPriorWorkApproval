sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
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
				"OwnerTitle": "",
				"OwnerGivenName": "",
				"OwnerSurname": "",
				"OwnerCompanyName": "",
				"OwnerPhoneNumber": "",
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
				"RequestedLabourSplitOwner": 0,
				"RequestedLabourSplitDealer": 0,
				"RequestedLabourSplitHonda": 0,
				"RequestedPartsSplitOwner": 0,
				"RequestedPartsSplitDealer": 0,
				"RequestedPartsSplitHonda": 0,
				"RequestedSubletSplitOwner": 0,
				"RequestedSubletSplitDealer": 0,
				"RequestedSubletSplitHonda": 0,
				"ApprovedLabourSplitOwner": 0,
				"ApprovedLabourSplitDealer": 0,
				"ApprovedLabourSplitHonda": 0,
				"ApprovedPartsSplitOwner": 0,
				"ApprovedPartsSplitDealer": 0,
				"ApprovedPartsSplitHonda": 0,
				"ApprovedSubletSplitOwner": 0,
				"ApprovedSubletSplitDealer": 0,
				"ApprovedSubletSplitHonda": 0,				
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
				"MCPNItemId": null,
				"SubletItemId": null,
				"PartsItemId": null,
				"LabourItemId": null,
				"changed": false,
				"Attachments": []
			};
			
			this.oDataModel = new JSONModel(this.PWA);
			this.oDataModel.setDefaultBindingMode("TwoWay");
			return this.oDataModel;
		},
		
		updatePWAFromJSONModel: function(jsonModel){

			this.PWA.PWANumber = jsonModel.PWANumber;
			this.PWA.SubmittedOn = jsonModel.SubmittedOn;
			this.PWA.StatusDescription = jsonModel.StatusDescription;
			this.PWA.StatusIcon = jsonModel.StatusIcon;
			this.PWA.VersionIdentifier = jsonModel.VersionIdentifier;
			this.PWA.CurrentVersionNumber = jsonModel.CurrentVersionNumber;
			this.PWA.CurrentVersionCategory = jsonModel.CurrentVersionCategory;
			this.PWA.CanEdit = jsonModel.CanEdit;
			this.PWA.MCPNItemId = jsonModel.MCPNItemId;
			this.PWA.SubletItemId = jsonModel.SubletItemId;
			this.PWA.PartsItemId = jsonModel.PartsItemId;
			this.PWA.LabourItemId = jsonModel.LabourItemId;
			this.PWA.RequestedLabourCost = jsonModel.RequestedLabourCost.toString();
			
			this.PWA.Attachments = jsonModel.Attachments;
			this.resetChanges();
		}, 
		
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
			this.PWA.OwnerTitle = oPWA.OwnerTitle;
			this.PWA.OwnerGivenName = oPWA.OwnerGivenName;
			this.PWA.OwnerSurname = oPWA.OwnerSurname;
			this.PWA.OwnerCompanyName = oPWA.OwnerCompanyName;
			this.PWA.OwnerPhoneNumber = oPWA.OwnerPhoneNumber;
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
			
			this.PWA.RequestedLabourSplitOwner = oPWA.RequestedLabourSplitOwner;
			this.PWA.RequestedLabourSplitDealer = oPWA.RequestedLabourSplitDealer;
			this.PWA.RequestedLabourSplitHonda = oPWA.RequestedLabourSplitHonda;
			this.PWA.RequestedPartsSplitOwner = oPWA.RequestedPartsSplitOwner;
			this.PWA.RequestedPartsSplitDealer = oPWA.RequestedPartsSplitDealer;
			this.PWA.RequestedPartsSplitHonda = oPWA.RequestedPartsSplitHonda;
			this.PWA.RequestedSubletSplitOwner = oPWA.RequestedSubletSplitOwner;
			this.PWA.RequestedSubletSplitDealer = oPWA.RequestedSubletSplitDealer;
			this.PWA.RequestedSubletSplitHonda = oPWA.RequestedSubletSplitHonda;
			
			this.PWA.ApprovedLabourSplitOwner = oPWA.ApprovedLabourSplitOwner;
			this.PWA.ApprovedLabourSplitDealer = oPWA.ApprovedLabourSplitDealer;
			this.PWA.ApprovedLabourSplitHonda = oPWA.ApprovedLabourSplitHonda;
			this.PWA.ApprovedPartsSplitOwner = oPWA.ApprovedPartsSplitOwner;
			this.PWA.ApprovedPartsSplitDealer = oPWA.ApprovedPartsSplitDealer;
			this.PWA.ApprovedPartsSplitHonda = oPWA.ApprovedPartsSplitHonda;
			this.PWA.ApprovedSubletSplitOwner = oPWA.ApprovedSubletSplitOwner;
			this.PWA.ApprovedSubletSplitDealer = oPWA.ApprovedSubletSplitDealer;
			this.PWA.ApprovedSubletSplitHonda = oPWA.ApprovedSubletSplitHonda;
			
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
			this.PWA.MCPNItemId = oPWA.MCPNItemId;
			this.PWA.SubletItemId = oPWA.SubletItemId;
			this.PWA.PartsItemId = oPWA.PartsItemId;
			this.PWA.LabourItemId = oPWA.LabourItemId;
	
			var oAttachments = oODataModel.getObject(sPath + "/Attachments");
			if (oAttachments){
				for (var i = 0; i < oAttachments.length; i++) {
					var oAttachment = oODataModel.getObject("/" + oAttachments[i]);
					oAttachment.URL = "/sap/opu/odata/sap/ZWTY_WARRANTY_CLAIMS_SRV/PriorWorkApprovalSet('" + this.PWA.PWANumber + "')/Attachments('" + oAttachment.DocumentID + "')/$value";
					oAttachment.deleted = false;
					this.PWA.Attachments.push(oAttachment);
				}
			}
			this.resetChanges();
		},
		
		convertToODataForUpdate: function() {
			var PWA = {
				"Attachments" : []
			};
			
			PWA.PWANumber = this.PWA.PWANumber;
			PWA.PWAType = this.PWA.PWAType;
			PWA.VIN = this.PWA.VIN;
			PWA.EngineNumber = this.PWA.EngineNumber;
			PWA.DealerContact = this.PWA.DealerContact;
			PWA.DateOfFailure = this.PWA.DateOfFailure;
			PWA.FailureMeasure = this.PWA.FailureMeasure;
			PWA.MCPN = this.PWA.MCPN;
			PWA.OwnerTitle = this.PWA.OwnerTitle;
			PWA.OwnerGivenName = this.PWA.OwnerGivenName;
			PWA.OwnerSurname = this.PWA.OwnerSurname;
			PWA.OwnerCompanyName = this.PWA.OwnerCompanyName;
			PWA.OwnerPhoneNumber = this.PWA.OwnerPhoneNumber;
			PWA.SoldByDealer = this.PWA.SoldByDealer;
			PWA.HistoryComplete = this.PWA.HistoryComplete;
			PWA.ServicedByDealer = this.PWA.ServicedByDealer;
			PWA.OriginalOwner = this.PWA.OriginalOwner;
			PWA.RequestedLabourHours = this.PWA.RequestedLabourHours.toString();
			PWA.RequestedLabourCost = this.PWA.RequestedLabourCost.toString();
			PWA.RequestedPartsCost = this.PWA.RequestedPartsCost.toString();
			PWA.RequestedSubletCost = this.PWA.RequestedSubletCost.toString();
			
			PWA.RequestedLabourSplitOwner = this.PWA.RequestedLabourSplitOwner.toString();
			PWA.RequestedLabourSplitDealer = this.PWA.RequestedLabourSplitDealer.toString();
			PWA.RequestedLabourSplitHonda = this.PWA.RequestedLabourSplitHonda.toString();
			PWA.RequestedPartsSplitOwner = this.PWA.RequestedPartsSplitOwner.toString();
			PWA.RequestedPartsSplitDealer = this.PWA.RequestedPartsSplitDealer.toString();
			PWA.RequestedPartsSplitHonda = this.PWA.RequestedPartsSplitHonda.toString();
			PWA.RequestedSubletSplitOwner = this.PWA.RequestedSubletSplitOwner.toString();
			PWA.RequestedSubletSplitDealer = this.PWA.RequestedSubletSplitDealer.toString();
			PWA.RequestedSubletSplitHonda = this.PWA.RequestedSubletSplitHonda.toString();
			
			PWA.GoodwillReason = this.PWA.GoodwillReason;
			PWA.CustomerConcern = this.PWA.CustomerConcern;
			PWA.Rectification = this.PWA.Rectification;
			PWA.DealerComment = this.PWA.DealerComment;
			PWA.VersionIdentifier = this.PWA.VersionIdentifier;
			PWA.MCPNItemId = this.PWA.MCPNItemId; 
			PWA.SubletItemId = this.PWA.SubletItemId;
			PWA.PartsItemId = this.PWA.PartsItemId;
			PWA.LabourItemId = this.PWA.LabourItemId;
		
		    if (this.PWA.Attachments){
				for (var i = 0; i < this.PWA.Attachments.length; i++) {
			  		var attachment = this.PWA.Attachments[i];
					delete attachment.__metadata;
					delete attachment.URL;
					PWA.Attachments.push(attachment);
				}	
		    }
			
			return PWA;
		}, 
		
		resetChanges: function() {
			this.PWAOriginal = jQuery.extend(true, {}, this.PWA);
			this.PWAOriginal.changed = false;
			this.oDataModel.setData(this.PWA);			
		}
	};
});