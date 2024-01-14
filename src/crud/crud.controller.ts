import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CrudService } from './crud.service';


@Controller('crud')
export class CrudController {
    constructor(private readonly crudService: CrudService) { }

    // Gets all the seekers associated with a clerkUserId
    @Get('get-all-seekers/:clerkUserId')
    getAllSeekers(@Param('clerkUserId') clerkUserId: string): Promise<any> {
        return this.crudService.getAllSeekers(clerkUserId);
    }

    // Gets all the seekers cohort cards associated with a clerkUserId
    @Get('get-all-seekers-cohort-cards/:clerkUserId')
    getAllSeekersCohortCards(@Param('clerkUserId') clerkUserId: string): Promise<any> {
        return this.crudService.getAllSeekersCohortCards(clerkUserId);
    }

    // Gets all the progress items for a seeker 
    @Get('get-seeker-progress/:seekerId')
    getSeekerProgress(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getSeekerProgress(seekerId);
    }

    // Creates a new seeker progress item
    @Post('create-seeker-progress/:seekerId')
    createSeekerProgress(
        @Param('seekerId') seekerId: string,
        @Body() data: { progressSubject: string, progressBody: string },
    ): Promise<any> {
        const createData = { ...data, seekerId };
        return this.crudService.createSeekerProgress(createData);
    }

    // Edits a seeker progress item
    @Post('edit-seeker-progress/:seekerProgressId')
    editSeekerProgress(
        @Param('seekerId') seekerProgressId: string,
        @Body() data: { progressSubject: string, progressBody: string },
    ): Promise<any> {
        const createData = { ...data, seekerProgressId };
        return this.crudService.editSeekerProgress(createData);
    }

    // Deletes a seeker progress item
    @Post('delete-seeker-progress/:seekerProgressId')
    deleteSeekerProgress(
        @Param('seekerProgressId') seekerProgressId: string
    ): Promise<any> {
        const createData = { seekerProgressId };
        return this.crudService.deleteSeekerProgress(createData);
    }

    // Creates a new therapist with clerkUserId. 
    // This clerkUserId is used by frontend to fetch info about the therapist from backend 
    @Post('create-new-therapist/:clerkUserId')
    createNewTherapist(
        @Param('clerkUserId') clerkUserId: string,
        @Body() data: any,
    ): Promise<any> {
        const createData = { ...data, clerkUserId };
        return this.crudService.createNewTherapist(createData);
    }

    // updates an existing therapist data
    @Post('update-existing-therapist/:clerkUserId')
    updateExistingTherapist(
        @Param('clerkUserId') clerkUserId: string,
        @Body() updatedData: any,
    ): Promise<any> {
        const createData = { updatedData, clerkUserId };
        return this.crudService.updateExistingTherapist(createData);
    }

    // Function to create a new seeker and associated clinical history
    @Post('create-new-seeker-and-clinical-history/:clerkUserId')
    createNewSeekerAndClinicalHistory(
        @Param('clerkUserId') clerkUserId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, clerkUserId };
        return this.crudService.createNewSeekerAndClinicalHistory(createData);
    }

    // Updates an existing seeker details
    @Post('update-existing-seeker-and-clinical-information/:seekerId')
    updateExistingSeekerAndClinicalInformation(
        @Param('seekerId') seekerId: string,
        @Body() updatedSeekerData: any,
    ): Promise<any> {
        const createData = { updatedSeekerData, seekerId };
        return this.crudService.updateExistingSeekerAndClinicalInformation(createData);
    }

    /*****
     * 
     * APIs related to seeker clinical history
     * 
     *****/

    @Get('get-presenting-problem/:seekerId')
    getPresentingProblem(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getPresentingProblem(seekerId);
    }

    @Post('create-presenting-problem/:seekerId')
    createPresentingProblem(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createPresentingProblem(createData);
    }

    @Post('update-presenting-problem/:seekerId')
    updatePresentingProblem(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updatePresentingProblem(updateData);
    }

    @Get('get-basic-demographic-details/:seekerId')
    getBasicDemographicDetails(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getBasicDemographicDetails(seekerId);
    }

    @Post('create-basic-demographic-details/:seekerId')
    createBasicDemographicDetails(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createBasicDemographicDetails(createData);
    }

    @Post('update-basic-demographic-details/:seekerId')
    updateBasicDemographicDetails(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateBasicBasicDemographicDetails(updateData);
    }

    @Get('get-emergency-contact/:seekerId')
    getEmergencyContact(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getEmergencyContact(seekerId);
    }

    @Post('create-emergency-contact/:seekerId')
    createEmergencyContact(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createEmergencyContact(createData);
    }

    @Post('update-emergency-contact/:seekerId')
    updateEmergencyContact(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateEmergencyContact(updateData);
    }

    @Get('get-family-history/:seekerId')
    getFamilyHistory(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getFamilyHistory(seekerId);
    }

    @Post('create-family-history/:seekerId')
    createFamilyHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createFamilyHistory(createData);
    }

    @Post('update-family-history/:seekerId')
    updateFamilyHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateFamilyHistory(updateData);
    }

    @Get('get-substance-usage/:seekerId')
    getSubstanceUsage(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getSubstanceUsage(seekerId);
    }

    @Post('create-substance-usage/:seekerId')
    createSubstanceUsage(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createSubstanceUsage(createData);
    }

    @Post('update-substance-usage/:seekerId')
    updateSubstanceUsage(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateSubstanceUsage(updateData);
    }

    @Get('get-pre-morbid-personality/:seekerId')
    getPreMorbidPersonality(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getPreMorbidPersonality(seekerId);
    }

    @Post('create-pre-morbid-personality/:seekerId')
    createPreMorbidPersonality(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createPreMorbidPersonality(createData);
    }

    @Post('update-pre-morbid-personality/:seekerId')
    updatePreMorbidPersonality(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updatePreMorbidPersonality(updateData);
    }

    @Get('get-sexual-history/:seekerId')
    getSexualHistory(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getSexualHistory(seekerId);
    }

    @Post('create-sexual-history/:seekerId')
    createSexualHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createSexualHistory(createData);
    }

    @Post('update-sexual-history/:seekerId')
    updateSexualHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateSexualHistory(updateData);
    }

    @Get('get-personal-history/:seekerId')
    getPersonalHistory(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getPersonalHistory(seekerId);
    }

    @Post('create-personal-history/:seekerId')
    createPersonalHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createPersonalHistory(createData);
    }

    @Post('update-personal-history/:seekerId')
    updatePersonalHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updatePersonalHistory(updateData);
    }


    @Get('get-social-history/:seekerId')
    getPeersAndSocialHistory(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getPeersAndSocialHistory(seekerId);
    }

    @Post('create-social-history/:seekerId')
    createPeersAndSocialHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createPeersAndSocialHistory(createData);
    }

    @Post('update-social-history/:seekerId')
    updatePeersAndSocialHistory(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updatePeersAndSocialHistory(updateData);
    }

    @Get('get-work-career/:seekerId')
    getWorkCareer(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getWorkCareer(seekerId);
    }

    @Post('create-work-career/:seekerId')
    createWorkCareer(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createWorkCareer(createData);
    }

    @Post('update-work-career/:seekerId')
    updateWorkCareer(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateWorkCareer(updateData);
    }

    @Get('get-provisional-diagnosis/:seekerId')
    getProvisionalDiagnosis(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getProvisionalDiagnosis(seekerId);
    }

    @Post('create-provisional-diagnosis/:seekerId')
    createProvisionalDiagnosis(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createProvisionalDiagnosis(createData);
    }

    @Post('update-provisional-diagnosis/:seekerId')
    updateProvisionalDiagnosis(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateProvisionalDiagnosis(updateData);
    }

    @Get('get-differential-diagnosis/:seekerId')
    getDifferentialDiagnosis(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getDifferentialDiagnosis(seekerId);
    }

    @Post('create-differential-diagnosis/:seekerId')
    createDifferentialDiagnosis(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createDifferentialDiagnosis(createData);
    }

    @Post('update-differential-diagnosis/:seekerId')
    updateDifferentialDiagnosis(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateDifferentialDiagnosis(updateData);
    }

    @Get('get-mse/:seekerId')
    getMentalStatusExamination(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getMentalStatusExamination(seekerId);
    }

    @Post('create-mse/:seekerId')
    createMentalStatusExamination(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createMentalStatusExamination(createData);
    }

    @Post('update-mse/:seekerId')
    updateMentalStatusExamination(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateMentalStatusExamination(updateData);
    }

    @Get('get-intake-information/:seekerId')
    getIntakeInformation(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getIntakeInformation(seekerId);
    }

    @Post('create-intake-information/:seekerId')
    createIntakeInformation(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, seekerId };
        return this.crudService.createIntakeInformation(createData);
    }

    @Post('update-intake-information/:seekerId')
    updateIntakeInformation(
        @Param('seekerId') seekerId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const updateData = { seekerData, seekerId };
        return this.crudService.updateIntakeInformation(updateData);
    }
}

