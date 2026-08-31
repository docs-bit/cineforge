import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
