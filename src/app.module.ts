import { Module } from '@nestjs/common';
import { CrudModule } from './operations/data/prisma/crud/crud.module';

@Module({
    imports: [CrudModule],
})
export class AppModule {}
