import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CrudService } from './crud.service';


@Controller('crud')
export class CrudController {
    constructor(private readonly crudService: CrudService) { }

    @Get('get-all-seekers/:clerkUserId')
    getAllSeekers(@Param('clerkUserId') clerkUserId: string): Promise<any> {
        return this.crudService.getAllSeekers(clerkUserId);
    }

    @Get('get-all-seekers-cohort-cards/:clerkUserId')
    getAllSeekersCohortCards(@Param('clerkUserId') clerkUserId: string): Promise<any> {
        return this.crudService.getAllSeekersCohortCards(clerkUserId);
    }

    @Get('get-seeker-progress/:seekerId')
    getSeekerProgress(@Param('seekerId') seekerId: string): Promise<any> {
        return this.crudService.getSeekerProgress(seekerId);
    }

    @Post('create-seeker-progress/:seekerId')
    createSeekerProgress(
        @Param('seekerId') seekerId: string,
        @Body() data: { progressSubject: string, progressBody: string },
    ): Promise<any> {
        const createData = { ...data, seekerId };
        return this.crudService.createSeekerProgress(createData);
    }

    @Post('edit-seeker-progress/:seekerProgressId')
    editSeekerProgress(
        @Param('seekerId') seekerProgressId: string,
        @Body() data: { progressSubject: string, progressBody: string },
    ): Promise<any> {
        const createData = { ...data, seekerProgressId };
        return this.crudService.editSeekerProgress(createData);
    }

    @Post('delete-seeker-progress/:seekerProgressId')
    deleteSeekerProgress(
        @Param('seekerProgressId') seekerProgressId: string
    ): Promise<any> {
        const createData = { seekerProgressId };
        return this.crudService.deleteSeekerProgress(createData);
    }

    @Post('create-new-therapist/:clerkUserId')
    createNewTherapist(
        @Param('clerkUserId') clerkUserId: string,
        @Body() data: any,
    ): Promise<any> {
        const createData = { ...data, clerkUserId };
        return this.crudService.createNewTherapist(createData);
    }

    @Post('update-existing-therapist/:clerkUserId')
    updateExistingTherapist(
        @Param('clerkUserId') clerkUserId: string,
        @Body() updatedData: any,
    ): Promise<any> {
        const createData = { updatedData, clerkUserId };
        return this.crudService.updateExistingTherapist(createData);
    }

    @Post('create-new-seeker/:therapistId')
    createNewSeeker(
        @Param('therapistId') therapistId: string,
        @Body() seekerData: any,
    ): Promise<any> {
        const createData = { seekerData, therapistId };
        return this.crudService.createNewSeeker(createData);
    }

    @Post('update-existing-seeker/:seekerId')
    updateExistingSeeker(
        @Param('seekerId') seekerId: string,
        @Body() updatedSeekerData: any,
    ): Promise<any> {
        const createData = { updatedSeekerData, seekerId };
        return this.crudService.updateExistingSeeker(createData);
    }
}

