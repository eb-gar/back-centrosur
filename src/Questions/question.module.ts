import { Module } from '@nestjs/common';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { QuestionsGateway } from '../gateway/websocket.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [QuestionsController],
    providers: [QuestionsService, QuestionsGateway],
    exports: [QuestionsService],
})
export class QuestionModule { }
