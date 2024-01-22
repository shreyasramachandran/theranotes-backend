/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class SeekerBasic {
  private prisma = new PrismaClient();

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
        return {};
      }
      return this.prisma.seekers.create({
        data: {
          therapist: {
            connect: { id: therapist.id },
          },
          // Add Seeker data
          referralSourcePlatform: data.seekerData.referralSourcePlatform,
          initialCommentsByTherapist:
            data.seekerData.initialCommentsByTherapist,
          // ... other seeker fields
          SeekerAttributes: {
            create: {}, // Object with seekerAttributes fields. Is empty
          },
          IntakeInformation: {
            create: data.seekerData.IntakeInformation, // Object with intakeInformation fields
          },
          BasicDemographicDetails: {
            create: data.seekerData.basicDemographicDetails, // Object with basicDemographicDetails fields
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
      throw error;
    }
  }

  async updateExistingSeekerAndClinicalInformation(data: {
    seekerId: string;
    updatedSeekerData: any;
  }): Promise<any> {
    try {
      const updatedSeeker = await this.prisma.seekers.update({
        where: { id: data.seekerId },
        data: {
          IntakeInformation: {
            update: {
              statusOfInformedConsent:
                data.updatedSeekerData.IntakeInformation
                  .statusOfInformedConsent,
              currentFees: data.updatedSeekerData.IntakeInformation.currentFees,
              mediumOfTherapy:
                data.updatedSeekerData.IntakeInformation.mediumOfTherapy,
              intakeClinician:
                data.updatedSeekerData.IntakeInformation.intakeClinician,
              keyTherapist:
                data.updatedSeekerData.IntakeInformation.keyTherapist,
            },
          },
        },
        include: {
          IntakeInformation: true,
        },
      });

      return updatedSeeker;
    } catch (error) {
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
            patientName: `Patient ${index + 1}`, // Placeholder, as the real name is not in the source
            sessionsDone: item.SeekerAttributes?.numberOfSessionsDone ?? null,
            nextSessionScheduled:
              item.SeekerAttributes?.nextSessionScheduled === 1 ?? null,
            fees: 100, // Placeholder value
            preferredDayAndTime:
              item.SeekerAttributes?.preferredDayAndTime ?? null,
            therapist: item.therapistId,
            contactNo: '123-456-7890', // Placeholder value
            problemType: item.SeekerAttributes?.problemType ?? null,
            lastSessionPaymentDone:
              item.SeekerAttributes?.lastSessionPaymentDone === 1 ?? null,
            isActive: item.isActive?.lastSessionPaymentDone === 'Yes' ?? null,
          };
        });
      }
      const transformedSeekerDetails = transformData(seekerDetails);
      return transformedSeekerDetails;
    } catch (error) {
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
      return transformedSeekerDetails;
    } catch (error) {
      throw error;
    }
  }
}
