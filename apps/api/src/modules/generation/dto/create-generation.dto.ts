import { IsObject, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateGenerationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  modelId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  inputType!: string;

  @IsObject()
  inputData!: Record<string, unknown>;

  @IsObject()
  parameters!: Record<string, unknown>;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  idempotencyKey?: string;
}
