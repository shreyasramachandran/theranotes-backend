/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { IsActive } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class SeekerBasic {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }

  async createNewSeekerAndClinicalHistory(data: {
    clerkUserId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Fetch the session to get the associated user
      const therapist = await this.prisma.therapists.findFirst({
        where: { clerkUserId: data.clerkUserId },
      });
      if (!therapist) {
        this.logger.warn('Therapist not found ');
        return {};
      }
      this.logger.log('Creating New Seeker & Clinical History');

      // Convert to db format
      const transformedData = {
        referralSourcePlatform: data.seekerData?.platform ?? null,
        initialCommentsByTherapist: data.seekerData?.comments ?? null,
        IntakeInformation: {
          name: data.seekerData?.name ?? null
        },
        BasicDemographicDetails: {
          email: data.seekerData?.email ?? null,
          contactNumber: data.seekerData?.number ?? null
        },
        SeekerAttributes: {
          isActive: IsActive.Yes
        }
      }

      return this.prisma.seekers.create({
        data: {
          therapist: {
            connect: { id: therapist.id },
          },
          // Add Seeker data
          referralSourcePlatform: transformedData.referralSourcePlatform,
          initialCommentsByTherapist:
            transformedData.initialCommentsByTherapist,
          // ... other seeker fields
          SeekerAttributes: {
            create: transformedData.SeekerAttributes
          },
          IntakeInformation: {
            create: transformedData.IntakeInformation, // Object with intakeInformation fields
          },
          BasicDemographicDetails: {
            create: transformedData.BasicDemographicDetails, // Object with basicDemographicDetails fields
          },
          PresentingProblem: {
            create: {
              EpisodicDocumentation: {
                create: {},
              },
              HistoryOfPresentProblem: {
                create: {},
              },
            },
          },
          EmergencyContact: {
            create: {},
          },
          FamilyHistory: {
            create: {},
          },
          Substances: {
            create: {},
          },
          PreMorbidPersonality: {
            create: {},
          },
          SexualHistory: {
            create: {},
          },
          PersonalHistory: {
            create: {},
          },
          PeersAndSocialHistory: {
            create: {},
          },
          WorkAndCareer: {
            create: {},
          },
          ProvisionalDiagnosis: {
            create: {},
          },
          DifferentialDiagnosis: {
            create: {},
          },
          MentalStatusExamination: {
            create: {},
          },
        },
        include: {
          IntakeInformation: true,
          SeekerAttributes: true,
          BasicDemographicDetails: true,
          PresentingProblem: {
            include: {
              EpisodicDocumentation: true,
              HistoryOfPresentProblem: true,
            },
          },
          EmergencyContact: true,
          FamilyHistory: true,
          Substances: true,
          PreMorbidPersonality: true,
          SexualHistory: true,
          PersonalHistory: true,
          PeersAndSocialHistory: true,
          WorkAndCareer: true,
          ProvisionalDiagnosis: true,
          DifferentialDiagnosis: true,
          MentalStatusExamination: true,
        },
      });
    } catch (error) {
      this.logger.error('Error creating new Seeker', error.stack);

      throw error;
    }
  }

  async updateExistingSeekerAndClinicalInformation(data: {
    seekerId: string;
    updatedSeekerData: any;
  }): Promise<any> {
    try {
      const transformedData = {
        IntakeInformation: {
          statusOfInformedConsent: data.updatedSeekerData?.status ?? null,
          currentFees: data.updatedSeekerData?.fees ?? null,
          mediumOfTherapy: data.updatedSeekerData?.medium ?? null,
          intakeClinician: data.updatedSeekerData?.intakeClinician ?? null,
          keyTherapist: data.updatedSeekerData?.keyTherapist ?? null,
        }
      }

      const updatedSeeker = await this.prisma.seekers.update({
        where: { id: data.seekerId },
        data: {
          IntakeInformation: {
            update: {
              statusOfInformedConsent:
                transformedData.IntakeInformation
                  .statusOfInformedConsent,
              currentFees: transformedData.IntakeInformation.currentFees,
              mediumOfTherapy:
                transformedData.IntakeInformation.mediumOfTherapy,
              intakeClinician:
                transformedData.IntakeInformation.intakeClinician,
              keyTherapist:
                transformedData.IntakeInformation.keyTherapist,
            },
          },
        },
        include: {
          IntakeInformation: true,
        },
      });
      this.logger.log('Updating New Seeker');

      return updatedSeeker;
    } catch (error) {
      this.logger.error('Error Updating New Seeker ', error.stack);

      throw error;
    }
  }

  async getAllSeekers(clerkUserId: string): Promise<any> {
    // Fetch the session to get the associated user
    try {
      const therapist = await this.prisma.therapists.findFirst({
        where: { clerkUserId: clerkUserId },
      });
      if (!therapist) {
        this.logger.warn('Therapist not found ');

        return {};
      }
      // Fetch seekers and their attributes associated with this user
      const seekerDetails = await this.prisma.seekers.findMany({
        where: {
          OR: [{ therapist: { id: therapist.id } }],
        },
        include: {
          SeekerAttributes: {
            select: {
              numberOfSessionsDone: true,
              nextSessionScheduled: true,
              preferredDayAndTime: true,
              lastSessionPaymentDone: true,
              isActive: true,
              problemType: true,
            },
          },
          IntakeInformation: {
            select: {
              currentFees: true,
              name: true
            },
          },
          BasicDemographicDetails: {
            select: {
              contactNumber: true,
            },
          },
        },
      });

      interface InterfaceData {
        pid: string;
        patientName: string;
        sessionsDone: number;
        nextSessionScheduled: boolean;
        fees: number;
        preferredDayAndTime: string;
        therapist: string;
        contactNo: string;
        problemType: string;
        lastSessionPaymentDone: boolean;
        isActive: boolean;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item, index) => {
          return {
            pid: item.id, // assuming id is convertible to number
            patientName: item.IntakeInformation?.name ?? null,
            sessionsDone: item.SeekerAttributes?.numberOfSessionsDone ?? null,
            nextSessionScheduled:
              item.SeekerAttributes?.nextSessionScheduled === 1 ?? null,
            fees: item.IntakeInformation?.currentFees ?? null, // Placeholder value
            preferredDayAndTime:
              item.SeekerAttributes?.preferredDayAndTime ?? null,
            therapist: item.therapistId,
            contactNo: item.BasicDemographicDetails?.contactNumber ?? null, // Placeholder value
            problemType: item.SeekerAttributes?.problemType ?? null,
            lastSessionPaymentDone:
              item.SeekerAttributes?.lastSessionPaymentDone === 1 ?? null,
            isActive: item.SeekerAttributes?.isActive === IsActive.Yes ?? null,
          };
        });
      }
      const transformedSeekerDetails = transformData(seekerDetails);
      this.logger.log('Getting New Seeker Info');

      return transformedSeekerDetails;
    } catch (error) {
      this.logger.error('Error getting New Seeker Info', error.stack);

      throw error;
    }
  }

  async getAllSeekersCohortCards(clerkUserId: string): Promise<any> {
    // Fetch the session to get the associated user
    try {
      const therapist = await this.prisma.therapists.findFirst({
        where: { clerkUserId: clerkUserId },
      });

      if (!therapist) {
        this.logger.warn('Therapist not found ');

        return {};
      }
      const seekerDetails = await this.prisma.seekers.findMany({
        where: {
          OR: [{ therapist: { id: therapist.id } }],
        },
        select: {
          id: true,
          IntakeInformation: {
            select: {
              name: true,
            },
          },
        },
      });

      interface InterfaceData {
        seekerId: string;
        name: string;
        tag: string;
        joiningTime: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          seekerId: item.id,
          name: item.IntakeInformation?.name ?? null,
          tag: 'Active Cohort',
          joiningTime: 'Dec 2021', // Placeholder, replace with actual logic if available
        }));
      }
      const transformedSeekerDetails = transformData(seekerDetails);
      this.logger.log('Getting Seeker Cohort Cards');

      return transformedSeekerDetails;
    } catch (error) {
      this.logger.error('Error getting Seeker Cohort Cards', error.stack);

      throw error;
    }
  }
}
