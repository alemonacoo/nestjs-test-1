import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodosController],
  providers: [TodoService],
})
export class TodoModule {}
