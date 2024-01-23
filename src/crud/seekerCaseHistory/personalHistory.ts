/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class PersonalHistory {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }
  async createPersonalHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create PersonalHistory record
      const personalHistory = await this.prisma.personalHistory.create({
        data: {
          yourComments: params.seekerData.PersonalHistory.yourComments,
          perinatal: params.seekerData.PersonalHistory.perinatal,
          childhood: params.seekerData.PersonalHistory.childhood,
          adolescent: params.seekerData.PersonalHistory.adolescent,
          adulthood: params.seekerData.PersonalHistory.adulthood,
          oldAge: params.seekerData.PersonalHistory.oldAge,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });

      this.logger.log('Creating Personal History');
      // Return the created PersonalHistory data
      return personalHistory;
    } catch (error) {
      this.logger.error('Error Creating Personal History', error.stack);
      throw error;
    }
  }

  async getPersonalHistory(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          PersonalHistory: {
            select: {
              yourComments: true,
              perinatal: true,
              childhood: true,
              adolescent: true,
              adulthood: true,
              oldAge: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        perinatal: string;
        childhood: string;
        adolescent: string;
        adulthood: string;
        oldAge: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          perinatal: item.PersonalHistory.perinatal,
          childhood: item.PersonalHistory.childhood,
          adolescent: item.PersonalHistory.adolescent,
          adulthood: item.PersonalHistory.adulthood,
          oldAge: item.PersonalHistory.oldAge,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      this.logger.log('Getting Personal history');

      return transformedData;
    } catch (error) {
      this.logger.error('Error getting Personal History', error.stack);

      throw error;
    }
  }

  async updatePersonalHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        PersonalHistory: {
          perinatal: params.seekerData?.perinatal ?? null,
          childhood: params.seekerData?.childhood ?? null,
          adolescent: params.seekerData?.adolescent ?? null,
          adulthood: params.seekerData?.adulthood ?? null,
          oldAge: params.seekerData?.oldAge ?? null,
        },
      };

      // Updating the PersonalHistory in the database
      const updatedPersonalHistory = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          PersonalHistory: {
            update: {
              data: transformedUpdatedData.PersonalHistory,
            },
          },
        },
        include: {
          PersonalHistory: true,
        },
      });
      this.logger.log('Updating Personal History');

      return updatedPersonalHistory;
    } catch (error) {
      this.logger.error('Error Updating Personal History', error.stack);

      throw error;
    }
  }
}
