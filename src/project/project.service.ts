import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, EditProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // Get projects
  getProjects(userId: number) {}

  // Get project by id
  getProjectById(userId: number, projectId: number) {}

  // Create project
  createProject(userId: number, dto: CreateProjectDto) {}

  // Edit project
  editProjectById(userId: number, dto: EditProjectDto) {}

  // Delete project
  deleteProjectById(userId: number, projectId: number) {}
}
