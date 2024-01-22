/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class PremorbidPersonality {
  private prisma = new PrismaClient();

  async createPreMorbidPersonality(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create PreMorbidPersonality record
      const preMorbidPersonality =
        await this.prisma.preMorbidPersonality.create({
          data: {
            // Assuming seekerData contains all the necessary fields for PreMorbidPersonality
            opennessToExperience:
              params.seekerData.PreMorbidPersonality.opennessToExperience,
            conscientiousness:
              params.seekerData.PreMorbidPersonality.conscientiousness,
            extraversion: params.seekerData.PreMorbidPersonality.extraversion,
            agreeableness: params.seekerData.PreMorbidPersonality.agreeableness,
            neuroticism: params.seekerData.PreMorbidPersonality.neuroticism,
            introversion: params.seekerData.PreMorbidPersonality.introversion,
            noveltySeeking:
              params.seekerData.PreMorbidPersonality.noveltySeeking,
            impulsiveness: params.seekerData.PreMorbidPersonality.impulsiveness,
            perfectionism: params.seekerData.PreMorbidPersonality.perfectionism,
            humour: params.seekerData.PreMorbidPersonality.humour,
            assertiveness: params.seekerData.PreMorbidPersonality.assertiveness,
            empathy: params.seekerData.PreMorbidPersonality.empathy,
            autonomy: params.seekerData.PreMorbidPersonality.autonomy,
            adaptivity: params.seekerData.PreMorbidPersonality.adaptivity,
            altruism: params.seekerData.PreMorbidPersonality.altruism,
            resilience: params.seekerData.PreMorbidPersonality.resilience,
            patience: params.seekerData.PreMorbidPersonality.patience,
            curiosity: params.seekerData.PreMorbidPersonality.curiosity,
            creativity: params.seekerData.PreMorbidPersonality.creativity,
            defiance: params.seekerData.PreMorbidPersonality.defiance,
            seekerId: params.seekerId, // Assuming seekerId is the foreign key
          },
        });

      // Return the created PreMorbidPersonality data
      return preMorbidPersonality;
    } catch (error) {
      throw error;
    }
  }

  async getPreMorbidPersonality(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          PreMorbidPersonality: {
            select: {
              opennessToExperience: true,
              conscientiousness: true,
              extraversion: true,
              agreeableness: true,
              neuroticism: true,
              introversion: true,
              noveltySeeking: true,
              impulsiveness: true,
              perfectionism: true,
              humour: true,
              assertiveness: true,
              empathy: true,
              autonomy: true,
              adaptivity: true,
              altruism: true,
              resilience: true,
              patience: true,
              curiosity: true,
              creativity: true,
              defiance: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        opennessToExpression: string;
        conscientiousness: string;
        extraversion: string;
        agreeableness: string;
        neuroticism: string;
        introversion: string;
        patience: string;
        curiosity: string;
        creativity: string;
        defiance: string;
        noveltySeeking: string;
        impulsiveness: string;
        perfectionism: string;
        humour: string;
        assertiveness: string;
        empathy: string;
        autonomy: string;
        adaptivity: string;
        altruism: string;
        resilience: string;
        comments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          opennessToExpression: item.PreMorbidPersonality?.opennessToExperience,
          conscientiousness: item.PreMorbidPersonality.conscientiousness,
          extraversion: item.PreMorbidPersonality.extraversion,
          agreeableness: item.PreMorbidPersonality.agreeableness,
          neuroticism: item.PreMorbidPersonality.neuroticism,
          introversion: item.PreMorbidPersonality.introversion,
          patience: item.PreMorbidPersonality.patience,
          curiosity: item.PreMorbidPersonality.curiosity,
          creativity: item.PreMorbidPersonality.creativity,
          defiance: item.PreMorbidPersonality.defiance,
          noveltySeeking: item.PreMorbidPersonality.noveltySeeking,
          impulsiveness: item.PreMorbidPersonality.impulsiveness,
          perfectionism: item.PreMorbidPersonality.perfectionism,
          humour: item.PreMorbidPersonality.humour,
          assertiveness: item.PreMorbidPersonality.assertiveness,
          empathy: item.PreMorbidPersonality.empathy,
          autonomy: item.PreMorbidPersonality.autonomy,
          adaptivity: item.PreMorbidPersonality.adaptivity,
          altruism: item.PreMorbidPersonality.altruism,
          resilience: item.PreMorbidPersonality.resilience,
          comments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updatePreMorbidPersonality(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        PreMorbidPersonality: {
          opennessToExperience: params.seekerData?.opennessToExpression ?? null,
          conscientiousness: params.seekerData?.conscientiousness ?? null,
          extraversion: params.seekerData?.extraversion ?? null,
          agreeableness: params.seekerData?.agreeableness ?? null,
          neuroticism: params.seekerData?.neuroticism ?? null,
          introversion: params.seekerData?.introversion ?? null,
          noveltySeeking: params.seekerData?.noveltySeeking ?? null,
          impulsiveness: params.seekerData?.impulsiveness ?? null,
          perfectionism: params.seekerData?.perfectionism ?? null,
          humour: params.seekerData?.humour ?? null,
          assertiveness: params.seekerData?.assertiveness ?? null,
          empathy: params.seekerData?.empathy ?? null,
          autonomy: params.seekerData?.autonomy ?? null,
          adaptivity: params.seekerData?.adaptivity ?? null,
          altruism: params.seekerData?.altruism ?? null,
          resilience: params.seekerData?.resilience ?? null,
          patience: params.seekerData?.patience ?? null,
          curiosity: params.seekerData?.curiosity ?? null,
          creativity: params.seekerData?.creativity ?? null,
          defiance: params.seekerData?.defiance ?? null,
        },
      };

      const updatedPreMorbidPersonality = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          PreMorbidPersonality: {
            update: {
              data: transformedUpdatedData.PreMorbidPersonality,
            },
          },
        },
        include: {
          PreMorbidPersonality: true,
        },
      });

      return updatedPreMorbidPersonality;
    } catch (error) {
      throw error;
    }
  }
}
