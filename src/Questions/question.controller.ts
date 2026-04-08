import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { QuestionsService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Post()
  async ask(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  async list(@Query('unread') unread: string) {
    return this.questionsService.getAllQuestions(unread === 'true');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateData: {
      category?: string;
      categoryId?: string;
      status?: any;
      moderatorResponse?: string | null;
    },
  ) {
    return this.questionsService.updateQuestion(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionsService.deleteQuestion(id);
  }
}