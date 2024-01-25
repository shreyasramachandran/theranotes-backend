/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { LoggerService } from 'src/logger.service';

@Module({
  controllers: [CrudController],
  providers: [CrudService, LoggerService],
  imports: [LoggerService],
})
export class CrudModule {}
