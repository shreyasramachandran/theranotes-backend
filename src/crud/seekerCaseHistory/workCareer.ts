/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class WorkAndCareer {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }

  async createWorkCareer(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create WorkAndCareer record
      const workAndCareer = await this.prisma.workAndCareer.create({
        data: {
          natureOfWork: params.seekerData.WorkAndCareer.natureOfWork,
          sourcesOfStress: params.seekerData.WorkAndCareer.sourcesOfStress,
          changesInJob: params.seekerData.WorkAndCareer.changesInJob,
          reasonsForChange: params.seekerData.WorkAndCareer.reasonsForChange,
          sourcesOfSupport: params.seekerData.WorkAndCareer.sourcesOfSupport,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });

      this.logger.log('Creating Work&Career Data');
      // Return the created WorkAndCareer data
      return workAndCareer;
    } catch (error) {
      this.logger.error('Error creating Work And Career', error.stack);
      throw error;
    }
  }

  async getWorkCareer(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          WorkAndCareer: {
            select: {
              natureOfWork: true,
              sourcesOfStress: true,
              changesInJob: true,
              reasonsForChange: true,
              sourcesOfSupport: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        natureOfWork: string;
        sourcesOfStress: string;
        changesInJob: string;
        reasonsForChange: string;
        sourcesOfSupport: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          natureOfWork: item.WorkAndCareer.natureOfWork,
          sourcesOfStress: item.WorkAndCareer.sourcesOfStress,
          changesInJob: item.WorkAndCareer.changesInJob,
          reasonsForChange: item.WorkAndCareer.reasonsForChange,
          sourcesOfSupport: item.WorkAndCareer.sourcesOfSupport,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      this.logger.log('Getting Work & Career Data');

      return transformedData;
    } catch (error) {
      this.logger.error('Error getting Work & Career', error.stack);

      throw error;
    }
  }

  async updateWorkCareer(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Transforming the incoming seekerData into the format expected by Prisma
      const transformedUpdatedData = {
        WorkAndCareer: {
          natureOfWork: params.seekerData?.natureOfWork ?? null,
          sourcesOfStress: params.seekerData?.sourcesOfStress ?? null,
          changesInJob: params.seekerData?.changesInJob ?? null,
          reasonsForChange: params.seekerData?.reasonsForChange ?? null,
          sourcesOfSupport: params.seekerData?.sourcesOfSupport ?? null,
        },
      };

      // Updating the WorkAndCareer in the database
      const updatedWorkAndCareer = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          WorkAndCareer: {
            update: {
              data: transformedUpdatedData.WorkAndCareer,
            },
          },
        },
        include: {
          WorkAndCareer: true,
        },
      });
      this.logger.log('Updating Work & Career');

      return updatedWorkAndCareer;
    } catch (error) {
      this.logger.error('Error Updating Work & Career', error.stack);
      throw error;
    }
  }
}
