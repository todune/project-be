import { Server, Socket } from 'socket.io'
import logger from './common/logger'

// Define the structure of online users
interface OnlineUser {
     userId: string
     socketId: string
}

let onlineUsers: OnlineUser[] = []

// Add user to the onlineUsers array if they are not already present
const addUser = (userId: string, socketId: string) => {
     if (!onlineUsers.some((user) => user.userId === userId)) {
          onlineUsers.push({ userId, socketId })
     }
}

// Remove user from the onlineUsers array based on socketId
const removeUser = (socketId: string) => {
     onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

// Get a user from the onlineUsers array based on userId
const getUser = (userId: string) => {
     return onlineUsers.find((user) => user.userId === userId)
}

// Socket.IO handler function
const socketHandler = (io: Server) => {
     io.on('connection', (socket: Socket) => {
          logger.info(`User ${socket.id} connected to socket.io`)

          // Add user when they connect
          socket.on('addUser', ({ userId }: { userId: string }) => {
               addUser(userId, socket.id)
               socket.join(userId) // add every user to a new room
          })

          // Send notifications
          // socket.on('send-notifications', (data: any) => {
          //      const receiverUser = getUser(data.receiver)
          //      if (receiverUser) {
          //           socket
          //                .to(receiverUser.socketId)
          //                .emit('get-notifications', data)
          //      }
          // })

          // Handle disconnection
          socket.on('disconnect', () => {
               logger.info(`User ${socket.id} disconnected...`)
               removeUser(socket.id)
          })
     })
}
// SocketService.ts
export class SocketService {
     private static instance: Server

     public static initialize(server: any) {
          if (!this.instance) {
               this.instance = new Server(server, {
                    pingTimeout: 60000,
                    cors: {
                         // Thêm các cài đặt CORS nếu cần thiết
                    },
               })

               socketHandler(this.instance)
          }
     }

     public static getInstance() {
          return this.instance
     }
}

// export { socketHandler }
