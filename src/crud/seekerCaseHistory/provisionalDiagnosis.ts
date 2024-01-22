/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class ProvisionalDiagnosis {
  private prisma = new PrismaClient();

  async createProvisionalDiagnosis(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create ProvisionalDiagnosis record
      const provisionalDiagnosis =
        await this.prisma.provisionalDiagnosis.create({
          data: {
            provisionalDiagnosis:
              params.seekerData.ProvisionalDiagnosis.provisionalDiagnosis,
            seekerId: params.seekerId, // Assuming seekerId is the foreign key
          },
        });

      // Return the created ProvisionalDiagnosis data
      return provisionalDiagnosis;
    } catch (error) {
      throw error;
    }
  }

  async getProvisionalDiagnosis(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          ProvisionalDiagnosis: {
            select: {
              provisionalDiagnosis: true,
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
          yourComments: item.ProvisionalDiagnosis.provisionalDiagnosis,
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateProvisionalDiagnosis(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Transforming the incoming seekerData into the format expected by Prisma
      const transformedUpdatedData = {
        ProvisionalDiagnosis: {
          provisionalDiagnosis: params.seekerData?.yourComments ?? null,
        },
      };

      // Updating the ProvisionalDiagnosis in the database
      const updatedProvisionalDiagnosis = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          ProvisionalDiagnosis: {
            update: {
              data: transformedUpdatedData.ProvisionalDiagnosis,
            },
          },
        },
        include: {
          ProvisionalDiagnosis: true,
        },
      });

      return updatedProvisionalDiagnosis;
    } catch (error) {
      throw error;
    }
  }
}
