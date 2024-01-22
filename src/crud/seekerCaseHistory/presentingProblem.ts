/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class PresentingProblem {
  private prisma = new PrismaClient();

  async createPresentingProblem(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const createdData = await this.prisma.presentingProblem.create({
        data: {
          seekerId: params.seekerId,
          // Creating related EpisodicDocumentation records
          EpisodicDocumentation: {
            create: {
              timestamp: params.seekerData.EpisodicDocumentation.timestamp,
              verbatim: params.seekerData.EpisodicDocumentation.verbatim,
              onset: params.seekerData.EpisodicDocumentation.onset,
              duration: params.seekerData.EpisodicDocumentation.duration,
              course: params.seekerData.EpisodicDocumentation.course,
              yourComments:
                params.seekerData.EpisodicDocumentation.yourComments,
            },
          },

          // Creating related HistoryOfPresentProblem records
          HistoryOfPresentProblem: {
            create: {
              timestamp: params.seekerData.HistoryOfPresentProblem.timestamp,
              keySymptoms:
                params.seekerData.HistoryOfPresentProblem.keySymptoms,
              precipitatingFactors:
                params.seekerData.HistoryOfPresentProblem.precipitatingFactors,
              predisposingFactors:
                params.seekerData.HistoryOfPresentProblem.predisposingFactors,
              perpetuatingFactors:
                params.seekerData.HistoryOfPresentProblem.perpetuatingFactors,
              protectiveFactors:
                params.seekerData.HistoryOfPresentProblem.protectiveFactors,
              summary: params.seekerData.HistoryOfPresentProblem.summary,
            },
          },
        },
        // Optionally include relations in the response
        include: {
          EpisodicDocumentation: true,
          HistoryOfPresentProblem: true,
        },
      });
      return createdData;
    } catch (error) {
      throw error;
    }
  }

  async getPresentingProblem(seekerId: string): Promise<any> {
    try {
      const presentingProblemData =
        await this.prisma.presentingProblem.findMany({
          where: { seekerId: seekerId },
          include: {
            EpisodicDocumentation: {
              select: {
                timestamp: true,
                verbatim: true,
                onset: true,
                duration: true,
                course: true,
                yourComments: true,
              },
            },
            HistoryOfPresentProblem: {
              select: {
                timestamp: true,
                keySymptoms: true,
                precipitatingFactors: true,
                predisposingFactors: true,
                perpetuatingFactors: true,
                protectiveFactors: true,
                summary: true,
              },
            },
          },
        });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        clientWords: string;
        onset: string;
        duration: string;
        keySymptoms: string;
        precipitatingFactors: string;
        predisposingFactors: string;
        perpetuatingFactors: string;
        protectiveFactors: string;
        summary: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          clientWords: item.EpisodicDocumentation.verbatim,
          onset: item.EpisodicDocumentation.onset,
          duration: item.EpisodicDocumentation.duration,
          keySymptoms: item.HistoryOfPresentProblem.keySymptoms,
          precipitatingFactors:
            item.HistoryOfPresentProblem.precipitatingFactors,
          predisposingFactors: item.HistoryOfPresentProblem.predisposingFactors,
          perpetuatingFactors: item.HistoryOfPresentProblem.perpetuatingFactors,
          protectiveFactors: item.HistoryOfPresentProblem.protectiveFactors,
          summary: item.HistoryOfPresentProblem.summary,
          yourComments: 'This one is a fine specimin',
        }));
      }

      const transformedPresentingProblemData = transformData(
        presentingProblemData,
      );
      return transformedPresentingProblemData;
    } catch (error) {
      throw error;
    }
  }

  async updatePresentingProblem(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        EpisodicDocumentation: {
          verbatim: params.seekerData?.clientWords ?? null,
          onset: params.seekerData?.onset ?? null,
          duration: params.seekerData?.duration ?? null,
          yourComments: params.seekerData?.yourComments ?? null,
        },
        HistoryOfPresentProblem: {
          timestamp: new Date().toISOString(), // Replace with actual timestamp if available
          keySymptoms: params.seekerData?.keySymptoms ?? null,
          precipitatingFactors: params.seekerData?.precipitatingFactors ?? null,
          predisposingFactors: params.seekerData?.predisposingFactors ?? null,
          perpetuatingFactors: params.seekerData?.perpetuatingFactors ?? null,
          protectiveFactors: params.seekerData?.protectiveFactors ?? null,
          summary: params.seekerData?.summary ?? null,
        },
      };

      const updatedPresentingProblem = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          PresentingProblem: {
            update: {
              EpisodicDocumentation: {
                update: {
                  data: transformedUpdatedData.EpisodicDocumentation,
                },
              },
              HistoryOfPresentProblem: {
                update: {
                  data: transformedUpdatedData.HistoryOfPresentProblem,
                },
              },
            },
          },
        },
        include: {
          PresentingProblem: {
            include: {
              EpisodicDocumentation: true,
              HistoryOfPresentProblem: true,
            },
          },
        },
      });
      return updatedPresentingProblem;
    } catch (error) {
      throw error;
    }
  }
}
