import { Module } from '@nestjs/common';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { QuestionsGateway } from '../gateway/websocket.gateway';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [QuestionsController],
    providers: [QuestionsService, QuestionsGateway],
    exports: [QuestionsService],
})
export class QuestionModule { }
