import { Injectable } from '@nestjs/common';
import { Users, UserAttributes, Conversations, Messages, PrismaClient } from '@prisma/client'

@Injectable()
export class CrudService {
    prisma = new PrismaClient()

    async getAllUsers(): Promise<Users[]>{
        return this.prisma.users.findMany()
    }

    async createUser(data): Promise<Users>{
        return this.prisma.users.create({data});
    }
}