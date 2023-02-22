import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from 'src/project/dto';
import { CreateToDoDto } from './dto/create-todo.dto';
import { EditToDoDto } from './dto/edit-todo.dto';

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

  // Get To-Do by Id
  async getToDo(toDoId: number) {
    return await this.prisma.todo.findFirst({
      where: {
        id: toDoId,
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

  // Edit to-do
  async editToDo(toDoId: number, dto: EditToDoDto) {
    return this.prisma.todo.update({
      where: {
        id: toDoId,
      },
      data: {
        ...dto,
      },
    });
  }
}