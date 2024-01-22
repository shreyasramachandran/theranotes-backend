/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

export class PeersAndSocialHistory {
  private prisma = new PrismaClient();

  async createPeersAndSocialHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Create PeersAndSocialHistory record
      const peersAndSocialHistory =
        await this.prisma.peersAndSocialHistory.create({
          data: {
            relationshipWithPeers:
              params.seekerData.PeersAndSocialHistory.relationshipWithPeers,
            friendships: params.seekerData.PeersAndSocialHistory.friendships,
            seekerId: params.seekerId, // Assuming seekerId is the foreign key
          },
        });

      // Return the created PeersAndSocialHistory data
      return peersAndSocialHistory;
    } catch (error) {
      throw error;
    }
  }

  async getPeersAndSocialHistory(seekerId: string): Promise<any> {
    try {
      const data = await this.prisma.seekers.findMany({
        where: { id: seekerId },
        include: {
          PeersAndSocialHistory: {
            select: {
              relationshipWithPeers: true,
              friendships: true,
            },
          },
        },
      });

      // Map it as according to how you want it to be rendered on frontend
      interface InterfaceData {
        relationshipWithPeers: string;
        relationshipWithFriendships: string;
        yourComments: string;
      }

      // Transform the data to be sent to frontend
      function transformData(sourceArray: any): InterfaceData[] {
        return sourceArray.map((item) => ({
          relationshipWithPeers:
            item.PeersAndSocialHistory.relationshipWithPeers,
          relationshipWithFriendships:
            item.PeersAndSocialHistory.relationshipWithFriendships,
          yourComments: 'No comments',
        }));
      }

      const transformedData = transformData(data);
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async updatePeersAndSocialHistory(params: {
    seekerId: string;
    seekerData: any;
  }): Promise<any> {
    try {
      // Transforming the incoming seekerData into the format expected by Prisma
      const transformedUpdatedData = {
        PeersAndSocialHistory: {
          relationshipWithPeers:
            params.seekerData?.relationshipWithPeers ?? null,
          friendships: params.seekerData?.friendships ?? null,
        },
      };

      // Updating the PeersAndSocialHistory in the database
      const updatedPeersAndSocialHistory = await this.prisma.seekers.update({
        where: { id: params.seekerId },
        data: {
          PeersAndSocialHistory: {
            update: {
              data: transformedUpdatedData.PeersAndSocialHistory,
            },
          },
        },
        include: {
          PeersAndSocialHistory: true,
        },
      });

      return updatedPeersAndSocialHistory;
    } catch (error) {
      throw error;
    }
  }
}
