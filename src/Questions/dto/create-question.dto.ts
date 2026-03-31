import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(5, { message: 'La pregunta es muy corta' })
  @MaxLength(300, { message: 'La pregunta es muy larga' })
  content: string;
}