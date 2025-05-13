let socket;
let currentRoomId;
let authToken;
let currentUsername;

const log = (msg, isChatEvent = false) => {
  // Only log chat room events
  if (!isChatEvent) {
    return;
  }

  const logBox = document.getElementById('log');
  const timestamp = new Date().toLocaleTimeString();
  logBox.textContent += `[${timestamp}] ${msg}\n`;
  logBox.scrollTop = logBox.scrollHeight;

  // Also log to console for debugging
  console.log(`[${timestamp}] ${msg}`);
};

const clearLog = () => {
  document.getElementById('log').textContent = '';
};

const showError = (message) => {
  document.getElementById('loginStatus').textContent = message;
  document.getElementById('loginStatus').style.color = 'red';
};

const showSuccess = (message) => {
  document.getElementById('loginStatus').textContent = message;
  document.getElementById('loginStatus').style.color = 'green';
};

function toggleAuthForms() {
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('signupForm').classList.toggle('hidden');
  document.getElementById('loginStatus').textContent = '';
}

async function signup() {
  const username = document.getElementById('newUsername').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('newPassword').value;

  if (!username || !email || !password) {
    showError('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      throw new Error(data.message || 'Signup failed');
    }

    showSuccess('Account created successfully! You can now login.');

    toggleAuthForms();

    document.getElementById('username').value = username;
  } catch (error) {
    showError(error.message || 'Signup failed');
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('Please enter both username and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail: username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    authToken = data.access_token;
    currentUsername = username;

    showSuccess('Login successful!');

    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('chatSection').classList.remove('hidden');

    initializeSocket();
  } catch (error) {
    showError(error.message || 'Login failed');
  }
}

function logout() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  authToken = null;
  currentRoomId = null;
  currentUsername = null;

  document.getElementById('currentRoomDisplay').textContent = 'None';
  document.getElementById('chatSection').classList.add('hidden');
  document.getElementById('loginSection').classList.remove('hidden');

  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('roomName').value = '';
  document.getElementById('messageInput').value = '';
}

function initializeSocket() {
  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:3000', {
    auth: { token: authToken },
  });

  socket.on('connect', () => {
    // Connection established, no need to log
  });

  socket.on('connect_error', (error) => {
    showError(`Connection Error: ${error.message}`);
  });

  socket.on('disconnect', () => {
    // Disconnected, no need to log
  });

  socket.on('joinedRoom', (data) => {
    currentRoomId = data.roomName;
    document.getElementById('currentRoomDisplay').textContent = data.roomName;
    log(`🟢 You joined Room ${data.roomName}`, true);
  });

  socket.on('userJoined', (data) => {
    log(`👋 ${data.username} joined the room ${data.roomName}`, true);
  });

  socket.on('previousMessages', (messages) => {
    clearLog(); // Clear logs before showing previous messages
    log(`📚 Received ${messages.length} previous messages`, true);
    messages.forEach((msg) => {
      log(
        `📩 [${new Date(msg.sentAt).toLocaleTimeString()}] ${msg.sender.username}: ${msg.content}`,
        true,
      );
    });
  });

  socket.on('newMessage', (msg) => {
    log(`📩 ${msg.sender.username}: ${msg.content}`, true);
  });

  socket.on('userTyping', (data) => {
    if (data.isTyping) {
      log(`✍️ ${data.username} is typing...`, true);
    } else {
      log(`✍️ ${data.username} stopped typing`, true);
    }
  });

  socket.on('error', (err) => {
    log(`❌ WebSocket Error: ${err.message}`, true);
  });
}

function joinRoom() {
  const roomName = document.getElementById('roomName').value.trim();
  if (!roomName) {
    log('❌ Please enter a room name', true);
    return;
  }

  socket.emit('joinRoom', { roomName });
}

function sendMessage() {
  if (!currentRoomId) {
    log('❌ Please join a room first', true);
    return;
  }

  const content = document.getElementById('messageInput').value.trim();
  if (!content) {
    log('❌ Please enter a message', true);
    return;
  }

  socket.emit('sendMessage', {
    roomName: currentRoomId,
    content: content,
  });

  document.getElementById('messageInput').value = '';
}

function sendTyping(isTyping) {
  if (!currentRoomId) {
    log('❌ Please join a room first', true);
    return;
  }

  socket.emit('typing', {
    roomName: currentRoomId,
    isTyping: isTyping,
  });
}
