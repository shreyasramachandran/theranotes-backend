/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class FamilyHistory {
  private prisma = new PrismaClient();

  async createFamilyHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create FamilyHistory record
      const familyHistory = await this.prisma.familyHistory.create({
        data: {
          familyStructure: params.seekerData.FamilyHistory.familyStructure,
          sourcesOfStress: params.seekerData.FamilyHistory.sourcesOfStress,
          sourcesOfSupport: params.seekerData.FamilyHistory.sourcesOfSupport,
          mentalHealthHistoryInFamily:
            params.seekerData.FamilyHistory.mentalHealthHistoryInFamily,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });

      // Return the created FamilyHistory data
      return familyHistory;
    } catch (error) {
      throw error;
    }
  }

  async getFamilyHistory(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          FamilyHistory: {
            select: {
              familyStructure: true,
              sourcesOfStress: true,
              sourcesOfSupport: true,
              mentalHealthHistoryInFamily: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        familyStructure: string;
        sourceOfStress: string;
        sourceOfSupport: string;
        mentalHealthHistory: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          familyStructure: item.FamilyHistory.familyStructure,
          sourceOfStress: item.FamilyHistory.sourcesOfStress,
          sourceOfSupport: item.FamilyHistory.sourcesOfSupport,
          mentalHealthHistory: item.FamilyHistory.mentalHealthHistoryInFamily,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateFamilyHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        FamilyHistory: {
          familyStructure: params.seekerData?.familyStructure ?? null,
          sourcesOfStress: params.seekerData?.sourcesOfStress ?? null,
          sourcesOfSupport: params.seekerData?.sourcesOfSupport ?? null,
          mentalHealthHistoryInFamily:
            params.seekerData?.mentalHealthHistoryInFamily ?? null,
        },
      };

      const updatedFamilyHistory = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          FamilyHistory: {
            update: {
              data: transformedUpdatedData.FamilyHistory,
            },
          },
        },
        include: {
          FamilyHistory: true,
        },
      });

      return updatedFamilyHistory;
    } catch (error) {
      throw error;
    }
  }
}
