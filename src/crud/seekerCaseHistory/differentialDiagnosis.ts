/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class DifferentialDiagnosis {
  private prisma = new PrismaClient();

  async createDifferentialDiagnosis(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create DifferentialDiagnosis record
      const differentialDiagnosis =
        await this.prisma.differentialDiagnosis.create({
          data: {
            differentialDiagnosis:
              params.seekerData.DifferentialDiagnosis.differentialDiagnosis,
            seekerId: params.seekerId, // Assuming seekerId is the foreign key
          },
        });

      // Return the created DifferentialDiagnosis data
      return differentialDiagnosis;
    } catch (error) {
      throw error;
    }
  }

  async getDifferentialDiagnosis(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          DifferentialDiagnosis: {
            select: {
              differentialDiagnosis: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          yourComments: item.DifferentialDiagnosis.differentialDiagnosis,
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateDifferentialDiagnosis(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Transforming the incoming seekerData into the format expected by Prisma
      const transformedUpdatedData = {
        DifferentialDiagnosis: {
          differentialDiagnosis: params.seekerData?.yourComments ?? null,
        },
      };

      // Updating the DifferentialDiagnosis in the database
      const updatedDifferentialDiagnosis = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          DifferentialDiagnosis: {
            update: {
              data: transformedUpdatedData.DifferentialDiagnosis,
            },
          },
        },
        include: {
          DifferentialDiagnosis: true,
        },
      });

      return updatedDifferentialDiagnosis;
    } catch (error) {
      throw error;
    }
  }
}
