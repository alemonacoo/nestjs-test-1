import { Injectable } from '@nestjs/common';
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
  editProjectById(
    userId: number,
    dto: EditProjectDto,
    projectId: number,
  ) {}

  // Delete project
  deleteProjectById(userId: number, projectId: number) {}
}
