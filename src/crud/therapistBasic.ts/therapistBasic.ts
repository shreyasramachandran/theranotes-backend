/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger.service';

export class TherapistBasic {
  private prisma = new PrismaClient();
  private logger: LoggerService;

  // Default constructor creates a default logger
  constructor(logger?: LoggerService) {
    this.logger = logger || new LoggerService();
  }

  async createNewTherapist(data): Promise<any> {
    try {
      const result = await this.prisma.therapists.create({
        data: data,
      });
      this.logger.log('Creating New Therapist');
      return result;
    } catch (error) {
      this.logger.error('Error creating New Therapist', error.stack);

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
      this.logger.log('Updating Existing Therapist');

      return this.prisma.therapists.update({
        where: { clerkUserId: data.clerkUserId },
        data: data.updatedData,
      });
    } catch (error) {
      this.logger.error('Error updating Existing Therapist', error.stack);
      throw error;
    }
  }
}
