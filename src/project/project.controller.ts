import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProjectDto, EditProjectDto } from './dto';
import { ProjectService } from './project.service';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // Get projects
  @Get()
  getProjects(@GetUser('id') userId: number) {
    return this.projectService.getProjects(userId);
  }

  // Get project by id
  @Get(':id')
  getProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.getProjectById(
      userId,
      projectId,
    );
  }

  // Create project
  @Post()
  createProject(
    @GetUser('id') userId: number,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.createProject(userId, dto);
  }

  // Edit project by id
  @Patch(':id')
  editProjectById(
    @GetUser('id') userId: number,
    @Body() dto: EditProjectDto,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.editProjectById(
      userId,
      dto,
      projectId,
    );
  }

  // Delete project by id
  @Delete(':id')
  deleteProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.deleteProjectById(
      userId,
      projectId,
    );
  }
}
