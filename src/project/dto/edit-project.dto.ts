import { IsOptional, IsString } from 'class-validator';

export class EditProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  descritpion?: string;
}
