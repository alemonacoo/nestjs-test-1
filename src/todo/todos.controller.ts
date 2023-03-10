import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateToDoDto } from './dto/create-todo.dto';
import { TodoService } from './todo.service';

@UseGuards(JwtGuard)
@Controller('projects/:project/todos')
export class TodosController {
  constructor(private toDoService: TodoService) {}

  // get all to-do's
  @Get()
  getToDos(
    @Param('project', ParseIntPipe) projectId: number,
    @GetUser('id') userId: number,
  ) {
    return this.toDoService.getToDos(projectId, userId);
  }

  // Create to-do
  @Post()
  createToDo(
    @Param('project', ParseIntPipe) projectId: number,
    @Body() dto: CreateToDoDto,
    @GetUser('id') userId: number,
  ) {
    return this.toDoService.createToDo(
      projectId,
      dto,
      userId,
    );
  }
}
