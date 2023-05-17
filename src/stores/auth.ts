import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  access: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  var connection = ref("");
  const host = import.meta.env.VITE_APP_API_HOST
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.access);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    let newCredentials = {}
    newCredentials["username"] = credentials.email
    newCredentials["password"] = credentials.password
    return ApiService.post("api/token/", newCredentials)
      .then(({ data }) => {
        setAuth(data);
        connectSocket(host)
      })
      .catch(({ response }) => {
        setError(response.data);
      });
  }

  function connectSocket(host: string) {
    // console.log('vào', connection.value)
    // if (connection) {
    //   console.log('vào 123', connection.value)
    //   return
    // }
    // console.log('vào 123')
    // console.log("Starting Connection to Websocket", host)
    // connection.value = new WebSocket("ws://" + host + '/ws/notification/')

    // connection.onopen = function () {
    //   console.log("Successly connected to the echo WebSocket Server")
    // }

    // connection.onclose = function (e) {
    //   console.log('WebSocket closed unexpectedly', e);
    // };

    // connection.onmessage = function (event) {
    //   var data = JSON.parse(event.data);
    //   var message = data['message'];
    //   var status = data['status'];
    //   if (status) {
    //     console.log('success',message)
    //     // notification['success']({
    //     //   message: message,
    //     //   duration: 3,
    //     // });
    //   } else {
    //     console.log('error', message)
    //     // notification['error']({
    //     //   message: message,
    //     //   duration: 3,
    //     // });
    //   }
    // }
  }
  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("api/token/verify-token/", { token: JwtService.getToken() })
        .then(({ data }) => {
          // setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    connection,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
