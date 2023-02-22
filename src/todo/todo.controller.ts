import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { EditToDoDto } from './dto/edit-todo.dto';
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

  // Edit to-do by id
  @Patch(':id')
  editToDo(
    @Param('id', ParseIntPipe) toDoId: number,
    @Body() dto: EditToDoDto,
  ) {
    return this.toDoService.editToDo(toDoId, dto);
  }
}
