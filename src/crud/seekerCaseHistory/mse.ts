/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class MSE {
  private prisma = new PrismaClient();

  async createMentalStatusExamination(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create MentalStatusExamination record
      const mentalStatusExamination =
        await this.prisma.mentalStatusExamination.create({
          data: {
            moodAndAffect:
              params.seekerData.MentalStatusExamination.moodAndAffect,
            attentionAndConcentration:
              params.seekerData.MentalStatusExamination
                .attentionAndConcentration,
            levelOfInsight:
              params.seekerData.MentalStatusExamination.levelOfInsight,
            yourComments:
              params.seekerData.MentalStatusExamination.yourComments,
            seekerId: params.seekerId, // Assuming seekerId is the foreign key
          },
        });
      // Return the created MentalStatusExamination data
      return mentalStatusExamination;
    } catch (error) {
      throw error;
    }
  }

  async getMentalStatusExamination(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          MentalStatusExamination: {
            select: {
              generalAppearance: true,
              thoughts: true,
              cognition: true,
              moodAndAffect: true,
              attentionAndConcentration: true,
              levelOfInsight: true,
              yourComments: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        moodAndAffect: string;
        attentionAndConcentration: string;
        levelOfInsight: string;
        yourComments: string;
        cognition: string;
        generalAppearance: string;
        thoughts: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          moodAndAffect: item.MentalStatusExamination.moodAndAffect,
          attentionAndConcentration:
            item.MentalStatusExamination.attentionAndConcentration,
          levelOfInsight: item.MentalStatusExamination.levelOfInsight,
          cognition: item.MentalStatusExamination.cognition,
          generalAppearance: item.MentalStatusExamination.generalAppearance,
          thoughts: item.MentalStatusExamination.thoughts,
          yourComments: item.MentalStatusExamination.yourComments,
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateMentalStatusExamination(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Transforming the incoming seekerData into the format expected by Prisma
      const transformedUpdatedData = {
        MentalStatusExamination: {
          moodAndAffect: params.seekerData?.moodAndAffect ?? null,
          attentionAndConcentration:
            params.seekerData?.attentionAndConcentration ?? null,
          levelOfInsight: params.seekerData?.levelOfInsight ?? null,
          cognition: params.seekerData?.cognition ?? null,
          generalAppearance: params.seekerData?.generalAppearance ?? null,
          thoughts: params.seekerData?.thoughts ?? null,
          yourComments: params.seekerData?.yourComments ?? null,
        },
      };

      // Updating the MentalStatusExamination in the database
      const updatedMentalStatusExamination = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          MentalStatusExamination: {
            update: {
              data: transformedUpdatedData?.MentalStatusExamination ?? null,
            },
          },
        },
        include: {
          MentalStatusExamination: true,
        },
      });

      return updatedMentalStatusExamination;
    } catch (error) {
      throw error;
    }
  }
}
