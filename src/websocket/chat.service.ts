import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  roomName: string;
  sentAt: Date;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];
  private messageIdCounter = 1;

  constructor(private jwtService: JwtService) {}

  getUserFromSocket(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      return null;
    }

    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  createMessage(
    userId: string,
    username: string,
    roomName: string,
    content: string,
  ): ChatMessage {
    const message = {
      id: String(this.messageIdCounter++),
      content,
      sender: {
        id: userId,
        username,
      },
      roomName,
      sentAt: new Date(),
    };

    this.messages.push(message);

    const roomMessages = this.messages.filter((m) => m.roomName === roomName);
    if (roomMessages.length > 100) {
      const oldestMessageIndex = this.messages.findIndex(
        (m) => m.roomName === roomName && m.id === roomMessages[0].id,
      );
      if (oldestMessageIndex !== -1) {
        this.messages.splice(oldestMessageIndex, 1);
      }
    }

    return message;
  }

  getRoomMessages(roomName: string): ChatMessage[] {
    return this.messages.filter((message) => message.roomName === roomName);
  }
}
