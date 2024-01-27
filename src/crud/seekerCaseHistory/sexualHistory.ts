/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class SexualHistory {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }
  async createSexualHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create SexualHistory record
      const sexualHistory = await this.prisma.sexualHistory.create({
        data: {
          onsetOfPuberty: params.seekerData.SexualHistory.onsetOfPuberty,
          sexualIdentity: params.seekerData.SexualHistory.sexualIdentity,
          genderIdentity: params.seekerData.SexualHistory.genderIdentity,
          firstSelfExplorationExperience:
            params.seekerData.SexualHistory.firstSelfExplorationExperience,
          firstSexualExperience:
            params.seekerData.SexualHistory.firstSexualExperience,
          arousalAndOrgasmicFantasy:
            params.seekerData.SexualHistory.arousalAndOrgasmicFantasy,
          sexualDiseases: params.seekerData.SexualHistory.sexualDiseases,
          currentSexualFunctioning:
            params.seekerData.SexualHistory.currentSexualFunctioning,
          sexualAbuse: params.seekerData.SexualHistory.sexualAbuse,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });
      this.logger.log('Creating Sexual History');

      // Return the created SexualHistory data
      return sexualHistory;
    } catch (error) {
      this.logger.error('Error Creating Sexual History', error.stack);
      throw error;
    }
  }

  async getSexualHistory(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          SexualHistory: {
            select: {
              onsetOfPuberty: true,
              sexualIdentity: true,
              genderIdentity: true,
              firstSelfExplorationExperience: true,
              firstSexualExperience: true,
              arousalAndOrgasmicFantasy: true,
              sexualDiseases: true,
              currentSexualFunctioning: true,
              sexualAbuse: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        onsetOfPuberty: string;
        genderIdentity: string;
        fantasy: string;
        firstSexualExperience: string;
        sexualIdentity: string;
        firstSelfExploration: string;
        overallSexualFunctioning: string;
        sexualDiseases: string;
        sexualAbuse: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          onsetOfPuberty: item.SexualHistory.onsetOfPuberty,
          genderIdentity: item.SexualHistory.genderIdentity,
          fantasy: item.SexualHistory.arousalAndOrgasmicFantasy,
          firstSexualExperience: item.SexualHistory.firstSexualExperience,
          sexualIdentity: item.SexualHistory.sexualIdentity,
          firstSelfExploration:
            item.SexualHistory.firstSelfExplorationExperience,
          overallSexualFunctioning: item.SexualHistory.currentSexualFunctioning,
          sexualDiseases: item.SexualHistory.sexualDiseases,
          sexualAbuse: item.SexualHistory.sexualAbuse,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      this.logger.log('Getting Sexual History');
      return transformedData;
    } catch (error) {
      this.logger.error('Error getting Sexual History', error.stack);
      throw error;
    }
  }

  async updateSexualHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        SexualHistory: {
          onsetOfPuberty: new Date(params.seekerData?.onsetOfPuberty).toISOString() ?? null,
          genderIdentity: params.seekerData?.genderIdentity ?? null,
          arousalAndOrgasmicFantasy: params.seekerData?.fantasy ?? null,
          firstSexualExperience:
            params.seekerData?.firstSexualExperience ?? null,
          sexualIdentity: params.seekerData?.sexualIdentity ?? null,
          firstSelfExplorationExperience:
            params.seekerData?.firstSelfExploration ?? null,
          currentSexualFunctioning:
            params.seekerData?.overallSexualFunctioning ?? null,
          sexualDiseases: params.seekerData?.sexualDiseases ?? null,
          sexualAbuse: params.seekerData?.sexualAbuse ?? null,
        },
      };

      const updatedSexualHistory = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          SexualHistory: {
            update: {
              data: transformedUpdatedData.SexualHistory,
            },
          },
        },
        include: {
          SexualHistory: true,
        },
      });
      this.logger.log('Updating Sexual History');

      return updatedSexualHistory;
    } catch (error) {
      this.logger.error('Error updating Sexual History', error.stack);
      throw error;
    }
  }
}
