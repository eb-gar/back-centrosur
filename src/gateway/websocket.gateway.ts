import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuestionsGateway {
  @WebSocketServer()
  server!: Server;

  emitNewQuestion(question: any) {
    this.server.emit('new_question_received', question);
  }

  emitQuestionUpdated(question: any) {
    this.server.emit('question_updated', question);
  }

  emitQuestionDeleted(id: string) {
    this.server.emit('question_deleted', { id });
  }
}