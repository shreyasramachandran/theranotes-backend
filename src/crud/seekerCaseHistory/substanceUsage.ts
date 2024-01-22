/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class SubstanceUsage {
  private prisma = new PrismaClient();

  async createSubstanceUsage(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create Substances record
      const substanceUsage = await this.prisma.substances.create({
        data: {
          introductionToSubstances:
            params.seekerData.Substances.introductionToSubstances,
          substancesUsed: params.seekerData.Substances.substancesUsed,
          frequency: params.seekerData.Substances.frequency,
          quantity: params.seekerData.Substances.quantity,
          reason: params.seekerData.Substances.reason,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });

      // Return the created substance usage data
      return substanceUsage;
    } catch (error) {
      throw error;
    }
  }

  async getSubstanceUsage(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          Substances: {
            select: {
              introductionToSubstances: true,
              substancesUsed: true,
              frequency: true,
              quantity: true,
              reason: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        introductionToSubstance: string;
        substanceUsed: string;
        frequency: string;
        quantity: string;
        reason: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          introductionToSubstance: item.Substances.introductionToSubstances,
          substanceUsed: item.Substances.substancesUsed,
          frequency: item.Substances.frequency,
          quantity: item.Substances.quantity,
          reason: item.Substances.reason,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateSubstanceUsage(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        Substances: {
          introductionToSubstances:
            params.seekerData.introductionToSubstance ?? null,
          substancesUsed: params.seekerData?.substanceUsed ?? null,
          frequency: params.seekerData?.frequency ?? null,
          quantity: params.seekerData?.quantity ?? null,
          reason: params.seekerData?.reason ?? null,
        },
      };

      const updatedSubstances = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          Substances: {
            update: {
              data: transformedUpdatedData.Substances,
            },
          },
        },
        include: {
          Substances: true,
        },
      });

      return updatedSubstances;
    } catch (error) {
      throw error;
    }
  }
}
