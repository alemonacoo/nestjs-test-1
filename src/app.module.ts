import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

@Module({
  imports: [AuthModule, UserModule, TodoModule, PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class AppModule {}
