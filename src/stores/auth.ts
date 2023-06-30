import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { useToast } from 'vue-toast-notification';
export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  access: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  var connection;
  const toastr = useToast();
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
    if(connection){
      connection.close()
      connection = null
    }
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
        connectSocket(host)
        setAuth(data);
        ApiService.post("manage",{}).then()
      })
      .catch(({ response }) => {
        setError(response.data);
      });
  }

  function connectSocket(host: string, reconnect: boolean = false) {
    if (connection && !reconnect) {
      return
    }
    if (!reconnect){      
      console.log("Starting Connection to Websocket", host)
      connection = new WebSocket("ws://" + host + '/backend/ws/notification/')
      
      connection.onopen = function () {
        console.log("Successly connected to the echo WebSocket Server")
      }
      
      connection.onclose = function (e) {
        console.log('WebSocket closed unexpectedly', e);
        connectSocket(host, true)
      };
      
      connection.onmessage = function (event) {
        var data = JSON.parse(event.data);
        var message = data['message'];
        var status = data['status'];
        if (status) {
          toastr.info(message, { position: 'top', queue: true });
        } else {
          toastr.error(message, { position: 'top', queue: true });
        }
      }
    }
    else {
      const timeoutId = setTimeout(() => {
        console.log("Reconnect to Websocket", host)
        connection = new WebSocket("ws://" + host + '/ws/notification/')

        connection.onopen = function () {
          console.log("Successly reconnected to the echo WebSocket Server")
        }

        connection.onclose = function (e) {
          console.log('WebSocket closed unexpectedly', e);
          connectSocket(host, true)
        };

        connection.onmessage = function (event) {
          var data = JSON.parse(event.data);
          var message = data['message'];
          var status = data['status'];
          if (status) {
            toastr.info(message, { position: 'top', queue: true });
          } else {
            toastr.error(message, { position: 'top', queue: true });
          }
        }
        clearTimeout(timeoutId);
      }, 5000);    
    }
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
          connectSocket(host)
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
