import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
// import { ElMessage } from 'element-plus'
import Swal from "sweetalert2/dist/sweetalert2.js";

export interface User {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  access: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  var connection;
  const host = import.meta.env.VITE_APP_API_HOST
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  const username = ref('');
  const first_name = ref('');
  const is_staff = ref(false);

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.access);
  }

  function getCurrentUser() {
    return ApiService.get('/user/retrieve')
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem('username', data.username);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('is_staff', data.is_staff);
        if (data.username) {
          username.value = data.username;
        }
        if (data.first_name) {
          first_name.value = data.first_name;
        }
        if (data.is_staff) {
          is_staff.value = data.is_staff;
        }
      })
      .catch(({ response }) => {
        notification(response.data.detail ?? 'Có lỗi xảy ra', 'error')
      })
  }

  function removeStorage() {
    localStorage.removeItem('username');
    localStorage.removeItem('first_name');
    localStorage.removeItem('is_staff');
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
    newCredentials["username"] = credentials.username
    newCredentials["password"] = credentials.password
    return ApiService.post("api/token/", newCredentials)
    .then(({ data }) => {
        connectSocket(host)
        setAuth(data);
        ApiService.setHeader();
        ApiService.post("manage",{}).then()
        getCurrentUser()
      })
      .catch(({ response }) => {
        setError(response.data);
      });
  }

  function notification(values: string, icon: string) {
    Swal.fire({
      text: values,
      icon: icon,
      buttonsStyling: false,
      confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
      heightAuto: false,
      customClass: {
        confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
      },
    })
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
        if (isAuthenticated.value) {
          connectSocket(host, true)
        }
      };
      
      connection.onmessage = function (event) {
        var data = JSON.parse(event.data);
        var message = data['message'];
        var status = data['status'];
        if (status) {
          notification(message ?? 'Thành Công', 'success')
          // ElMessage.success(message)
        } else {
          notification(message ?? 'Thất Bại', 'error')
          // ElMessage.error(message)
        }
      }
    }
    else {
      const timeoutId = setTimeout(() => {
        console.log("Reconnect to Websocket", host)
        connection = new WebSocket("ws://" + host + '/backend/ws/notification/')

        connection.onopen = function () {
          console.log("Successly reconnected to the echo WebSocket Server")
        }

        connection.onclose = function (e) {
          console.log('WebSocket closed unexpectedly', e);
          if (isAuthenticated.value){
            connectSocket(host, true)
          }
        };

        connection.onmessage = function (event) {
          var data = JSON.parse(event.data);
          var message = data['message'];
          var status = data['status'];
          if (status) {
            notification(message ?? 'Thành Công', 'success')
            // ElMessage.success(message)
          } else {
            notification(message ?? 'Thất Bại', 'error')
            // ElMessage.error(message)
          }
        }
        clearTimeout(timeoutId);
      }, 5000);    
    }
  }
  function logout() {
    removeStorage();
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

  async function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      await ApiService.post("api/token/verify-token/", { token: JwtService.getToken() })
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
    getCurrentUser,
    first_name,
    username,
    is_staff,
  };
});
