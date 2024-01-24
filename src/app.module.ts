/* eslint-disable prettier/prettier */
import { Module, Logger } from '@nestjs/common';
import { CrudModule } from './crud/crud.module';
import { LoggerService } from './logger.service';

@Module({
  imports: [CrudModule],
  providers: [Logger, LoggerService], // Include Logger and LoggerService as providers
  exports: [Logger, LoggerService], // Export them for usage in other modules
})
export class AppModule {}
