/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class EmergencyContact {
  private prisma = new PrismaClient();

  async createEmergencyContact(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create EmergencyContact record
      const emergencyContact = await this.prisma.emergencyContact.create({
        data: {
          name: params.seekerData.EmergencyContact.name,
          relationship: params.seekerData.EmergencyContact.relationship,
          proximity: params.seekerData.EmergencyContact.proximity,
          contact: params.seekerData.EmergencyContact.contact,
          seekerId: params.seekerId, // Assuming seekerId is the foreign key
        },
      });

      // Return the created emergency contact data
      return emergencyContact;
    } catch (error) {
      throw error;
    }
  }

  async getEmergencyContact(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          EmergencyContact: {
            select: {
              name: true,
              relationship: true,
              proximity: true,
              contact: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        name: string;
        contactInfo: string;
        proximity: string;
        relationship: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          name: item.EmergencyContact.name,
          contactInfo: item.EmergencyContact.contact,
          proximity: item.EmergencyContact.proximity,
          relationship: item.EmergencyContact.relationship,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updateEmergencyContact(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      const transformedUpdatedData = {
        EmergencyContact: {
          name: params.seekerData?.name ?? null,
          relationship: params.seekerData?.relationship ?? null,
          proximity: params.seekerData?.proximity ?? null,
          contact: params.seekerData?.contactInfo ?? null,
        },
      };

      const updatedEmergencyContact = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          EmergencyContact: {
            update: {
              data: transformedUpdatedData.EmergencyContact,
            },
          },
        },
        include: {
          EmergencyContact: true,
        },
      });

      return updatedEmergencyContact;
    } catch (error) {
      throw error;
    }
  }
}
