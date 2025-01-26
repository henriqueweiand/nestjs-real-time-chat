import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(3005, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Client connected', client.id);

    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected', client.id);

    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: any): void {
    console.log('New message:', message);
    this.server.emit('message', message);
  }
}
