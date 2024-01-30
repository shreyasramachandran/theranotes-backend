/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class SeekerProgress {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }
  async getSeekerProgress(seekerId: string): Promise<any> {
    try {
      const seekerProgressDetails = await this.prisma.seekerProgress.findMany({
        where: {
          seekerId: seekerId,
        },
        select: {
          id: true,
          progressSubject: true,
          progressBody: true,
          createdAt: true,
        },
      });

      const seekerName = await this.prisma.intakeInformation.findUnique({
        where: {
          seekerId: seekerId,
        },
        select: {
          name: true,
        },
      });

      interface InterfaceData {
        seekerName: string; // Adding seekerName property
        seekerProgress: {
          seekerProgressId: string;
          progressSubject: string;
          progressBody: string;
          createdAt: string;
        }[];
      }

      // Transform the data to be sent to frontend
      function transformData(
        seekerName: string,
        sourceArray: any,
      ): InterfaceData {
        return {
          seekerName: seekerName,
          seekerProgress: sourceArray.map((item) => ({
            seekerProgressId: item.id,
            progressSubject: item.progressSubject,
            progressBody: item.progressBody,
            createdAt: item.createdAt,
          })),
        };
      }

      const transformedSeekerProgress = transformData(
        seekerName.name,
        seekerProgressDetails,
      );
      this.logger.log('Getting Seeker Progress');
      return transformedSeekerProgress;
    } catch (error) {
      this.logger.error('Error getting Seeker Progress', error.stack);
      throw error;
    }
  }

  async createSeekerProgress(data: {
    seekerId: string;
    progressSubject: string;
    progressBody: string;
  }): Promise<any> {
    try {
      this.logger.log('Creating Seeker Progress');

      return this.prisma.seekerProgress.create({
        data: {
          progressSubject: data.progressSubject,
          progressBody: data.progressBody,
          seeker: {
            // Assuming Seeker is the relation field name in SeekerProgress model
            connect: { id: data.seekerId },
          },
        },
      });
    } catch (error) {
      this.logger.error('Error Creating Seeker Progress', error.stack);

      throw error;
    }
  }

  // Edit new seeker progress
  async editSeekerProgress(data: {
    seekerProgressId: string;
    progressSubject: string;
    progressBody: string;
  }): Promise<any> {
    try {
      this.logger.log('Updating Seeker Progress');

      return this.prisma.seekerProgress.update({
        where: { id: data.seekerProgressId },
        data: {
          progressSubject: data.progressSubject,
          progressBody: data.progressBody,
        },
      });
    } catch (error) {
      this.logger.error('Error updating Seeker Progress', error.stack);

      throw error;
    }
  }

  // Delete seeker progress
  async deleteSeekerProgress(data: { seekerProgressId: string }): Promise<any> {
    try {
      this.logger.log('Deleting Seeker Progress');

      return this.prisma.seekerProgress.delete({
        where: { id: data.seekerProgressId },
      });
    } catch (error) {
      this.logger.error(
        'Error Deleting Seeker Progress - you had one job :p',
        error.stack,
      );

      throw error;
    }
  }
}
