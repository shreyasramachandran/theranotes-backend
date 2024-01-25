/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class DifferentialDiagnosis {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }

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
      this.logger.log('Creating Differential Diagnosis');

      // Return the created DifferentialDiagnosis data
      return differentialDiagnosis;
    } catch (error) {
      this.logger.error('Error Creating Differential Diagnosis', error.stack);

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
      this.logger.log('Getting Differential Diagnosis');

      return transformedData;
    } catch (error) {
      this.logger.error('Error getting Differntial Diagnosis', error.stack);

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
      this.logger.log('Updating Differential Diagnosis');

      return updatedDifferentialDiagnosis;
    } catch (error) {
      this.logger.error('Error Updating Differential Diagnosis', error.stack);

      throw error;
    }
  }
}
