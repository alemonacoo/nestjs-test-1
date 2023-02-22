import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { TodoService } from './todo.service';

@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {}
