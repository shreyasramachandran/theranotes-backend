/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class SeekerProgress {
  private prisma = new PrismaClient();

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

      interface InterfaceData {
        seekerProgressId: string;
        progressSubject: string;
        progressBody: string;
        createdAt: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          seekerProgressId: item.id,
          progressSubject: item.progressSubject,
          progressBody: item.progressBody,
          time: item.createdAt,
        }));
      }
      const transformedSeekerProgress = transformData(seekerProgressDetails);
      console.log('Get Seeker Progress: ', transformedSeekerProgress);
      return transformedSeekerProgress;
    } catch (error) {
      throw error;
    }
  }

  async createSeekerProgress(data: {
    seekerId: string;
    progressSubject: string;
    progressBody: string;
  }): Promise<any> {
    try {
      console.log(
        'Inside CREATE SEEKER PROGRESS:\n\n',
        'data.seekerId:',
        data.seekerId,
        'data.progressSubject:',
        data.progressSubject,
        'data.progressBody:',
        data.progressBody,
      );
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
      return this.prisma.seekerProgress.update({
        where: { id: data.seekerProgressId },
        data: {
          progressSubject: data.progressSubject,
          progressBody: data.progressBody,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete seeker progress
  async deleteSeekerProgress(data: { seekerProgressId: string }): Promise<any> {
    try {
      return this.prisma.seekerProgress.delete({
        where: { id: data.seekerProgressId },
      });
    } catch (error) {
      throw error;
    }
  }
}
