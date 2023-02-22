import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

@Module({
  controllers: [TodosController, TodoController],
  providers: [TodoService],
})
export class TodoModule {}
