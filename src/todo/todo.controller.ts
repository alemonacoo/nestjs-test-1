import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { TodoService } from './todo.service';

@UseGuards(JwtGuard)
@Controller('todos/')
export class TodoController {
  constructor(private toDoService: TodoService) {}

  // Get to-do by id
  @Get(':id')
  getToDo(@Param('id', ParseIntPipe) toDoId: number) {
    return this.toDoService.getToDo(toDoId);
  }
}
