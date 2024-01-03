import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class CrudService {
    prisma = new PrismaClient()

    async getAllSeekers(clerkUserId: string): Promise<any> {
        // Fetch the session to get the associated user
        const therapist = await this.prisma.therapists.findFirst({
            where: { clerkUserId: clerkUserId }
        });
        if (!therapist) {
            return {}
        }
        // Fetch seekers and their attributes associated with this user
        const seekerDetails = await this.prisma.seekers.findMany({
            where: {
                OR: [
                    { therapist: { id: therapist.id } }
                ],
            },
            include:
            {
                SeekerAttributes: {
                    select: {
                        numberOfSessionsDone: true,
                        nextSessionScheduled: true,
                        preferredDayAndTime: true,
                        lastSessionPaymentDone: true,
                        isActive: true,
                        problemType: true
                    }
                },
                IntakeInformation: {
                    select: {
                        currentFees: true,
                    }
                },
                BasicDemographicDetails: {
                    select: {
                        contactNumber: true
                    }
                },
            },
        });

        interface InterfaceData {
            pid: number
            patientName: string
            sessionsDone: number
            nextSessionScheduled: boolean
            fees: number
            preferredDayAndTime: string
            therapist: string
            contactNo: string
            problemType: string
            lastSessionPaymentDone: boolean
            isActive: boolean
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map((item, index) => {
                return {
                    pid: parseInt(item.id), // assuming id is convertible to number
                    patientName: `Patient ${index + 1}`, // Placeholder, as the real name is not in the source
                    sessionsDone: item.SeekerAttributes.numberOfSessionsDone,
                    nextSessionScheduled: item.SeekerAttributes.nextSessionScheduled === 1,
                    fees: 100, // Placeholder value
                    preferredDayAndTime: item.SeekerAttributes.preferredDayAndTime,
                    therapist: item.therapistId,
                    contactNo: '123-456-7890', // Placeholder value
                    problemType: item.SeekerAttributes.problemType,
                    lastSessionPaymentDone: item.SeekerAttributes.lastSessionPaymentDone === 1,
                    isActive: item.SeekerAttributes.isActive === 'Yes'
                };
            });
        }
        const transformedSeekerDetails = transformData(seekerDetails)
        return transformedSeekerDetails;
    }

    async getAllSeekersCohortCards(clerkUserId: string): Promise<any> {
        // Fetch the session to get the associated user
        const therapist = await this.prisma.therapists.findFirst({
            where: { clerkUserId: clerkUserId }
        });

        if (!therapist) {
            return {}
        }
        const seekerDetails = await this.prisma.seekers.findMany({
            where: {
                OR: [
                    { therapist: { id: therapist.id } }
                ],
            },
            select:
            {
                id: true,
                IntakeInformation: {
                    select: {
                        name: true,
                    }
                },
            },
        });

        interface InterfaceData {
            seekerId: string
            name: string
            tag: string
            joiningTime: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                seekerId: item.id,
                name: item.IntakeInformation.name,
                tag: "Active Cohort",
                joiningTime: "Dec 2021" // Placeholder, replace with actual logic if available
            }));

        }
        const transformedSeekerDetails = transformData(seekerDetails)
        return transformedSeekerDetails;
    }

    async getSeekerProgress(seekerId: string): Promise<any> {
        const seekerProgressDetails = await this.prisma.seekerProgress.findMany(
            {
                where: {
                    seekerId: seekerId
                },
                select: {
                    id: true,
                    progressSubject: true,
                    progressBody: true,
                    createdAt: true
                }
            }
        )

        interface InterfaceData {
            seekerProgressId: string
            progressSubject: string
            progressBody: string
            createdAt: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                seekerProgressId: item.id,
                progressSubject: item.progressSubject,
                progressBody: item.progressBody,
                time: item.createdAt
            }));

        }
        const transformedSeekerDetails = transformData(seekerProgressDetails)
        return transformedSeekerDetails;
    }

    // Create new seeker progress
    async createSeekerProgress(data: { seekerId: string, progressSubject: string, progressBody: string }): Promise<any> {
        return this.prisma.seekerProgress.create({
            data: {
                progressSubject: data.progressSubject,
                progressBody: data.progressBody,
                seeker: { // Assuming Seeker is the relation field name in SeekerProgress model
                    connect: { id: data.seekerId },
                },
            },
        });
    }

    // Edit new seeker progress
    async editSeekerProgress(data: { seekerProgressId: string, progressSubject: string, progressBody: string }): Promise<any> {
        return this.prisma.seekerProgress.update({
            where: { id: data.seekerProgressId },
            data: {
                progressSubject: data.progressSubject,
                progressBody: data.progressBody
            },
        });
    }

    // Delete seeker progress
    async deleteSeekerProgress(data: { seekerProgressId: string }): Promise<any> {
        return this.prisma.seekerProgress.delete({
            where: { id: data.seekerProgressId }
        });
    }


    async createNewTherapist(data): Promise<any> {
        return this.prisma.therapists.create({
            data: data
        });
    }


    async updateExistingTherapist(data: { clerkUserId: string, updatedData: any }): Promise<any> {
        return this.prisma.therapists.update({
            where: { clerkUserId: data.clerkUserId },
            data: data.updatedData
        });
    }

    async createNewSeeker(data: { therapistId: string, seekerData: any }): Promise<any> {
        return this.prisma.seekers.create({
            data: {
                therapist: {
                    connect: { id: data.therapistId },
                },
                // Add Seeker data
                referredBy: data.seekerData.referredBy,
                referralSourcePlatform: data.seekerData.referralSourcePlatform,
                initialCommentsByTherapist: data.seekerData.initialCommentsByTherapist,
                location: data.seekerData.location,
                // ... other seeker fields
                SeekerAttributes: {
                    create: data.seekerData.seekerAttributes, // Object with seekerAttributes fields
                },
                IntakeInformation: {
                    create: data.seekerData.intakeInformation, // Object with intakeInformation fields
                },
                BasicDemographicDetails: {
                    create: data.seekerData.basicDemographicDetails, // Object with basicDemographicDetails fields
                },
            },
        });
    }

    async updateExistingSeeker(data: { seekerId: string, updatedSeekerData: any }): Promise<any> {
        return this.prisma.intakeInformation.upsert({
            where: {
                seekerId: data.seekerId, // Unique identifier for SeekerAttributes
            },
            update: data.updatedSeekerData,
            create: {
                ...data.updatedSeekerData,
                seeker: {
                    connect: {
                        id: data.seekerId
                    }
                }
            }
        });
    }
}

