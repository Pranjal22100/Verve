// import Env from "./env";

// export const BASE_URL = Env.BACKEND_URL;
// export const API_URL = BASE_URL + "/api";
// export const LOGIN_URL = API_URL + "/auth/login";
// export const CHAT_GROUP = API_URL + "/chat-group";
// export const CHAT_GROUP_USERS = API_URL + "/chat-group-user";
// export const CHATS_URL = API_URL + "/chats";

import Env from "./env";

export const BASE_URL = Env.BACKEND_URL;              // for client-side
export const INTERNAL_BASE_URL = Env.INTERNAL_BACKEND_URL;  // for server-side

export const API_URL = BASE_URL + "/api";
export const INTERNAL_API_URL = INTERNAL_BASE_URL + "/api";

export const LOGIN_URL = INTERNAL_API_URL + "/auth/login";
export const CHAT_GROUP = INTERNAL_API_URL + "/chat-group";
export const CHAT_GROUP_USERS = INTERNAL_API_URL + "/chat-group-user";
export const CHATS_URL = INTERNAL_API_URL + "/chats";