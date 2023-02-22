import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  getToDos(projectId: number) {
    return this.prisma.todo.findMany({
      where: {
        projectId,
      },
    });
  }
}
