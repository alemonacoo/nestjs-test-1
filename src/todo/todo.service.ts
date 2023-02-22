import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from 'src/project/dto';
import { CreateToDoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Get All TO-DOs in project
  async getToDos(projectId: number) {
    return await this.prisma.todo.findMany({
      where: {
        projectId,
      },
    });
  }

  // Create new TO-DO in project
  async createToDo(projectId: number, dto: CreateToDoDto) {
    return await this.prisma.todo.create({
      data: {
        projectId,
        ...dto,
      },
    });
  }
}
