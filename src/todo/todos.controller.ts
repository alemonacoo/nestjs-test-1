import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  ) {
    return this.toDoService.getToDos(projectId);
  }

  // Create to-do
  @Post()
  createToDo(
    @Param('project', ParseIntPipe) projectId: number,
    @Body() dto: CreateToDoDto,
  ) {
    return this.toDoService.createToDo(projectId, dto);
  }
}
