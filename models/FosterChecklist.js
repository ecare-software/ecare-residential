const mongoose = require("mongoose");
const {Schema} = mongoose;

// File Schema 
const fileSchema = new Schema(
    {
        fileName: {
            type: String,
            // required: true,
        },

        fileUrl: {
            type: String,
            // required: true,
        },

        mimeType: {
            type: String,
        },

        uploadedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {_id: false}
);

// Recurring File Schema 
const recurringFileSchema = new Schema(
    {
        label: {
            type: String,
            // reuqired: true,
        },

        files: [fileSchema]
    }, 
    {_id: false}
);

// Foster ChecklistSchema
const fosterChecklistSchema = new Schema(
    {
        childId: {
            type: Schema.Types.ObjectId,
            ref: "Child",
        },

        childName: String,

        PlacementDate: Date,

        checklist: {
            courtOrders: {type: Boolean, default: false},
            courtSummaries: { type: Boolean, default: false},
            birthCertificate: {type: Boolean, default: false},
            socialSecurityCard: {type: Boolean, default: false},

            levelOfCareAuthorization: {
                type: Boolean,
                default: false,
            },

            ocokPlacementSummary: {
                type: Boolean,
                default: false,
            },

            placementAuthorization: {
                type: Boolean,
                default: false,
            },

            cpsRights: {
                type: Boolean,
                default: false,
            },

            havenPlacementDocuments: {
                type: Boolean,
                default: false, 
            },

            childHandBookAgreement: {
                type: Boolean,
                default: false,
            },

            preferredDeEscalation: {
                type: Boolean,
                default: false,
            },

            personalPropertyInventory: {
                type: Boolean,
                default: false,
            },

            horchAdmissionRequest: {
                type: Boolean,
                default: false,
            },

            commonApplication: {
                type: Boolean,
                default: false,
            },

            childSexualHistory: {
                type: Boolean,
                default: false,
            },

            certificationReceipt: {
                type: Boolean,
                default: false,
            },

            admissionTreatmentPlan: {
                type: Boolean, 
                default: false,
            },

            admissionAssessment: {
                type: Boolean,
                default: false,
            },

            singleChildPlan: {
                type: Boolean,
                default: false,
            },

            initialServicePlan: {
                type: Boolean,
                default: false,
            },

            standardReviews: {
                type: Boolean,
                default: false,
            },

            therapeuticReviews: {
                type: Boolean,
                default: false,
            },

            servicePlanReview: {
                type: Boolean,
                default: false,
            },

            familyServicePlan: {
                type: Boolean,
                default: false,
            },

            eciSpeechTherapy: {
                type: Boolean,
                default: false,
            },

            permanencyPlanning: {
                type: Boolean,
                default: false,
            },

            ocokDisruptionNotice: {
                type: Boolean,
                default: false,
            },

            dischargePlan: {
                type: Boolean,
                default: false,
            },

            childAdolescent: {
                type: Boolean,
                default: false,
            },

            psychologicalPsychiatric: {
                type: Boolean,
                default: false,
            },

            medicalDental: {
                type: Boolean,
                default: false,
            },

            monthlyTherapyNotes: {
                type: Boolean,
                default: false,
            },

            mentalHospitalization: {
                type: Boolean,
                default: false,
            },

            monthlyPsychotropicMedicationLog: {
                type: Boolean,
                default: false,
            },

            medicalProfessionals: {
                type: Boolean,
                default: false,
            },

            medicalConsenter: {
                type: Boolean,
                default: false,
            },

            medicaidCard: {
                type: Boolean,
                default: false,
            },

            healthcareProvider: {
                type: Boolean,
                default: false,
            },

            immunizationReports: {
                type: Boolean,
                default: false,
            },

            tbResults: {
                type: Boolean,
                default: false,
            },

            medicationTreatmentConsent: {
                type: Boolean,
                default: false,
            },

            monthlyMedicationLog: {
                type: Boolean,
                default: false,
            },

            intakeMedication: {
                type: Boolean,
                default: false,
            },

            schoolInformation: {
                type: Boolean,
                default: false,
            },

            designationEducation: {
                type: Boolean,
                default: false,
            },

            schoolEnrollment: {
                type: Boolean,
                default: false,
            },

            reportCards: {
                type: Boolean,
                default: false,
            },

            progressReports: {
                type: Boolean,
                default: false,
            },

            admissonReview: {
                type: Boolean,
                default: false,
            },

            specialEd: {
                type: Boolean,
                default: false,
            },

            testingResults: {
                type: Boolean,
                default: false,
            },

            schoolIncidentReports: {
                type: Boolean,
                default: false,
            },

            schoolWithdrawlForm: {
                type: Boolean,
                default: false,
            },

            previousSchoolInformation: {
                type: Boolean,
                default: false,
            },

            incidentReports: {
                type: Boolean,
                default: false,
            },

            seriousIncidentReport: {
                type: Boolean,
                default: false,
            },

            youthStaff: {
                type: Boolean,
                default: false,
            },

            triggeredReviews: {
                type: Boolean,
                default: false,
            },

            unauthorizedAbsence: {
                type: Boolean,
                default: false,
            },

            absenceTriggered: {
                type: Boolean,
                default: false,
            },

            shiftLogs: {
                type: Boolean,
                default: false,
            },

            clothingAllowance: {
                type: Boolean,
                default: false,
            },

            clothingInventory: {
                type: Boolean,
                default: false,
            },

            monthlyContactNotes: {
                type: Boolean,
                default: false,
            },

            childContactNotes: {
                type: Boolean,
                default: false,
            },

            safetyPlans: {
                type: Boolean,
                default: false,
            },

            releaseObtain: {
                type: Boolean,
                default: false,
            },

            childRequestForm: {
                type: Boolean,
                default: false,
            },

            youthForTomorrow: {
                type: Boolean,
                default: false,
            },
        },

        uploadedFiles: {
            courtOrders: {
                type: [fileSchema],
                default: [],
            },
            courtSummaries: {
                type: [fileSchema],
                default: [],
            },
            admissionTreatmentPlan: {
                type: [fileSchema],
                default: [],
            },
        },
        
        recurringUploads: {
            monthlyTherapyNotes: {
                type: [recurringFileSchema],
                default: [],
            },
            childAdolescent: {
                type: [recurringFileSchema],
                default: [],
            },
            psychologicalPsychiatric: {
                type: [recurringFileSchema],
                default: [],
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
  "FosterChecklist",
  fosterChecklistSchema
);