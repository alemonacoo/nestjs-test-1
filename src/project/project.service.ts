import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, EditProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // Get projects
  getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  // Get project by id
  getProjectById(userId: number, projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  }

  // Create project
  async createProject(
    userId: number,
    dto: CreateProjectDto,
  ) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        ...dto,
      },
    });
    return project;
  }

  // Edit project
  async editProjectById(
    userId: number,
    dto: EditProjectDto,
    projectId: number,
  ) {
    // trovo progetto con id
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    // Guard condition: dobbiamo essere sicuri che il progetto appartenga allo user
    if (!project || project.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    // ri-cerco progetto con id - poi update
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });
  }

  // Delete project
  async deleteProjectById(
    userId: number,
    projectId: number,
  ) {
    // trovo progetto con id
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    // Guard condition: dobbiamo essere sicuri che il progetto appartenga allo user
    if (!project || project.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    // Cancello progetto
    return this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
