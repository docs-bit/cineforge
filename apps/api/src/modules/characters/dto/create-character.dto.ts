import { IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @IsArray()
  @IsString({ each: true })
  referenceImages!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  provenanceNotes?: string;

  @IsIn(['confirmed'])
  consentStatus!: 'confirmed';
}
