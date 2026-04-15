import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class QuestionsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log("Cliente conectado:", client.id);
  }

  emitNewQuestion(question: any) {
    console.log("EMITIENDO SOCKET", question);
    this.server.emit('new_question_received', question);
  }

  emitQuestionUpdated(question: any) {
    this.server.emit('question_updated', question);
  }

  emitQuestionDeleted(id: string) {
    this.server.emit('question_deleted', { id });
  }
}