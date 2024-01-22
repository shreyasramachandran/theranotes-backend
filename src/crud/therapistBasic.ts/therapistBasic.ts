/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class TherapistBasic {
  private prisma = new PrismaClient();

  async createNewTherapist(data): Promise<any> {
    try {
      const result = await this.prisma.therapists.create({
        data: data,
      });

      return result;
    } catch (error) {
      // Check if the error is due to a duplicate entry
      if (error.meta?.target?.includes('Therapists_clerkUserId_key')) {
        console.warn(
          'WARN::Therapist with the same ClerkUserId already exists.',
        );
        return {
          warning: 'Therapist with the same ClerkUserId already exists.',
        };
      }

      throw error;
    }
  }

  async updateExistingTherapist(data: {
    clerkUserId: string;
    updatedData: any;
  }): Promise<any> {
    try {
      return this.prisma.therapists.update({
        where: { clerkUserId: data.clerkUserId },
        data: data.updatedData,
      });
    } catch (error) {
      throw error;
    }
  }
}
