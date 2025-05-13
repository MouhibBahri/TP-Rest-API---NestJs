import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService, ChatMessage } from './chat.service';
import { Server, Socket } from 'socket.io';

interface JoinRoomDto {
  roomName: string;
}

interface SendMessageDto {
  roomName: string;
  content: string;
}

interface TypingDto {
  roomName: string;
  isTyping: boolean;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const user = this.chatService.getUserFromSocket(client);
    if (user) {
      client.data.user = user;
      console.log('User connected:', user.username);
    } else {
      console.log('Unauthenticated connection attempt');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      console.log('User disconnected:', client.data.user.username);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    const { roomName } = data;
    if (!roomName) {
      throw new WsException('Room name is required');
    }

    client.join(roomName);

    const messages = this.chatService.getRoomMessages(roomName);
    client.emit('previousMessages', messages);

    client.emit('joinedRoom', { roomName });

    const user = client.data.user;

    // Broadcast to all clients in the room that a new user has joined
    // Use broadcast.to() to send to all clients in the room except the sender
    client.broadcast.to(roomName).emit('userJoined', {
      userId: user.sub,
      username: user.username,
      roomName,
    });

    // Also send a system message to the room about the new user
    const joinMessage = {
      id: 'system-' + Date.now(),
      content: `${user.username} has joined the room`,
      sender: {
        id: 'system',
        username: 'System',
      },
      roomName,
      sentAt: new Date(),
    };

    // Broadcast the join message to everyone in the room except the sender
    client.broadcast.to(roomName).emit('newMessage', joinMessage);

    console.log(`User ${user.username} joined room ${roomName}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ): ChatMessage {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    const { roomName, content } = data;
    if (!roomName || !content) {
      throw new WsException('Room name and content are required');
    }

    const user = client.data.user;
    const message = this.chatService.createMessage(
      user.sub,
      user.username,
      roomName,
      content,
    );

    this.server.to(roomName).emit('newMessage', message);

    console.log(`Message sent by ${user.username} in room ${roomName}`);

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    const { roomName, isTyping } = data;
    if (!roomName) {
      throw new WsException('Room name is required');
    }

    const user = client.data.user;

    // Broadcast typing status to all clients except the sender
    client.broadcast.to(roomName).emit('userTyping', {
      userId: user.sub,
      username: user.username,
      isTyping,
    });

    console.log(
      `User ${user.username} ${isTyping ? 'started' : 'stopped'} typing in room ${roomName}`,
    );
  }
}
