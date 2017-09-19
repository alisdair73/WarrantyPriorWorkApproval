sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"hnd/dpe/warranty/prior_work_approval/model/validationRules",
	"sap/ui/core/format/DateFormat"
], function(JSONModel, Rule, DateFormat) {
	"use strict";

	return {
		oDataModel: null,
		PWA: {},
		PWAOriginal: {},
		
		createPWAModel: function(oData) {
			this.PWA = {
				"PWANumber": "",
				"PWAType": "",
				"ObjectType":"",
				"SalesOrg":"",
				"PrecedingPWANumber":"", 
				"ExternalObjectNumber": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"ExternalObjectDescription":"",
				"ExternalObjectModelCode":"",
				"SubmittedOn": null,
				"EngineNumber": "",
				"DealerContact": "",
				"DateOfFailure": { "value":null, "ruleResult":{"valid": true, "errorTextID":""}},
				"FailureMeasure": "0",
				"MCPN": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"OwnerTitle": "",
				"OwnerGivenName": "",
				"OwnerSurname": "",
				"OwnerCompanyName": "",
				"OwnerPhoneNumber": "",
				"SoldByDealer": false,
				"HistoryComplete": false,
				"ServicedByDealer": false,
				"OriginalOwner": false,
				"RequestedTotalCost": { "value": 0, "ruleResult":{"valid": true, "errorTextID":""}},
				"RequestedLabourHours": { "value": 0, "ruleResult":{"valid": true, "errorTextID":""}},
				"RequestedLabourCost": 0,
				"RequestedPartsCost": 0,
				"RequestedSubletCost": 0,
				"ApprovedLabourHours": 0,
				"ApprovedLabourCost": 0,
				"ApprovedPartsCost": 0,
				"ApprovedSubletCost": 0,
				"RequestedLabourSplitOwner": 0,
				"RequestedLabourSplitDealer": 0,
				"RequestedLabourSplitHonda": 100,
				"RequestedPartsSplitOwner": 0,
				"RequestedPartsSplitDealer": 0,
				"RequestedPartsSplitHonda": 100,
				"RequestedSubletSplitOwner": 0,
				"RequestedSubletSplitDealer": 0,
				"RequestedSubletSplitHonda": 100,
				"ApprovedLabourSplitOwner": 0,
				"ApprovedLabourSplitDealer": 0,
				"ApprovedLabourSplitHonda": 0,
				"ApprovedPartsSplitOwner": 0,
				"ApprovedPartsSplitDealer": 0,
				"ApprovedPartsSplitHonda": 0,
				"ApprovedSubletSplitOwner": 0,
				"ApprovedSubletSplitDealer": 0,
				"ApprovedSubletSplitHonda": 0,				
				"GoodwillReason": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"CustomerConcern": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"Rectification": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"DealerComment": { "value":"", "ruleResult":{"valid": true, "errorTextID":""}},
				"AssessmentComments": "",
				"AssessmentCodes": "",
				"PWATypeDescription": "",
				"PWATypeGroup": "",
				"Status":"0001",
				"StatusDescription": "",
				"StatusIcon": "",
				"MCPNDescription": "",
				"VersionIdentifier": null,
				"CurrentVersionNumber":"0001",
				"CurrentVersionCategory":"IC",
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
		
		updatePWAFromJSONModel: function(jsonModel, validateMode){

			this.PWA.PWANumber = jsonModel.PWANumber;
			this.PWA.SubmittedOn = jsonModel.SubmittedOn;
			this.PWA.Status = jsonModel.Status;
			this.PWA.StatusDescription = jsonModel.StatusDescription;
			this.PWA.StatusIcon = jsonModel.StatusIcon;
			this.PWA.VersionIdentifier = jsonModel.VersionIdentifier;
			this.PWA.CurrentVersionNumber = jsonModel.CurrentVersionNumber;
			this.PWA.CurrentVersionCategory = jsonModel.CurrentVersionCategory;
			this.PWA.RequestedLabourCost = jsonModel.RequestedLabourCost.toString();
			this.PWA.CanEdit = jsonModel.CanEdit;
			
			if(!validateMode){
				this.PWA.MCPNItemId = jsonModel.MCPNItemId;
				this.PWA.SubletItemId = jsonModel.SubletItemId;
				this.PWA.PartsItemId = jsonModel.PartsItemId;
				this.PWA.LabourItemId = jsonModel.LabourItemId;
			}
			
			this.resetChanges();
		}, 
		
		updatePWAFromOdata: function(oServerOData) {
			
			var oSource = oServerOData.getSource ? oServerOData.getSource() : oServerOData;
			var oODataModel = oSource.getModel();
			var sPath = oSource.getPath();
			var oPWA = oODataModel.getObject(sPath);
		
			this.PWA.PWANumber = oPWA.PWANumber;
			this.PWA.PWAType = oPWA.PWAType;
			this.PWA.ObjectType = oPWA.ObjectType;
			this.PWA.SubmittedOn = oPWA.SubmittedOn;
			this.PWA.SalesOrg = oPWA.SalesOrg;
			this.PWA.PrecedingPWANumber = oPWA.PrecedingPWANumber;
			this.PWA.ExternalObjectNumber.value = oPWA.ExternalObjectNumber;
			this.PWA.ExternalObjectDescription = oPWA.ExternalObjectDescription;
			this.PWA.ExternalObjectModelCode = oPWA.ExternalObjectModelCode;
			this.PWA.EngineNumber = oPWA.EngineNumber;
			this.PWA.DealerContact = oPWA.DealerContact;
			this.PWA.DateOfFailure.value = oPWA.DateOfFailure;
			this.PWA.FailureMeasure = oPWA.FailureMeasure;
			this.PWA.MCPN.value = oPWA.MCPN;
			this.PWA.OwnerTitle = oPWA.OwnerTitle;
			this.PWA.OwnerGivenName = oPWA.OwnerGivenName;
			this.PWA.OwnerSurname = oPWA.OwnerSurname;
			this.PWA.OwnerCompanyName = oPWA.OwnerCompanyName;
			this.PWA.OwnerPhoneNumber = oPWA.OwnerPhoneNumber;
			this.PWA.SoldByDealer = oPWA.SoldByDealer;
			this.PWA.HistoryComplete = oPWA.HistoryComplete;
			this.PWA.ServicedByDealer = oPWA.ServicedByDealer;
			this.PWA.OriginalOwner = oPWA.OriginalOwner;
			this.PWA.RequestedLabourHours.value = oPWA.RequestedLabourHours;
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
			this.PWA.GoodwillReason.value = oPWA.GoodwillReason;
			this.PWA.CustomerConcern.value = oPWA.CustomerConcern;
			this.PWA.Rectification.value = oPWA.Rectification;
			this.PWA.DealerComment.value = oPWA.DealerComment;
			this.PWA.AssessmentComments = oPWA.AssessmentComments;
			this.PWA.AssessmentCodes = oPWA.AssessmentCodes;
			this.PWA.PWATypeDescription = oPWA.PWATypeDescription;
			this.PWA.PWATypeGroup = oPWA.PWATypeGroup;
			this.PWA.Status = oPWA.Status;
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
			PWA.ObjectType = this.PWA.ObjectType;
			PWA.SalesOrg = this.PWA.SalesOrg;
			PWA.ExternalObjectNumber = this.PWA.ExternalObjectNumber.value;
			PWA.EngineNumber = this.PWA.EngineNumber;
			PWA.DealerContact = this.PWA.DealerContact;
			PWA.DateOfFailure = this.PWA.DateOfFailure.value;
			PWA.FailureMeasure = this.PWA.FailureMeasure;
			PWA.MCPN = this.PWA.MCPN.value;
			PWA.OwnerTitle = this.PWA.OwnerTitle;
			PWA.OwnerGivenName = this.PWA.OwnerGivenName;
			PWA.OwnerSurname = this.PWA.OwnerSurname;
			PWA.OwnerCompanyName = this.PWA.OwnerCompanyName;
			PWA.OwnerPhoneNumber = this.PWA.OwnerPhoneNumber;
			PWA.SoldByDealer = this.PWA.SoldByDealer;
			PWA.HistoryComplete = this.PWA.HistoryComplete;
			PWA.ServicedByDealer = this.PWA.ServicedByDealer;
			PWA.OriginalOwner = this.PWA.OriginalOwner;
			PWA.RequestedLabourHours = this.PWA.RequestedLabourHours.value.toString();
			PWA.RequestedLabourCost = this.PWA.RequestedLabourCost.toString();
			PWA.RequestedPartsCost = this.PWA.RequestedPartsCost.toString();
			PWA.RequestedSubletCost = this.PWA.RequestedSubletCost.toString();
			PWA.RequestedLabourSplitOwner = this.PWA.RequestedLabourSplitOwner;
			PWA.RequestedLabourSplitDealer = this.PWA.RequestedLabourSplitDealer;
			PWA.RequestedLabourSplitHonda = this.PWA.RequestedLabourSplitHonda;
			PWA.RequestedPartsSplitOwner = this.PWA.RequestedPartsSplitOwner;
			PWA.RequestedPartsSplitDealer = this.PWA.RequestedPartsSplitDealer;
			PWA.RequestedPartsSplitHonda = this.PWA.RequestedPartsSplitHonda;
			PWA.RequestedSubletSplitOwner = this.PWA.RequestedSubletSplitOwner;
			PWA.RequestedSubletSplitDealer = this.PWA.RequestedSubletSplitDealer;
			PWA.RequestedSubletSplitHonda = this.PWA.RequestedSubletSplitHonda;
			PWA.GoodwillReason = this.PWA.GoodwillReason.value;
			PWA.CustomerConcern = this.PWA.CustomerConcern.value;
			PWA.Rectification = this.PWA.Rectification.value;
			PWA.DealerComment = this.PWA.DealerComment.value;
			PWA.VersionIdentifier = this.PWA.VersionIdentifier;
			PWA.MCPNItemId = this.PWA.MCPNItemId; 
			PWA.SubletItemId = this.PWA.SubletItemId;
			PWA.PartsItemId = this.PWA.PartsItemId;
			PWA.LabourItemId = this.PWA.LabourItemId;
		
		    if (this.PWA.Attachments){
				for (var i = 0; i < this.PWA.Attachments.length; i++) {
			  		var attachment = {
			  			"DocumentID": this.PWA.Attachments[i].DocumentID,
		    			"MimeType": this.PWA.Attachments[i].MimeType,
		    			"FileName": this.PWA.Attachments[i].FileName,
		    			"deleted": this.PWA.Attachments[i].deleted
			  		};
					PWA.Attachments.push(attachment);
				}	
		    }
			
			return PWA;
		}, 
		
		resetChanges: function() {
			this.PWAOriginal = jQuery.extend(true, {}, this.PWA);
			this.PWAOriginal.changed = false;
			this.oDataModel.setData(this.PWA);			
		},
		
		validateExternalObjectNumber: function(){
			this.PWA.ExternalObjectNumber.ruleResult = 
				Rule.validateRequiredFieldIsPopulated(this.PWA.ExternalObjectNumber.value);
		},
		
		validateMCPN: function(){
			this.PWA.MCPN.ruleResult = 
				Rule.validateRequiredFieldIsPopulated(this.PWA.MCPN.value);
		},
		
		validateDateOfFailure: function(){
			
			if(this.PWA.DateOfFailure.value){
				this.PWA.DateOfFailure.value = this._convertDateTimeToDateOnly(this.PWA.DateOfFailure.value);
				
				this.PWA.DateOfFailure.ruleResult = Rule.validateRequiredFieldIsPopulated(this.PWA.DateOfFailure.value);
				if(this.PWA.DateOfFailure.ruleResult.valid){
					this.PWA.DateOfFailure.ruleResult = Rule.validateDateIsNotFutureDate(this.PWA.DateOfFailure.value);
					
					if(this.PWA.DateOfFailure.ruleResult.valid){
						this.PWA.DateOfFailure.ruleResult = Rule.validateDateIsNotMoreThan60DaysPrior(this.PWA.DateOfFailure.value);
					}
				}
				
			} else {
				this.PWA.DateOfFailure.ruleResult = {"valid": false, "errorTextID":"mandatoryField"};
			}
		},             
		
		validateCustomerConcern :function(){
			this.PWA.CustomerConcern.ruleResult = 
				Rule.validateRequiredFieldIsPopulated(this.PWA.CustomerConcern.value); 
		},
		
		validateDealerComment:function(){
			this.PWA.DealerComment.ruleResult = 
				Rule.validateRequiredFieldIsPopulated(this.PWA.DealerComment.value); 
		},
	
		validateRectification:function(){
		
			switch(this.PWA.PWATypeGroup){
				case "NORMAL":
					break;
				case "GOODWILL":
					this.PWA.Rectification.ruleResult = 
						Rule.validateRequiredFieldIsPopulated(this.PWA.Rectification.value); 
					break;
			}
		},	
		
		validateGoodwillReason:function(){
			
			switch(this.PWA.PWATypeGroup){
				case "NORMAL":
					break;
				case "GOODWILL":
					this.PWA.GoodwillReason.ruleResult = 
						Rule.validateRequiredFieldIsPopulated(this.PWA.GoodwillReason.value); 
			}
		},
		
		validateRequestedLabourHours: function(){
			var validated = true;
			
			this.PWA.RequestedLabourHours.ruleResult = Rule.validateIsANumber(this.PWA.RequestedLabourHours.value); 
			if(this.PWA.RequestedLabourHours.ruleResult.valid){
				if(this.PWA.RequestedLabourHours.value > 99.99){
					validated = false;
				}
				this.PWA.RequestedLabourHours.ruleResult = {"valid": validated, "errorTextID":"requestedLabourHoursToBig"};
			}
		},		
		
		validateTotalCostIsGreaterThanZero: function(){
			
			var validated = true;
			
			if( this.PWA.RequestedTotalCost.value <= 0){
              validated = false;
			}
			this.PWA.RequestedTotalCost.ruleResult = {"valid": validated, "errorTextID":"claimIsZero"}; 

		},
		
		validateAll: function(){
			this.validateExternalObjectNumber();
			this.validateMCPN();
			this.validateDateOfFailure();
			this.validateCustomerConcern();
			this.validateDealerComment();
			this.validateGoodwillReason();
			this.validateRectification();
			this.validateRequestedLabourHours();
//			this.validateTotalCostIsGreaterThanZero(); DETERMINED VIA BACK END
		},
		
		hasFrontendValidationError: function(){
			
			if(this.PWA.ExternalObjectNumber.ruleResult.valid &&
				this.PWA.MCPN.ruleResult.valid &&
				this.PWA.DateOfFailure.ruleResult.valid &&
				this.PWA.CustomerConcern.ruleResult.valid &&
				this.PWA.DealerComment.ruleResult.valid &&
				this.PWA.GoodwillReason.ruleResult.valid &&
				this.PWA.Rectification.ruleResult.valid &&
				this.PWA.RequestedLabourHours.ruleResult.valid){
				
				return false;		
			} 
			return true;
		},
		
		_convertDateTimeToDateOnly: function(dateTime) {
			
			var dateTemplate = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});
			var formattedDateTime = dateTemplate.format(dateTime);
			formattedDateTime  = formattedDateTime.split("T");
			var formattedDate = formattedDateTime[0];
			return new Date(formattedDate);
		}
		
	};
});