import { Controller, Get, Post, Body } from '@nestjs/common';
import { CrudService } from './crud.service';
import { Users, UserAttributes, Conversations, Messages } from '@prisma/client'

@Controller()
export class CrudController{
    constructor(private readonly crudService: CrudService) {}

    @Get('users')
    getUsers(): Promise<Users[]>{
        return this.crudService.getAllUsers();
    }

    @Post('users')
    createUser(
        @Body() data: { name?: string; email: string},
    ): Promise<Users>{
        return this.crudService.createUser(data);
    }
}