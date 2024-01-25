/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SeekerBasic } from './seekerBasic/seekerBasic';
import { SeekerProgress } from './seekerProgress/seekerProgress';
import { TherapistBasic } from './therapistBasic.ts/therapistBasic';
import { PresentingProblem } from './seekerCaseHistory/presentingProblem';
import { BasicDemographicDetails } from './seekerCaseHistory/basicDemographicDetails';
import { EmergencyContact } from './seekerCaseHistory/emergencyContact';
import { FamilyHistory } from './seekerCaseHistory/familyHistory';
import { SubstanceUsage } from './seekerCaseHistory/substanceUsage';
import { PremorbidPersonality } from './seekerCaseHistory/premorbidPersonality';
import { SexualHistory } from './seekerCaseHistory/sexualHistory';
import { PersonalHistory } from './seekerCaseHistory/personalHistory';
import { PeersAndSocialHistory } from './seekerCaseHistory/peersAndSocialHistory';
import { WorkAndCareer } from './seekerCaseHistory/workCareer';
import { ProvisionalDiagnosis } from './seekerCaseHistory/provisionalDiagnosis';
import { DifferentialDiagnosis } from './seekerCaseHistory/differentialDiagnosis';
import { MSE } from './seekerCaseHistory/mse';
import { LoggerService } from 'src/logger.service';

@Injectable()
export class CrudService {
    prisma = new PrismaClient();
    private seekerBasic = new SeekerBasic();
    private seekerProgress = new SeekerProgress();
    private therapistBasic = new TherapistBasic();
    private presentingProblem = new PresentingProblem();
    private basicDemographicDetails = new BasicDemographicDetails();
    private emergencyContact = new EmergencyContact();
    private familyHistory = new FamilyHistory();
    private substanceUsage = new SubstanceUsage();
    private premordbidPersonality = new PremorbidPersonality();
    private sexualHistory = new SexualHistory();
    private personalHistory = new PersonalHistory();
    private peersAndSocialHistory = new PeersAndSocialHistory();
    private workAndCareer = new WorkAndCareer();
    private provisionalDiagnosis = new ProvisionalDiagnosis();
    private differentialDiagnosis = new DifferentialDiagnosis();
    private mse = new MSE();

    //Logger
    private logger: LoggerService;

    // Default constructor creates a default logger
    constructor(logger?: LoggerService) {
        this.logger = logger || new LoggerService();
    }
    //
    // THERAPIST CREATE UPDATE
    //

    async createNewTherapist(data): Promise<any> {
        return this.therapistBasic.createNewTherapist(data);
    }

    async updateExistingTherapist(data: {
        clerkUserId: string;
        updatedData: any;
    }): Promise<any> {
        return this.therapistBasic.updateExistingTherapist(data);
    }

    //
    // SEEKER CREATE UPDATE GET
    //

    // Function to create new seeker and associated clinical history. All the clinical history tables would be empty
    async createNewSeekerAndClinicalHistory(data: {
        clerkUserId: string;
        seekerData: any;
    }): Promise<any> {
        // Fetch the session to get the associated user
        return this.seekerBasic.createNewSeekerAndClinicalHistory(data);
    }

    async updateExistingSeekerAndClinicalInformation(data: {
        seekerId: string;
        updatedSeekerData: any;
    }): Promise<any> {
        return this.seekerBasic.updateExistingSeekerAndClinicalInformation(data);
    }

    async getAllSeekers(clerkUserId: string): Promise<any> {
        return this.seekerBasic.getAllSeekers(clerkUserId);
    }

    async getAllSeekersCohortCards(clerkUserId: string): Promise<any> {
        return this.seekerBasic.getAllSeekersCohortCards(clerkUserId);
    }

    //
    // SEEKER PROGRESS CREATE GET EDIT DELETE
    //

    async createSeekerProgress(data: {
        seekerId: string;
        progressSubject: string;
        progressBody: string;
    }): Promise<any> {
        return this.seekerProgress.createSeekerProgress(data);
    }

    async getSeekerProgress(seekerId: string): Promise<any> {
        return this.seekerProgress.getSeekerProgress(seekerId);
    }

    async editSeekerProgress(data: {
        seekerProgressId: string;
        progressSubject: string;
        progressBody: string;
    }): Promise<any> {
        return this.seekerProgress.editSeekerProgress(data);
    }

    async deleteSeekerProgress(data: { seekerProgressId: string }): Promise<any> {
        return this.seekerProgress.deleteSeekerProgress(data);
    }

    //
    // SEEKER CASE HISTORY
    //

    // PRESENTING PROBLEM
    // CREATE GET UPDATE
    async createPresentingProblem(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.presentingProblem.createPresentingProblem(params);
    }

    async getPresentingProblem(seekerId: string): Promise<any> {
        return this.presentingProblem.getPresentingProblem(seekerId);
    }

    async updatePresentingProblem(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.presentingProblem.updatePresentingProblem(params);
    }

    // BASIC DEMOGRAPHIC DETAILS
    // CREATE GET UPDATE

    async createBasicDemographicDetails(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        // Create BasicDemographicDetails record
        return this.basicDemographicDetails.createBasicDemographicDetails(params);
    }

    async getBasicDemographicDetails(seekerId: string): Promise<any> {
        return this.basicDemographicDetails.getBasicDemographicDetails(seekerId);
    }

    async updateBasicBasicDemographicDetails(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.basicDemographicDetails.updateBasicBasicDemographicDetails(
            params,
        );
    }

    // EMERGENCY CONTACT
    // CREATE GET UPDATE

    async createEmergencyContact(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.emergencyContact.createEmergencyContact(params);
    }

    async getEmergencyContact(seekerId: string): Promise<any> {
        return this.emergencyContact.getEmergencyContact(seekerId);
    }

    async updateEmergencyContact(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.emergencyContact.updateEmergencyContact(params);
    }

    // FAMILY HISTORY
    // CREATE GET UPDATE
    async createFamilyHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.familyHistory.createFamilyHistory(params);
    }

    async getFamilyHistory(seekerId: string): Promise<any> {
        return this.familyHistory.getFamilyHistory(seekerId);
    }

    async updateFamilyHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.familyHistory.updateFamilyHistory(params);
    }

    // SUBSTANCE USAGE
    // CREATE GET UPDATE

    async getSubstanceUsage(seekerId: string): Promise<any> {
        return this.substanceUsage.getSubstanceUsage(seekerId);
    }

    async createSubstanceUsage(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.substanceUsage.createSubstanceUsage(params);
    }

    async updateSubstanceUsage(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.substanceUsage.updateSubstanceUsage(params);
    }

    // PREMORBID PERSONALITY
    // CREATE GET UPDATE

    async createPreMorbidPersonality(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.premordbidPersonality.createPreMorbidPersonality(params);
    }

    async getPreMorbidPersonality(seekerId: string): Promise<any> {
        return this.premordbidPersonality.getPreMorbidPersonality(seekerId);
    }

    async updatePreMorbidPersonality(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.premordbidPersonality.updatePreMorbidPersonality(params);
    }

    // SEXUAL HISTORY
    // CREATE GET UPDATE

    async createSexualHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.sexualHistory.createSexualHistory(params);
    }

    async getSexualHistory(seekerId: string): Promise<any> {
        return this.sexualHistory.getSexualHistory(seekerId);
    }

    async updateSexualHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.sexualHistory.updateSexualHistory(params);
    }

    // PERSONAL HISTORY
    // CREATE GET UPDATE

    async createPersonalHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.personalHistory.createPersonalHistory(params);
    }

    async getPersonalHistory(seekerId: string): Promise<any> {
        return this.personalHistory.getPersonalHistory(seekerId);
    }

    async updatePersonalHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.personalHistory.updatePersonalHistory(params);
    }

    // PEERS AND SOCIAL HISTORY
    // CREATE GET UPDATE

    async createPeersAndSocialHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.peersAndSocialHistory.createPeersAndSocialHistory(params);
    }

    async getPeersAndSocialHistory(seekerId: string): Promise<any> {
        return this.peersAndSocialHistory.getPeersAndSocialHistory(seekerId);
    }

    async updatePeersAndSocialHistory(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.peersAndSocialHistory.updatePeersAndSocialHistory(params);
    }

    // WORK CAREER
    // CREATE GET UPDATE

    async createWorkCareer(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.workAndCareer.createWorkCareer(params);
    }

    async getWorkCareer(seekerId: string): Promise<any> {
        return this.workAndCareer.getWorkCareer(seekerId);
    }

    async updateWorkCareer(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.workAndCareer.updateWorkCareer(params);
    }

    // PROVISIONAL DIAGNOSIS
    // CREATE GET UPDATE
    async getProvisionalDiagnosis(seekerId: string): Promise<any> {
        return this.provisionalDiagnosis.getProvisionalDiagnosis(seekerId);
    }

    async createProvisionalDiagnosis(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.provisionalDiagnosis.createProvisionalDiagnosis(params);
    }

    async updateProvisionalDiagnosis(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.provisionalDiagnosis.updateProvisionalDiagnosis(params);
    }

    // DIFFERENTIAL DIAGNOSIS
    // CREATE GET UPDATE
    async createDifferentialDiagnosis(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.differentialDiagnosis.createDifferentialDiagnosis(params);
    }

    async getDifferentialDiagnosis(seekerId: string): Promise<any> {
        return this.differentialDiagnosis.getDifferentialDiagnosis(seekerId);
    }

    async updateDifferentialDiagnosis(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.differentialDiagnosis.updateDifferentialDiagnosis(params);
    }

    // MSE
    // CREATE GET UPDATE

    async createMentalStatusExamination(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.mse.createMentalStatusExamination(params);
    }

    async getMentalStatusExamination(seekerId: string): Promise<any> {
        return this.mse.getMentalStatusExamination(seekerId);
    }

    async updateMentalStatusExamination(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        return this.mse.updateMentalStatusExamination(params);
    }

    // INTAKE INFORMATION
    //

    async getIntakeInformation(seekerId: string): Promise<any> {
        try {
            this.logger.log('Getting Intake Information');

            const data = await this.prisma.seekers.findMany({
                where: { id: seekerId },
                include: {
                    IntakeInformation: {
                        select: {
                            name: true,
                            keyTherapist: true,
                            statusOfInformedConsent: true,
                            currentFees: true,
                            slidingScale: true,
                            mediumOfTherapy: true,
                            reference: true,
                            intakeClinician: true,
                            psychiatrist: true,
                        },
                    },
                },
            });

            // Map it as according to how you want it to be rendered on frontend
            interface InterfaceData {
                clientId: string;
                name: string;
                keyTherapist: string;
                informedConsentStatus: string;
                currentFees: string;
                SlidingScale: string;
                mediumOfTherapy: string;
                reference: string;
                intakeClinician: string;
                psychiatrist: string;
                yourComments: string;
            }

            // Transform the data to be sent to frontend
            function transformData(sourceArray: any): InterfaceData[] {
                return sourceArray.map((item) => ({
                    clientId: seekerId,
                    name: item.IntakeInformation.name,
                    keyTherapist: item.IntakeInformation.keyTherapist,
                    informedConsentStatus: item.IntakeInformation.statusOfInformedConsent,
                    currentFees: item.IntakeInformation.currentFees,
                    SlidingScale: item.IntakeInformation.slidingScale,
                    mediumOfTherapy: item.IntakeInformation.mediumOfTherapy,
                    reference: item.IntakeInformation.reference,
                    intakeClinician: item.IntakeInformation.intakeClinician,
                    psychiatrist: item.IntakeInformation.psychiatrist,
                    yourComments: item.IntakeInformation.yourComments,
                }));
            }

            const transformedData = transformData(data);
            return transformedData;
        } catch (error) {
            this.logger.error('Error getting Intake Information', error.stack);

            throw error;
        }
    }

    async createIntakeInformation(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        try {
            // Create IntakeInformation record
            this.logger.log('Creating Intake Information');

            const intakeInformation = await this.prisma.intakeInformation.create({
                data: {
                    name: params.seekerData.IntakeInformation.name,
                    keyTherapist: params.seekerData.IntakeInformation.keyTherapist,
                    statusOfInformedConsent:
                        params.seekerData.IntakeInformation.statusOfInformedConsent,
                    currentFees: params.seekerData.IntakeInformation.currentFees,
                    slidingScale: params.seekerData.IntakeInformation.slidingScale,
                    mediumOfTherapy: params.seekerData.IntakeInformation.mediumOfTherapy,
                    reference: params.seekerData.IntakeInformation.reference,
                    intakeClinician: params.seekerData.IntakeInformation.intakeClinician,
                    psychiatrist: params.seekerData.IntakeInformation.psychiatrist,
                    seekerId: params.seekerId,
                },
            });

            // Return the created IntakeInformation data
            return intakeInformation;
        } catch (error) {
            this.logger.error('Error creating Intake Information', error.stack);

            throw error;
        }
    }

    async updateIntakeInformation(params: {
        seekerId: string;
        seekerData: any;
    }): Promise<any> {
        try {
            this.logger.log('Updating Intake contact');

            // Transforming the incoming seekerData into the format expected by Prisma
            const transformedUpdatedData = {
                IntakeInformation: {
                    name: params.seekerData?.name ?? null,
                    keyTherapist: params.seekerData?.keyTherapist ?? null,
                    statusOfInformedConsent:
                        params.seekerData?.informedConsentStatus ?? null,
                    currentFees: params.seekerData?.currentFees ?? null,
                    slidingScale: params.seekerData?.SlidingScale ?? null,
                    mediumOfTherapy: params.seekerData?.mediumOfTherapy ?? null,
                    reference: params.seekerData?.reference ?? null,
                    intakeClinician: params.seekerData?.intakeClinician ?? null,
                    psychiatrist: params.seekerData?.psychiatrist ?? null,
                    // yourComments: params.seekerData.yourComments
                },
            };

            // Updating the IntakeInformation in the database
            const updatedIntakeInformation = await this.prisma.seekers.update({
                where: { id: params.seekerId },
                data: {
                    IntakeInformation: {
                        update: {
                            data: transformedUpdatedData.IntakeInformation,
                        },
                    },
                },
                include: {
                    IntakeInformation: true,
                },
            });

            return updatedIntakeInformation;
        } catch (error) {
            this.logger.error('Error updating Intake Information', error.stack);

            throw error;
        }
    }
}
