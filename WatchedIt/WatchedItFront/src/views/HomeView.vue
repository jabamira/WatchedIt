<template>
  <div class="flex justify-center items-top h-screen w-screen">

    <!-- Основной чат -->
    <div class="flex space-x-4 w-11/12 max-w-6xl">

      <!-- Список комнат -->
      <div class="flex flex-col w-48 space-y-2">
       
        <button @click="createRoom">Создать комнату</button>
        <div v-if="newRoomCode">Код вашей комнаты: {{ newRoomCode }}</div>
        <input v-model="roomCodeInput" @keyup.enter="joinByCode" placeholder="Введите код комнаты" />
        <button :disabled="!roomCodeInput.trim()" @click="joinByCode">Войти</button>
        <h4 class="">Активные Комнаты</h4>
        <div v-for="code in rooms" :key="code" @click="joinRoom(code)" :class="{ 'font-bold': currentRoom === code }">
          {{ code }}
        </div>
      </div>

      <!-- Чат и участники -->
      <div class="flex flex-1 space-x-4">

        <!-- Чат -->
        <div v-if="currentRoom" class="flex flex-col flex-3 w-2/3">
          <h3>Комната {{ currentRoom }}</h3>
          <div class="flex-1 overflow-y-auto mb-2 h-96">
            <div v-for="msg in messages" :key="msg.id">
              <b>{{ msg.username }}:</b> {{ msg.text }}
            </div>
          </div>
          <div class="flex space-x-2">
            <input v-model="inputMsg" @keyup.enter="sendMsg" placeholder="Сообщение..." class="w-100" />
            <button :disabled="!inputMsg.trim()" @click="sendMsg">Отправить</button>
          </div>
        </div>

        <!-- Участники -->
        <div v-if="currentRoom" class="flex flex-col w-48">
          <h4>Участники</h4>
          <div v-for="u in roomUsers" :key="u.id">{{ u.username }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client"

export default {
  data() {
    return {
      socket: null,
      username: "",
      inputUsername: "",
      rooms: [],
      currentRoom: null,
      messages: [],
      roomUsers: [],
      inputMsg: "",
      roomCodeInput: "",
      newRoomCode: "",
      error: null
    }
  },

  methods: {
    setUsername() {
      if (!this.inputUsername.trim()) return
      this.username = this.inputUsername.trim()
      this.socket.emit("setUsername", this.username)
    },
    createRoom() {
      this.socket.emit("createRoom")
    },
     joinRoom(code) {
    if (!code) return
    this.socket.emit("joinRoomByCode", code)
  },
  joinByCode() {
    if (!this.roomCodeInput.trim()) return
    this.joinRoom(this.roomCodeInput.trim())
    this.roomCodeInput = ""
  },
    sendMsg() {
      if (!this.inputMsg.trim() || !this.currentRoom) return
      this.socket.emit("chatMessage", this.inputMsg.trim())
      this.inputMsg = ""
    }
  },

  mounted() {
    this.socket = io("http://localhost:3000")
  this.socket.on("roomsList", list => {
    this.rooms = list;
  });
    
    this.socket.on("roomCreatedForUser", code => {
      this.newRoomCode = code
      this.joinRoom(code)
    })
    this.socket.on("roomCreated", code => this.rooms.push(code))
   this.socket.on("roomJoined", code => {
    this.currentRoom = code
    this.messages = []
  })

  this.socket.on("roomMessages", msgs => {
    this.messages = msgs
  })

  this.socket.on("roomUsers", users => {
    this.roomUsers = users
  })
    this.socket.on("chatMessage", msg => this.messages.push(msg))
 
    this.socket.on("error", msg => {
      this.error = msg
      setTimeout(() => this.error = null, 3000)
    })
  }
}
</script>
