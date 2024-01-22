/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class BasicDemographicDetails {
  private prisma = new PrismaClient();

  async createBasicDemographicDetails(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create BasicDemographicDetails record
      const basicDemographicDetails =
        await this.prisma.basicDemographicDetails.create({
          data: {
            age: params.seekerData.BasicDemographicDetails.age,
            dateOfBirth: params.seekerData.BasicDemographicDetails.dateOfBirth,
            preferredPronoun:
              params.seekerData.BasicDemographicDetails.preferredPronoun,
            contactNumber:
              params.seekerData.BasicDemographicDetails.contactNumber,
            email: params.seekerData.BasicDemographicDetails.email,
            currentAddress:
              params.seekerData.BasicDemographicDetails.currentAddress,
            permanentAddress:
              params.seekerData.BasicDemographicDetails.permanentAddress,
            caste: params.seekerData.BasicDemographicDetails.caste,
            religion: params.seekerData.BasicDemographicDetails.religion,
            seekerId: params.seekerId,
          },
        });

      // Return the created data
      return basicDemographicDetails;
    } catch (error) {
      throw error;
    }
  }

  async getBasicDemographicDetails(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          IntakeInformation: {
            select: {
              name: true,
            },
          },
          BasicDemographicDetails: {
            select: {
              age: true,
              dateOfBirth: true,
              preferredPronoun: true,
              contactNumber: true,
              email: true,
              currentAddress: true,
              permanentAddress: true,
              caste: true,
              religion: true,
            },
          },
          FamilyHistory: {
            select: {
              familyStructure: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        name: string;
        age: string;
        dob: string;
        preferredPronoun: string;
        contactNum: string;
        email: string;
        currentAddress: string;
        permanentAddress: string;
        caste: string;
        religion: string;
        familyType: string;
        ethnicity: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          name: item.IntakeInformation?.name ?? null,
          age: item.BasicDemographicDetails?.age ?? null,
          dob: item.BasicDemographicDetails?.dateOfBirth ?? null,
          preferredPronoun:
            item.BasicDemographicDetails?.preferredPronoun ?? null,
          contactNum: item.BasicDemographicDetails?.contactNumber ?? null,
          email: item.BasicDemographicDetails?.email ?? null,
          currentAddress: item.BasicDemographicDetails?.currentAddress ?? null,
          permanentAddress:
            item.BasicDemographicDetails?.permanentAddress ?? null,
          caste: item.BasicDemographicDetails?.caste ?? null,
          religion: item.BasicDemographicDetails?.religion ?? null,
          familyType: item.FamilyHistory?.familyStructure ?? null,
          ethnicity: 'Indian',
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateBasicBasicDemographicDetails(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        IntakeInformation: {
          name: params.seekerData?.name ?? null,
        },
        BasicDemographicDetails: {
          age: Number(params.seekerData?.age) ?? null,
          dateOfBirth: new Date(params.seekerData?.dob).toISOString() ?? null,
          preferredPronoun: params.seekerData?.preferredPronoun ?? null,
          contactNumber: params.seekerData?.contactNum ?? null,
          email: params.seekerData?.email ?? null,
          currentAddress: params.seekerData?.currentAddress ?? null,
          permanentAddress: params.seekerData?.permanentAddress ?? null,
          caste: params.seekerData?.caste ?? null,
          religion: params.seekerData?.religion ?? null,
        },
        FamilyHistory: {
          familyStructure: params.seekerData?.familyType ?? null,
        },
      };

      const updatedBasicDemographicDetails = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          IntakeInformation: {
            update: {
              data: transformedUpdatedData.IntakeInformation,
            },
          },
          BasicDemographicDetails: {
            update: {
              data: transformedUpdatedData.BasicDemographicDetails,
            },
          },
          FamilyHistory: {
            update: {
              data: transformedUpdatedData.FamilyHistory,
            },
          },
        },
        include: {
          IntakeInformation: true,
          BasicDemographicDetails: true,
          FamilyHistory: true,
        },
      });

      return updatedBasicDemographicDetails;
    } catch (error) {
      throw error;
    }
  }
}
