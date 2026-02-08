true              &&(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}());

const createElement = ({
  tag,
  className,
  textContent,
  attributes
}) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className.join(" ");
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
};

function createFooter() {
  const footer = createElement({ tag: "footer", className: ["footer"] });
  const school = createElement({ tag: "div", className: ["footer__school"] });
  const logo = createElement({
    tag: "img",
    className: ["footer__logo"],
    attributes: {
      src: "icons/rs.svg",
      alt: "RS School"
    }
  });
  const schoolName = createElement({
    tag: "p",
    textContent: "RS School"
  });
  const github = createElement({ tag: "div", className: ["footer__github"] });
  const authorName = createElement({
    tag: "span",
    className: ["footer__name"],
    textContent: "Eryka Mileuskaya"
  });
  const year = createElement({
    tag: "span",
    className: ["footer__year"],
    textContent: `© ${(/* @__PURE__ */ new Date()).getFullYear()}`
  });
  const info = createElement({ tag: "div", className: ["footer__info"] });
  const image = createElement({
    tag: "div",
    className: ["footer__image"]
  });
  const githubLink = createElement({
    tag: "a",
    className: ["footer__link"],
    textContent: "rika-milew",
    attributes: {
      href: "https://github.com/rika-milew",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  });
  school.append(logo, schoolName);
  github.append(image, githubLink);
  info.append(authorName, year);
  footer.append(school, github, info);
  return footer;
}

function createButton(config) {
  const text = config.text;
  const className = config.className ?? "";
  const disabled = config.disabled ?? false;
  const type = config.type ?? "button";
  const defaultClasses = ["button"];
  const allClasses = className ? [...defaultClasses, className].join(" ") : defaultClasses.join(" ");
  const button = createElement({
    tag: "button",
    className: [allClasses],
    textContent: text,
    attributes: {
      type,
      ...disabled && { disabled: "true" }
    }
  });
  return button;
}

function createEventState() {
  const subscribers = {};
  return {
    on(event, handler) {
      subscribers[event] = subscribers[event] ?? [];
      subscribers[event].push(handler);
    },
    emit(event, payload) {
      const handlers = subscribers[event];
      if (handlers) {
        handlers.forEach((handler) => {
          handler(payload);
        });
      }
    },
    off(event, handler) {
      const handlers = subscribers[event];
      if (!handlers) {
        return;
      }
      if (!handler) {
        handlers.length = 0;
        return;
      }
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    },
    once(event, handler) {
      const wrapper = (payload) => {
        handler(payload);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    }
  };
}
const eventState = createEventState();

const AUTO_CLOSE_DURATION = 1500;
function createPopup(options) {
  const elements = createPopupElements(options);
  return usePopup(elements, options);
}
function createPopupElements(options) {
  const {
    overlayClass,
    containerClass,
    headingContent,
    imageSrc,
    closeButton = true
  } = options;
  const overlay = createElement({ tag: "div", className: [overlayClass] });
  const container = createElement({ tag: "div", className: [containerClass] });
  if (headingContent) {
    const heading = createElement({ tag: "h2", textContent: headingContent });
    container.append(heading);
  }
  const content = createElement({ tag: "p" });
  container.append(content);
  if (imageSrc) {
    const image = createElement({
      tag: "img",
      attributes: { src: imageSrc, width: "100", height: "100" }
    });
    container.append(image);
  }
  let button;
  if (closeButton) {
    button = createButton({
      text: "Close",
      className: "popup-button"
    });
    container.append(button);
  }
  overlay.append(container);
  return { overlay, container, content, button };
}
function usePopup(elements, options) {
  const { overlay, content, button } = elements;
  const { clickToClose = true, messageContent } = options;
  let timeout;
  function hide() {
    overlay.classList.remove("visible");
    content.textContent = "";
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
    if (overlay.parentElement) {
      overlay.remove();
    }
  }
  if (clickToClose) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        hide();
      }
    });
  }
  if (button) {
    button.addEventListener("click", hide);
  }
  function show(message, autoClose, autoCloseDuration = AUTO_CLOSE_DURATION) {
    if (!message) {
      return;
    }
    document.body.append(overlay);
    content.textContent = messageContent ? messageContent(message) : message;
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
    });
    if (timeout) {
      clearTimeout(timeout);
    }
    if (autoClose) {
      timeout = setTimeout(hide, autoCloseDuration);
    }
  }
  return { show, hide };
}
function createReconnectionPopup() {
  const popup = createPopup({
    overlayClass: "popup-overlay",
    containerClass: "popup connection-popup",
    imageSrc: "icons/reconnect.svg",
    clickToClose: false,
    closeButton: false,
    messageContent: (message) => message
  });
  eventState.on("connection:changed", (state) => {
    if (!state) {
      return;
    }
    if (state.connected) {
      popup.hide();
    } else {
      popup.show("Connection lost. Reconnecting...", false);
    }
  });
  return popup;
}
const connectionPopup = createPopup({
  overlayClass: "popup-overlay",
  containerClass: "popup connection-popup",
  imageSrc: "icons/turbo.svg",
  clickToClose: true,
  closeButton: true
});
const notificationPopup = createPopup({
  overlayClass: "popup-overlay",
  containerClass: "popup notification-popup",
  headingContent: "Notification",
  imageSrc: "icons/todo.svg",
  clickToClose: true,
  closeButton: true
});
const errorPopup = createPopup({
  overlayClass: "popup-overlay",
  containerClass: "popup",
  headingContent: "Error",
  imageSrc: "icons/error-svg.svg",
  clickToClose: true,
  closeButton: true
});

let messages = [];
const dialogueStates = /* @__PURE__ */ new Map();
const messageStore = {
  get state() {
    return messages;
  },
  get() {
    return messages;
  },
  set(newMessages) {
    messages = newMessages;
    eventState.emit("messages:changed", messages);
  },
  add(message) {
    messages.push(message);
    eventState.emit("messages:changed", messages);
  },
  edit(messageId, newText) {
    messages = messages.map(
      (message) => message.id === messageId ? { ...message, text: newText, edited: true } : message
    );
    eventState.emit("messages:changed", messages);
  },
  delete(messageId) {
    messages = messages.filter((message) => message.id !== messageId);
    eventState.emit("messages:changed", messages);
  },
  markDelivered(messageId) {
    messages = messages.map(
      (message) => message.id === messageId ? { ...message, delivered: true } : message
    );
    eventState.emit("messages:changed", messages);
  },
  markRead(messageId) {
    messages = messages.map(
      (message) => message.id === messageId ? { ...message, read: true } : message
    );
    eventState.emit("messages:changed", messages);
  },
  getDialog(currentUser, otherUser) {
    return messages.filter(
      (message) => message.senderId === currentUser.login && message.recipientId === otherUser.login || message.senderId === otherUser.login && message.recipientId === currentUser.login
    );
  },
  setDialog(login, messagesFromServer) {
    messages = [
      ...messages.filter((m) => m.senderId !== login && m.recipientId !== login),
      ...messagesFromServer
    ];
    eventState.emit("messages:changed");
  },
  getDialogueState(login) {
    let state = dialogueStates.get(login);
    if (!state) {
      state = { dividerRemoved: false };
      dialogueStates.set(login, state);
    }
    return state;
  },
  reset() {
    messages = [];
    dialogueStates.clear();
    eventState.emit("messages:changed");
  }
};

const userStore = {
  state: {
    login: "",
    password: "",
    isLoggedIn: false,
    isLoggedInOnServer: false,
    errors: {}
  },
  saveCredentials(login, password) {
    this.state.login = login;
    this.state.password = password;
    eventState.emit("user-store:changed", this.state);
  },
  setLogin(login) {
    this.state.login = login;
    eventState.emit("user-store:changed", this.state);
  },
  setPassword(password) {
    this.state.password = password;
    eventState.emit("user-store:changed", this.state);
  },
  showError(field, message) {
    this.state.errors[field] = message;
    eventState.emit("user-store:changed", this.state);
  },
  removeError(field) {
    this.state.errors = Object.fromEntries(
      Object.entries(this.state.errors).filter(([key]) => key !== field)
    );
    eventState.emit("user-store:changed", this.state);
  },
  loginUser() {
    this.state.isLoggedIn = true;
    this.state.isLoggedInOnServer = true;
    this.state.errors = {};
    eventState.emit("user-store:changed", this.state);
  },
  logoutUser() {
    this.state.isLoggedIn = false;
    this.state.isLoggedInOnServer = false;
    this.state.login = "";
    this.state.password = "";
    this.state.errors = {};
    eventState.emit("user-store:changed", this.state);
  },
  isLoggedIn() {
    return this.state.isLoggedIn;
  },
  setServerLogin(value) {
    this.state.isLoggedInOnServer = value;
    eventState.emit("user-store:changed", this.state);
  }
};
let users = [];
const usersStore = {
  get() {
    return users;
  },
  set(newUsers) {
    users = newUsers;
    eventState.emit("users:changed", users);
  },
  getUserState(login) {
    return users.find((user) => user.login === login);
  },
  addUnread(login) {
    users = users.map(
      (user) => user.login === login ? { ...user, unreadCount: user.unreadCount + 1 } : user
    );
    eventState.emit("users:changed", users);
  },
  resetUnread(login) {
    users = users.map((user) => user.login === login ? { ...user, unreadCount: 0 } : user);
    eventState.emit("users:changed", users);
  },
  updateUnreadCount(login, count) {
    users = users.map((user) => user.login === login ? { ...user, unreadCount: count } : user);
    eventState.emit("users:changed", users);
  },
  reset() {
    users = [];
    eventState.emit("users:changed", users);
  }
};

const unreadRequests = /* @__PURE__ */ new Map();
const messageController = {
  sendMessage(to, text) {
    const request = {
      id: crypto.randomUUID(),
      type: "MSG_SEND",
      payload: {
        message: {
          to,
          text
        }
      }
    };
    sendRequest(request);
  },
  handleMessage(message) {
    const serverMessage = message.payload.message;
    const sendMessage = mapServerMessage(serverMessage);
    messageStore.add(sendMessage);
    const from = message.payload.message.from;
    if (from !== userStore.state.login) {
      messageController.getUnreadCount(from);
    }
  },
  getMessagesFromUser(login) {
    const request = {
      id: crypto.randomUUID(),
      type: "MSG_FROM_USER",
      payload: {
        user: {
          login
        }
      }
    };
    sendRequest(request);
  },
  handleMessagesFromUser(message) {
    const serverMessages = message.payload.messages;
    const mapped = serverMessages.map((message2) => mapServerMessage(message2));
    if (mapped.length === 0) {
      return;
    }
    const otherUserLogin = mapped[0].senderId === userStore.state.login ? mapped[0].recipientId : mapped[0].senderId;
    const existingMessages = messageStore.getDialog(
      { login: userStore.state.login },
      { login: otherUserLogin }
    );
    const allMessages = [...existingMessages, ...mapped];
    allMessages.forEach((message2) => {
      if (!message2.delivered && !message2.read) {
        const recipient = usersStore.getUserState(message2.recipientId);
        if (recipient?.isOnline || message2.recipientId === userStore.state.login) {
          message2.delivered = true;
          messageController.markDelivered(message2.id);
        }
      }
    });
    messageStore.setDialog(otherUserLogin, mapped);
  },
  markDelivered(messageId) {
    messageStore.markDelivered(messageId);
  },
  markRead(messageId) {
    messageStore.markRead(messageId);
  },
  markAllRead(login) {
    const currentLogin = userStore.state.login;
    const messages = messageStore.getDialog({ login: currentLogin }, { login });
    messages.filter((message) => !message.read && message.senderId === login).forEach((message) => {
      this.sendReadStatus(message.id);
    });
    usersStore.updateUnreadCount(login, 0);
  },
  sendReadStatus(messageId) {
    const request = {
      id: crypto.randomUUID(),
      type: "MSG_READ",
      payload: {
        message: { id: messageId }
      }
    };
    sendRequest(request);
    messageStore.markRead(messageId);
  },
  getUnreadCount(login) {
    const id = crypto.randomUUID();
    unreadRequests.set(id, login);
    const request = {
      id,
      type: "MSG_COUNT_NOT_READED_FROM_USER",
      payload: {
        user: { login }
      }
    };
    sendRequest(request);
  },
  handleUnreadCount(message) {
    if (message.id === null) {
      return;
    }
    const login = unreadRequests.get(message.id);
    if (!login) {
      return;
    }
    usersStore.updateUnreadCount(login, message.payload.count);
    unreadRequests.delete(message.id);
  },
  deleteMessage(messageId) {
    const message = messageStore.state.find((m) => m.id === messageId);
    if (message?.senderId !== userStore.state.login) {
      return;
    }
    messageStore.delete(messageId);
    if (!message.read) {
      const recipientLogin = message.recipientId;
      const recipientState = usersStore.getUserState(recipientLogin);
      if (recipientState?.unreadCount) {
        usersStore.updateUnreadCount(recipientLogin, recipientState.unreadCount - 1);
      }
    }
    const request = {
      id: crypto.randomUUID(),
      type: "MSG_DELETE",
      payload: { message: { id: messageId } }
    };
    sendRequest(request);
  },
  handleDelete(message) {
    const serverMessageId = message.payload.message.id;
    const deleteMessage = messageStore.state.find(
      (m) => m.id === serverMessageId
    );
    if (deleteMessage) {
      if (!deleteMessage.read && deleteMessage.senderId !== userStore.state.login) {
        const senderState = usersStore.getUserState(deleteMessage.senderId);
        if (senderState?.unreadCount) {
          usersStore.updateUnreadCount(deleteMessage.senderId, senderState.unreadCount - 1);
        }
      }
      messageStore.delete(serverMessageId);
    }
  },
  editMessage(messageId, newText) {
    const message = messageStore.state.find((m) => m.id === messageId);
    if (message?.senderId !== userStore.state.login) {
      return;
    }
    const request = {
      id: crypto.randomUUID(),
      type: "MSG_EDIT",
      payload: { message: { id: messageId, text: newText } }
    };
    sendRequest(request);
  },
  handleEdit(message) {
    const serverMessage = message.payload.message;
    messageStore.edit(serverMessage.id, serverMessage.text);
  }
};
function mapServerMessage(serverMessage) {
  return {
    id: serverMessage.id,
    senderId: serverMessage.from,
    senderName: serverMessage.from,
    recipientId: serverMessage.to,
    text: serverMessage.text,
    created: new Date(serverMessage.datetime).toISOString(),
    delivered: serverMessage.status.isDelivered,
    read: serverMessage.status.isReaded,
    edited: serverMessage.status.isEdited
  };
}
function syncUnreadCounts() {
  usersStore.get().forEach((user) => {
    messageController.getUnreadCount(user.login);
  });
}

const LOGIN_ERRORS = {
  empty: "Login cannot be empty",
  invalidChars: 'Login can contain only English letters, digits or "-"',
  tooShort: "Login must be at least 3 characters",
  tooLong: "Login cannot be longer than 15 characters"
};
const PASSWORD_ERRORS = {
  empty: "Password cannot be empty",
  tooShort: "Password must be at least 8 characters long",
  noUpper: "Password must contain at least one uppercase letter",
  noLower: "Password must contain at least one lowercase letter",
  noDigit: "Password must contain at least one digit",
  noSpecial: "Password must contain at least one special character",
  invalidChars: "Password can only contain English letters, digits, and special symbols",
  sameAsLogin: "Password and login must be different"
};
const SERVER_ERRORS = {
  loginFailed: "Invalid login or password",
  logoutFailed: "Failed to log out. Please try again",
  serverError: "Server error. Please try again"
};

function isLoginResponse(message) {
  return message.type === "USER_LOGIN";
}
function isErrorResponse(message) {
  return message.type === "ERROR";
}
function isLogoutResponse(message) {
  return message.type === "USER_LOGOUT";
}
function isExternalLoginResponse(message) {
  return message.type === "USER_EXTERNAL_LOGIN";
}
function isExternalLogoutResponse(message) {
  return message.type === "USER_EXTERNAL_LOGOUT";
}
function isUserInactiveResponse(message) {
  return message.type === "USER_INACTIVE";
}
function isSendMessageResponse(message) {
  return message.type === "MSG_SEND";
}
function isMessageFromUserResponse(message) {
  return message.type === "MSG_FROM_USER";
}
function isMessageNotReadResponse(message) {
  return message.type === "MSG_COUNT_NOT_READED_FROM_USER";
}
function isMessageDeliverResponse(message) {
  return message.type === "MSG_DELIVER";
}
function isMessageDeleteResponse(message) {
  return message.type === "MSG_DELETE";
}
function isMessageEditResponse(message) {
  return message.type === "MSG_EDIT";
}
function isMessageReadResponse(message) {
  return message.type === "MSG_READ";
}
function isResponse(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("type" in value) || !("payload" in value)) {
    return false;
  }
  return typeof value.type === "string";
}
function isUserActiveResponse(object) {
  if (!isRecord(object)) {
    return false;
  }
  if (object.type !== "USER_ACTIVE") {
    return false;
  }
  if (!isRecord(object.payload)) {
    return false;
  }
  return "users" in object.payload && Array.isArray(object.payload.users);
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}

function handleResponse(message) {
  if (isLoginResponse(message)) {
    login$1(message);
    return;
  }
  if (isLogoutResponse(message)) {
    logout$1(message);
    return;
  }
  if (isErrorResponse(message)) {
    handleError(message);
    return;
  }
  if (isExternalLoginResponse(message)) {
    externalLogin(message);
    return;
  }
  if (isExternalLogoutResponse(message)) {
    externalLogout(message);
    return;
  }
  if (isUserActiveResponse(message)) {
    getActiveUsers(message);
    return;
  }
  if (isUserInactiveResponse(message)) {
    getInactiveUsers(message);
    return;
  }
  if (isSendMessageResponse(message)) {
    messageController.handleMessage(message);
    return;
  }
  if (isMessageFromUserResponse(message)) {
    messageController.handleMessagesFromUser(message);
    return;
  }
  if (isMessageNotReadResponse(message)) {
    messageController.handleUnreadCount(message);
    return;
  }
  if (isMessageDeliverResponse(message)) {
    messageController.markDelivered(message.payload.message.id);
    return;
  }
  if (isMessageReadResponse(message)) {
    messageController.markRead(message.payload.message.id);
    return;
  }
  if (isMessageDeleteResponse(message)) {
    messageController.handleDelete(message);
    return;
  }
  if (isMessageEditResponse(message)) {
    messageController.handleEdit(message);
    return;
  }
}
function login$1(message) {
  const { user } = message.payload;
  if (user.isLogined) {
    userStore.loginUser();
    userStore.setServerLogin(true);
    requestAllUsers();
    syncUnreadCounts();
    const allUsers = usersStore.get();
    allUsers.forEach((user2) => {
      if (user2.login !== userStore.state.login) {
        messageController.getMessagesFromUser(user2.login);
      }
    });
    navigate("main", document.body);
  } else {
    errorPopup.show(SERVER_ERRORS.loginFailed);
  }
}
function logout$1(message) {
  const { user } = message.payload;
  if (user.isLogined) {
    errorPopup.show(SERVER_ERRORS.logoutFailed);
  } else {
    userStore.logoutUser();
    userStore.setServerLogin(false);
    usersStore.set([]);
    navigate("login", document.body);
  }
}
function handleError(message) {
  const { error } = message.payload;
  errorPopup.show(
    error ? error.charAt(0).toUpperCase() + error.slice(1) : SERVER_ERRORS.serverError
  );
  console.error(error || SERVER_ERRORS.serverError);
}
function externalLogin(message) {
  const { user } = message.payload;
  if (!user.isLogined) {
    return;
  }
  requestAllUsers();
  notificationPopup.show(`User ${user.login} logged in`);
}
function externalLogout(message) {
  const { user } = message.payload;
  if (user.isLogined) {
    return;
  }
  requestAllUsers();
  notificationPopup.show(`User ${user.login} logged out`);
}
function getActiveUsers(message) {
  const { users } = message.payload;
  const currentLogin = userStore.state.login;
  const activeUsers = users.filter((user) => user.login !== currentLogin).map((user) => ({
    login: user.login,
    isOnline: true,
    unreadCount: 0
  }));
  usersStore.set(activeUsers);
  syncUnreadCounts();
}
function getInactiveUsers(message) {
  const { users } = message.payload;
  const currentLogin = userStore.state.login;
  const inactiveUsers = users.filter((user) => user.login !== currentLogin).map((user) => ({
    login: user.login,
    isOnline: false,
    unreadCount: 0
  }));
  const currentUsers = usersStore.get();
  usersStore.set([...currentUsers.filter((u) => u.isOnline), ...inactiveUsers]);
  syncUnreadCounts();
}

const connectionStore = {
  state: {
    connected: false,
    reconnecting: false
  },
  setConnected(value) {
    this.state.connected = value;
    this.state.reconnecting = false;
    eventState.emit("connection:changed", this.state);
  },
  setReconnecting() {
    this.state.reconnecting = true;
    eventState.emit("connection:changed", this.state);
  }
};

let socket;
let reconnectTimeout;
let reconnectAttempt = 0;
let manuallyClosed = false;
function startWebsocket() {
  manuallyClosed = false;
  connect();
}
function getSocket() {
  return socket;
}
function connect() {
  socket = new WebSocket("ws://localhost:4000");
  socket.addEventListener("open", () => {
    reconnectAttempt = 0;
    eventState.emit("ws:connected");
  });
  socket.addEventListener("message", (event) => {
    try {
      if (typeof event.data !== "string") {
        return;
      }
      const parsed = JSON.parse(event.data);
      if (!isResponse(parsed)) {
        console.error("Invalid websocket message shape", parsed);
        errorPopup.show("Received invalid data format from the server");
        return;
      }
      handleResponse(parsed);
    } catch {
      console.error("Invalid websocket message", event.data);
      errorPopup.show("Failed to process the message from the server");
    }
  });
  socket.addEventListener("close", () => {
    eventState.emit("ws:disconnected");
    if (!manuallyClosed) {
      reconnect();
    }
  });
  socket.addEventListener("error", () => {
    socket?.close();
  });
}
function reconnect() {
  const DELAY = 1e3;
  const MAX_DELAY = 5e3;
  reconnectAttempt += 1;
  eventState.emit("ws:reconnecting", { attempt: reconnectAttempt });
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  reconnectTimeout = setTimeout(connect, Math.min(DELAY * reconnectAttempt, MAX_DELAY));
}
function handleReconnect() {
  connectionStore.setConnected(true);
  const {
    login,
    password,
    isLoggedIn,
    isLoggedInOnServer
  } = userStore.state;
  if (isLoggedIn && !isLoggedInOnServer && login && password) {
    requestLogin(login, password);
  }
  usersStore.reset();
  messageStore.reset();
  syncUnreadCounts();
}

function sendRequest(data) {
  const socket = getSocket();
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}
function requestLogin(login, password) {
  const request = {
    id: crypto.randomUUID(),
    type: "USER_LOGIN",
    payload: {
      user: { login, password }
    }
  };
  sendRequest(request);
}
function requestActiveUsers() {
  const request = {
    id: crypto.randomUUID(),
    type: "USER_ACTIVE",
    payload: null
  };
  sendRequest(request);
}
function requestInactiveUsers() {
  const request = {
    id: crypto.randomUUID(),
    type: "USER_INACTIVE",
    payload: null
  };
  sendRequest(request);
}
function requestAllUsers() {
  requestActiveUsers();
  requestInactiveUsers();
}

const MIN_LOGIN_LENGTH = 3;
const MAX_LOGIN_LENGTH = 15;
const PASSWORD_LENGTH = 8;
const VALIDATION_RULES = {
  login: [
    { test: (value) => value.length > 0, error: LOGIN_ERRORS.empty },
    {
      test: (value) => value.length >= MIN_LOGIN_LENGTH,
      error: LOGIN_ERRORS.tooShort
    },
    {
      test: (value) => /^[a-zA-Z0-9-]+$/.test(value),
      error: LOGIN_ERRORS.invalidChars
    },
    {
      test: (value) => value.length <= MAX_LOGIN_LENGTH,
      error: LOGIN_ERRORS.tooLong
    }
  ],
  password: [
    { test: (value) => value.length > 0, error: PASSWORD_ERRORS.empty },
    {
      test: (value) => value.length >= PASSWORD_LENGTH,
      error: PASSWORD_ERRORS.tooShort
    },
    { test: (value) => /[A-Z]/.test(value), error: PASSWORD_ERRORS.noUpper },
    { test: (value) => /[a-z]/.test(value), error: PASSWORD_ERRORS.noLower },
    { test: (value) => /[0-9]/.test(value), error: PASSWORD_ERRORS.noDigit },
    {
      test: (value) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      error: PASSWORD_ERRORS.noSpecial
    },
    {
      test: (value, login) => value !== login,
      error: PASSWORD_ERRORS.sameAsLogin
    },
    {
      test: (value) => /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(value),
      error: PASSWORD_ERRORS.invalidChars
    }
  ]
};

function validate(field, value, otherValue) {
  const rules = VALIDATION_RULES[field];
  for (const rule of rules) {
    if (!rule.test(value, otherValue)) {
      userStore.showError(field, rule.error);
      return false;
    }
  }
  userStore.removeError(field);
  return true;
}

function login() {
  const { login: login2, password } = userStore.state;
  const loginValid = validate("login", userStore.state.login, userStore.state.password);
  const passwordValid = validate(
    "password",
    userStore.state.password,
    userStore.state.login
  );
  if (!loginValid || !passwordValid) {
    return;
  }
  userStore.saveCredentials(login2, password);
  const request = {
    id: crypto.randomUUID(),
    type: "USER_LOGIN",
    payload: {
      user: { login: login2, password }
    }
  };
  sendRequest(request);
}
function logout() {
  const { login: login2, password } = userStore.state;
  if (!login2 || !password) {
    userStore.logoutUser();
    return;
  }
  const request = {
    id: crypto.randomUUID(),
    type: "USER_LOGOUT",
    payload: {
      user: { login: login2, password }
    }
  };
  sendRequest(request);
}

function createHeader(page) {
  const header = createElement({ tag: "header", className: ["header"] });
  const title = createElement({
    tag: "h2",
    className: ["header__title"],
    textContent: "Fun Chat"
  });
  const buttons = createElement({ tag: "div", className: ["header__buttons"] });
  if (page === "main") {
    const userLabel = createElement({
      tag: "span",
      className: ["header__user-label"],
      textContent: "You: "
    });
    const userName = createElement({
      tag: "span",
      className: ["header__username"],
      textContent: userStore.state.login || ""
    });
    const userContainer = createElement({
      tag: "div",
      className: ["header__user"]
    });
    const logoutButton = createButton({
      text: "Logout"
    });
    logoutButton.addEventListener("click", () => {
      logout();
    });
    const aboutButton = createButton({
      text: "About"
    });
    aboutButton.addEventListener("click", (_event) => {
      navigate("about", document.body);
    });
    userContainer.append(userLabel, userName);
    buttons.append(logoutButton, aboutButton);
    header.append(userContainer, title, buttons);
  } else if (page === "about") {
    const backButton = createButton({
      text: "Back"
    });
    backButton.addEventListener("click", () => {
      history.back();
    });
    buttons.append(backButton);
    header.append(title, buttons);
  }
  return header;
}

const AboutPageText = {
  introduction: "Fun Chat is a real-time web chat application built using the WebSocket protocol. It demonstrates users direct client-server communication without relying on third-party frameworks.",
  description: "The application is implemented as a Single Page Application (SPA). All interface elements are generated dynamically using TypeScript, with a strong focus on modular architecture, asynchronous programming, and clean code.",
  featuresTitle: "Key Features",
  features: [
    "User authentication and session management.",
    "List of registered users with online status.",
    "Private dialogs with full message history.",
    "Message delivery and read statuses.",
    "Editing and deleting sent messages.",
    "Automatic reconnection after connection loss."
  ],
  conclusion: "This project was developed by Eryka Mileuskaya as a learning application to practice WebSocket communication, DOM manipulation, and asynchronous client-server interaction."
};

function renderAboutPage(container) {
  container.replaceChildren();
  const wrapper = createElement({
    tag: "div",
    className: ["wrapper"]
  });
  const header = createHeader("about");
  const pageContainer = createElement({
    tag: "main",
    className: ["container", "main"]
  });
  const about = createElement({
    tag: "div",
    className: ["container about"]
  });
  const title = createElement({
    tag: "h1",
    textContent: "About Fun Chat",
    className: ["page-title"]
  });
  const introduction = createElement({
    tag: "p",
    className: ["about__text"],
    textContent: AboutPageText.introduction
  });
  const image = createElement({
    tag: "img",
    className: ["about__image"],
    attributes: {
      src: "icons/chat.png",
      alt: "Fun Chat"
    }
  });
  const description = createElement({
    tag: "p",
    className: ["about__text"],
    textContent: AboutPageText.description
  });
  const featuresTitle = createElement({
    tag: "h2",
    className: ["about__subtitle"],
    textContent: AboutPageText.featuresTitle
  });
  const featuresList = createList$1(AboutPageText.features, "about__list");
  const conclusion = createElement({
    tag: "p",
    className: ["about__text"],
    textContent: AboutPageText.conclusion
  });
  const footer = createFooter();
  about.append(title, introduction, image, description, featuresTitle, featuresList, conclusion);
  pageContainer.append(about);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}
function createList$1(items, className) {
  const ul = createElement({ tag: "ul", className: [className] });
  items.forEach((text) => {
    ul.append(createElement({ tag: "li", className: [`${className}-item`], textContent: text }));
  });
  return ul;
}

function renderLoginPage(container) {
  const view = createLoginElements(container);
  const { form, loginInput, passwordInput, loginError, passwordError, button } = view;
  loginInput.addEventListener("input", () => {
    userStore.setLogin(loginInput.value);
    validate("login", userStore.state.login, userStore.state.password);
    updateLoginButtonState(button);
  });
  passwordInput.addEventListener("input", () => {
    userStore.setPassword(passwordInput.value);
    validate("password", userStore.state.password, userStore.state.login);
    updateLoginButtonState(button);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    login();
  });
  eventState.on("user-store:changed", (state) => {
    if (!state) {
      return;
    }
    loginError.textContent = state.errors.login ?? "";
    passwordError.textContent = state.errors.password ?? "";
  });
}
function createLoginElements(container) {
  const pageContainer = createElement({
    tag: "div",
    className: ["container auth-container"]
  });
  const title = createElement({
    tag: "h1",
    textContent: "Login Page",
    className: ["page-title"]
  });
  const form = createElement({ tag: "form", className: ["form-container"] });
  const loginWrapper = createElement({ tag: "div", className: ["input-wrapper"] });
  const loginInput = createElement({
    tag: "input",
    className: ["input"],
    attributes: { type: "text", name: "login", placeholder: "Login" }
  });
  const loginError = createElement({ tag: "div", className: ["input-error"] });
  const passwordWrapper = createElement({
    tag: "div",
    className: ["input-wrapper"]
  });
  const passwordInput = createElement({
    tag: "input",
    className: ["input"],
    attributes: { type: "password", name: "password", placeholder: "Password" }
  });
  const passwordError = createElement({ tag: "div", className: ["input-error"] });
  const button = createButton({
    text: "Login",
    className: "login-button",
    disabled: true
  });
  button.type = "submit";
  const aboutLink = createElement({
    tag: "a",
    className: ["login__about-link"],
    textContent: "About Fun Chat",
    attributes: {
      href: "/about"
    }
  });
  aboutLink.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("about", document.body);
  });
  loginWrapper.append(loginInput, loginError);
  passwordWrapper.append(passwordInput, passwordError);
  form.append(loginWrapper, passwordWrapper, button);
  pageContainer.append(title, form, aboutLink);
  container.replaceChildren(pageContainer);
  return { form, loginInput, passwordInput, loginError, passwordError, button };
}
function updateLoginButtonState(button) {
  const loginValid = validate("login", userStore.state.login, userStore.state.password);
  const passwordValid = validate(
    "password",
    userStore.state.password,
    userStore.state.login
  );
  button.disabled = !(loginValid && passwordValid);
}

function createMessagesList(messagesContainer, currentUser, messages, dialogueState) {
  messagesContainer.replaceChildren();
  let divider = false;
  if (messages.length === 0) {
    const emptyDialogue = createEmptyNotice();
    messagesContainer.append(emptyDialogue);
    return;
  }
  messages.toSorted(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  ).forEach((message) => {
    if (!divider && !message.read && message.senderId !== currentUser.login && !dialogueState.dividerRemoved) {
      messagesContainer.append(createDivider());
      divider = true;
    }
    const messageElement = createMessageElement(message, currentUser);
    messagesContainer.append(messageElement);
  });
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: "smooth"
  });
}
function createMessageElement(message, currentUser) {
  const messageContainer = createElement({
    tag: "div",
    className: ["message", message.senderId === currentUser.login ? "sender" : "recipient"]
  });
  const header = createMessageHeader(message, currentUser);
  const footer = createMessageFooter(message, currentUser);
  const body = createElement({ tag: "div", className: ["message-body"] });
  const text = createElement({ tag: "span", textContent: message.text });
  body.append(text);
  if (message.edited) {
    const edited = createElement({
      tag: "span",
      className: ["edited"],
      textContent: " (edited)"
    });
    body.append(edited);
  }
  messageContainer.append(header, body, footer);
  return messageContainer;
}
function createMessageHeader(message, currentUser) {
  const header = createElement({ tag: "div", className: ["message__header"] });
  const sender = createElement({
    tag: "span",
    className: ["sender"],
    textContent: message.senderId === currentUser.login ? "You" : message.senderName
  });
  const time = createElement({
    tag: "span",
    className: ["time"],
    textContent: new Date(message.created).toLocaleTimeString()
  });
  header.append(sender, time);
  return header;
}
function createMessageFooter(message, currentUser) {
  const footer = createElement({ tag: "div", className: ["message__footer"] });
  const status = createElement({
    tag: "span",
    className: ["status"],
    textContent: ""
  });
  if (message.senderId === currentUser.login) {
    if (message.read) {
      status.textContent = "Read ✓✓";
    } else if (message.delivered) {
      status.textContent = "Delivered ✓";
    } else {
      status.textContent = "Sent";
    }
  }
  if (message.senderId === currentUser.login && !footer.dataset.handlersAttached) {
    const editButton = createElement({
      tag: "button",
      className: ["edit-button"],
      textContent: "Edit"
    });
    const deleteButton = createElement({
      tag: "button",
      className: ["delete-button"],
      textContent: "Delete"
    });
    editButton.addEventListener("click", (_event) => {
      eventState.emit("dialogue:edit-message", { messageId: message.id, text: message.text });
    });
    deleteButton.addEventListener("click", (_event) => {
      messageController.deleteMessage(message.id);
    });
    footer.prepend(editButton, deleteButton);
    footer.dataset.handlersAttached = "true";
  }
  footer.append(status);
  return footer;
}

function bindDialogueEvents(params) {
  const {
    getRecipient,
    setRecipient,
    setEditingMessageId,
    messageInput,
    recipientStatus,
    renderMessages
  } = params;
  bindRecipientEvents({
    getRecipient,
    setRecipient,
    recipientStatus,
    renderMessages
  });
  eventState.on("dialogue:edit-message", (payload) => {
    if (!payload) {
      return;
    }
    setEditingMessageId(payload.messageId);
    messageInput.input.value = payload.text;
    messageInput.input.focus();
  });
  eventState.on("dialogue:recipient-changed", (user) => {
    if (!user) {
      return;
    }
    setRecipient(user);
  });
}
function bindRecipientEvents(params) {
  const {
    getRecipient,
    setRecipient,
    recipientStatus,
    renderMessages
  } = params;
  const withRecipient = (function_) => {
    const recipient = getRecipient();
    if (!recipient) {
      return;
    }
    function_(recipient);
  };
  eventState.on("messages:changed", () => {
    withRecipient(renderMessages);
  });
  eventState.on("dialogue:divider-remove", () => {
    withRecipient((recipient) => {
      handleDividerRemove(recipient, renderMessages);
    });
  });
  eventState.on("users:changed", (users) => {
    withRecipient((recipient) => {
      handleUsersChanged({
        users,
        recipient,
        setRecipient,
        recipientStatus
      });
    });
  });
}
function createEmptyNotice(text = "Start the conversation by sending a message…") {
  return createElement({
    tag: "div",
    className: ["dialogue_empty"],
    textContent: text
  });
}
function setMessageInput(enabled, messageInput) {
  messageInput.input.disabled = !enabled;
  messageInput.button.disabled = !enabled;
}
function updateRecipientStatus(statusElement, user) {
  statusElement.classList.remove("online", "offline", "unknown");
  if (!user) {
    statusElement.classList.add("unknown");
    return;
  }
  statusElement.classList.add(user.isOnline ? "online" : "offline");
}
function updateDialogue(user, recipientName, recipientStatus, messagesContainer, messageInput) {
  recipientName.textContent = user ? user.login : "Select a user";
  updateRecipientStatus(recipientStatus, user);
  messagesContainer.replaceChildren(createEmptyNotice());
  setMessageInput(!!user, messageInput);
  if (!user) {
    setMessageInput(false, messageInput);
    return;
  }
  setMessageInput(true, messageInput);
  const dialogueState = messageStore.getDialogueState(user.login);
  dialogueState.dividerRemoved = false;
  messageController.getMessagesFromUser(user.login);
}
function handleUsersChanged(params) {
  const {
    users,
    recipient,
    setRecipient,
    recipientStatus
  } = params;
  if (!users) {
    return;
  }
  const updatedUser = users.find((user) => user.login === recipient.login);
  if (!updatedUser) {
    return;
  }
  setRecipient(updatedUser);
  updateRecipientStatus(recipientStatus, updatedUser);
}
function createDivider() {
  return createElement({
    tag: "div",
    className: ["divider"],
    textContent: "Unread messages"
  });
}
function handleDividerRemove(recipient, renderMessages) {
  const state = messageStore.getDialogueState(recipient.login);
  if (state.dividerRemoved) {
    return;
  }
  state.dividerRemoved = true;
  messageController.markAllRead(recipient.login);
  renderMessages(recipient);
}
function createMessages(params) {
  const {
    wrapper,
    currentUser,
    recipient
  } = params;
  const messages = messageStore.getDialog(currentUser, recipient);
  const dialogueState = messageStore.getDialogueState(recipient.login);
  createMessagesList(wrapper, currentUser, messages, dialogueState);
}

function createDialogue() {
  const container = createElement({
    tag: "section",
    className: ["dialogue"]
  });
  let currentRecipient;
  let editingMessageId;
  const { header, recipientName, messagesContainer, recipientStatus } = createDialogueElements();
  const messageInput = createMessageInput((text) => {
    if (!currentRecipient || !messageInput.input.value.trim()) {
      return;
    }
    if (editingMessageId) {
      messageController.editMessage(editingMessageId, text);
      editingMessageId = void 0;
    } else {
      messageController.sendMessage(currentRecipient.login, text);
      eventState.emit("dialogue:divider-remove");
    }
    messageInput.input.value = "";
  });
  setMessageInput(false, messageInput);
  container.append(header, messagesContainer, messageInput.container);
  function changeRecipient(user) {
    currentRecipient = user;
    updateDialogue(user, recipientName, recipientStatus, messagesContainer, messageInput);
  }
  bindDialogueEvents({
    getRecipient: () => currentRecipient,
    setRecipient: changeRecipient,
    setEditingMessageId: (id) => {
      editingMessageId = id;
    },
    messageInput,
    recipientStatus,
    renderMessages: (recipient) => {
      createMessages({
        wrapper: messagesContainer,
        currentUser: { login: userStore.state.login },
        recipient
      });
    }
  });
  return {
    render: (recipient) => {
      eventState.emit("dialogue:recipient-changed", recipient);
    },
    setRecipient: (recipient) => {
      eventState.emit("dialogue:recipient-changed", recipient);
    },
    get container() {
      return container;
    }
  };
}
function createDialogueElements(recipient) {
  const header = createElement({
    tag: "div",
    className: ["dialogue__title"]
  });
  const recipientLabel = createElement({
    tag: "span",
    className: ["recipient-label"],
    textContent: "Recipient: "
  });
  const recipientName = createElement({
    tag: "span",
    className: ["recipient-name"],
    textContent: "Select a user"
  });
  const recipientStatus = createElement({
    tag: "span",
    className: [
      "recipient-status",
      "unknown"
    ]
  });
  header.append(recipientLabel, recipientName, recipientStatus);
  const messagesContainer = createElement({
    tag: "div",
    className: ["messages"]
  });
  messagesContainer.addEventListener("click", (_event) => {
    eventState.emit("dialogue:divider-remove");
  });
  messagesContainer.replaceChildren(createEmptyNotice("Select a user to start chatting..."));
  return { header, recipientName, messagesContainer, recipientStatus };
}
function createMessageInput(onSend) {
  const container = createElement({ tag: "div", className: ["message-input"] });
  const input = createElement({
    tag: "input",
    attributes: { placeholder: "Type a message...", name: "message", type: "text" }
  });
  const button = createButton({
    className: "send-button",
    text: "Send"
  });
  function send() {
    if (!input.value.trim()) {
      return;
    }
    onSend(input.value);
    input.value = "";
  }
  button.addEventListener("click", send);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      send();
    }
  });
  container.append(input, button);
  return { container, input, button };
}

function filterUsers(users, search, caseSensitive) {
  if (!search) {
    return users;
  }
  return users.filter(
    (user) => caseSensitive ? user.login.includes(search) : user.login.toLowerCase().includes(search.toLowerCase())
  );
}

function createUserList({
  container,
  users
}) {
  const { list, searchInput } = createUserListContainer(container);
  let search = "";
  const caseSensitive = false;
  searchInput.addEventListener("input", (_event) => {
    search = searchInput.value;
    createList(list, usersStore.get(), search, caseSensitive);
  });
  createList(list, users, search, caseSensitive);
  return {
    render: (users2) => {
      createList(list, users2, search, caseSensitive);
    }
  };
}
function createUserListContainer(container) {
  const list = createElement({ tag: "ul", className: ["user-list"] });
  const title = createElement({
    tag: "h2",
    textContent: "Active Users",
    className: ["list-title"]
  });
  const searchInput = createElement({
    tag: "input",
    className: ["user-search"],
    attributes: { placeholder: "Search users...", name: "search", type: "text" }
  });
  container.append(title, searchInput, list);
  return { list, searchInput };
}
function createList(list, users, search = "", caseSensitive = false) {
  list.replaceChildren();
  const filteredUsers = filterUsers(users, search, caseSensitive);
  filteredUsers.forEach((user) => {
    list.append(createItem(user));
  });
}
function createItem(user) {
  const item = createElement({ tag: "li", className: ["item"] });
  const userInfo = createElement({ tag: "div", className: ["user__info"] });
  const login = createElement({
    tag: "span",
    className: ["user__login"],
    textContent: user.login
  });
  const status = createElement({
    tag: "span",
    className: ["user__status", user.isOnline ? "online" : "offline"]
  });
  userInfo.append(login, status);
  item.append(userInfo);
  if (user.unreadCount > 0) {
    const unread = createElement({
      tag: "span",
      className: ["user__unread"],
      textContent: user.unreadCount.toString()
    });
    item.append(unread);
  }
  item.addEventListener("click", (_event) => {
    eventState.emit("users:selected", { login: user.login });
  });
  return item;
}

function renderMainPage(container) {
  container.replaceChildren();
  const wrapper = createElement({
    tag: "div",
    className: ["wrapper"]
  });
  const header = createHeader("main");
  const pageContainer = createElement({
    tag: "main",
    className: ["container main"]
  });
  const title = createElement({
    tag: "h1",
    textContent: "Chats",
    className: ["page-title"]
  });
  const footer = createFooter();
  const dialogueContainer = createElement({
    tag: "div",
    className: ["dialogue-container"]
  });
  const usersSection = createElement({
    tag: "section",
    className: ["user-section"]
  });
  const userList = createUserList({ container: usersSection, users: usersStore.get() });
  eventState.on("users:changed", (users) => {
    if (!users) {
      return;
    }
    userList.render(users);
  });
  const dialogue = createDialogue();
  eventState.on("users:selected", (payload) => {
    const user = usersStore.get().find((user2) => user2.login === payload?.login);
    eventState.emit("dialogue:recipient-changed", user);
  });
  dialogueContainer.append(usersSection, dialogue.container);
  pageContainer.append(title, dialogueContainer);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}

const ROUTES = /* @__PURE__ */ new Set(["login", "main", "about"]);
function getRoute() {
  const hash = location.hash.replace("#", "");
  if (isRoute(hash)) {
    return hash;
  }
  return "login";
}
function initRouter(container) {
  if (!location.hash) {
    history.replaceState({}, "", "#login");
  }
  const initialRoute = getRoute();
  const resolvedRoute = resolveRoute(initialRoute);
  history.replaceState({ route: resolvedRoute }, "", `#${resolvedRoute}`);
  router(resolvedRoute, container);
  globalThis.addEventListener("popstate", () => {
    const route = getRoute();
    const finalRoute = resolveRoute(route);
    history.replaceState({ route: finalRoute }, "", `#${finalRoute}`);
    router(finalRoute, container);
  });
}
function router(route, container) {
  container.replaceChildren();
  switch (route) {
    case "login": {
      renderLoginPage(container);
      break;
    }
    case "main": {
      renderMainPage(container);
      break;
    }
    case "about": {
      renderAboutPage(container);
      break;
    }
    default: {
      container.textContent = "Page not found";
    }
  }
}
function resolveRoute(route) {
  if (route === "main" && !userStore.isLoggedIn()) {
    return "login";
  }
  if (route === "login" && userStore.isLoggedIn()) {
    return "main";
  }
  return route;
}
function navigate(route, container) {
  const resolvedRoute = resolveRoute(route);
  history.pushState({ route: resolvedRoute }, "", `#${resolvedRoute}`);
  router(resolvedRoute, container);
}
function isRoute(value) {
  for (const route of ROUTES) {
    if (route === value) {
      return true;
    }
  }
  return false;
}

function app() {
  startWebsocket();
  createReconnectionPopup();
  initRouter(document.body);
  eventState.on("ws:connected", () => {
    handleReconnect();
  });
  eventState.on("ws:disconnected", () => {
    connectionStore.setConnected(false);
    userStore.setServerLogin(false);
    history.replaceState(void 0, "", "#login");
  });
  eventState.on("ws:reconnecting", () => {
    connectionStore.setReconnecting();
  });
  eventState.on("connection:changed", (state) => {
    if (!state) {
      return;
    }
    if (state.connected) {
      connectionPopup.show("Connection restored");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  app();
});
//# sourceMappingURL=main-DyqsrDB4.js.map
