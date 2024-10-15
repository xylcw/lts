// 模拟用户数据库
let users = [];

// 获取页面元素
const loginRegisterDiv = document.getElementById('login-register');
const chatRoomDiv = document.getElementById('chat-room');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// 登录功能
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    loginRegisterDiv.style.display = 'none';
    chatRoomDiv.style.display = 'block';
    loadChatHistory(user.username);
  } else {
    alert('用户名或密码错误');
  }
});

// 注册功能
registerBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  if (users.find(u => u.username === username)) {
    alert('用户名已存在');
  } else {
    users.push({ username, password });
    alert('注册成功');
  }
});

// 发送消息功能
sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    const username = localStorage.getItem('loggedInUser');
    saveMessage(username, message);
    displayMessage(username, message, true);
    messageInput.value = '';
  }
});

// 保存消息到本地存储
function saveMessage(username, message) {
  const messages = JSON.parse(localStorage.getItem(username)) || [];
  messages.push({ sender: username, content: message });
  localStorage.setItem(username, JSON.stringify(messages));
}

// 加载特定用户的聊天历史
function loadChatHistory(username) {
  const messages = JSON.parse(localStorage.getItem(username)) || [];
  messages.forEach(msg => {
    displayMessage(msg.sender, msg.content, msg.sender === username);
  });
}

// 显示消息
function displayMessage(sender, content, isSelf) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isSelf? 'self-message' : 'other-message');
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${content}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 自动刷新聊天内容
setInterval(() => {
  const username = localStorage.getItem('loggedInUser');
  if (username) {
    loadChatHistory(username);
  }
}, 1000);

// 退出登录逻辑
setInterval(() => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (lastActivity && new Date() - new Date(lastActivity) > 60 * 60 * 1000) {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('lastActivity');
    loginRegisterDiv.style.display = 'block';
    chatRoomDiv.style.display = 'none';
  }
}, 60000);

// 监听输入事件以更新最后活动时间
messageInput.addEventListener('input', () => {
  localStorage.setItem('lastActivity', new Date());
});