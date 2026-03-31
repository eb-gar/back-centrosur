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
  server: Server;

  handleConnection(client: Socket) {
    const eventId = client.handshake.query.eventId as string;

    if (eventId) {
      client.join(eventId);
      console.log(`Cliente unido al evento ${eventId}`);
    }
  }

  sendNewQuestion(question: any, eventId: string) {
    this.server.to(eventId).emit('new-question', question);
  }
}