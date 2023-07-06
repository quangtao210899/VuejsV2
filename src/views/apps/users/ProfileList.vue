<template>
  <!--begin::Navbar-->
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-9 pb-0">
      <!--begin::Details-->
      <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
        <!--begin: Pic-->
        <div class="me-7 mb-4">
          <div class="symbol symbol-80px symbol-lg-100px symbol-fixed position-relative">
            <img class="object-fit-cover" src="https://i.mydramalist.com/66L5p_5f.jpg" alt="image" />
            <div
              class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px">
            </div>
          </div>
        </div>
        <!--end::Pic-->

        <!--begin::Info-->
        <div class="flex-grow-1">
          <!--begin::Title-->
          <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
            <!--begin::User-->
            <div class="d-flex flex-column">
              <!--begin::Name-->
              <div class="d-flex align-items-center mb-2">
                <a href="#" class="text-gray-800 text-hover-primary fs-2 fw-bold me-1">{{ list.first_name ?? '--' }}</a>
                <a href="#">
                  <KTIcon icon-name="verify" icon-class="fs-1 text-primary" />
                </a>
              </div>
              <!--end::Name-->

              <!--begin::Info-->
              <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                <a href="#" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                  <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                  {{ list.is_admin ? "Admin" : "User" }}
                </a>
                <a href="#" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2">
                  <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                  {{ list.username ?? '--' }}
                </a>
              </div>
              <!--end::Info-->
            </div>
            <!--end::User-->

            <!--begin::Actions-->
            <div class="d-flex my-4">
              <!--begin::Menu-->
              <div class="me-0">
                <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary" data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end" :disabled="disabled">
                  <i class="bi bi-three-dots fs-3"></i>
                </button>
                <!-- <Dropdown3></Dropdown3> -->
              </div>
              <!--end::Menu-->
            </div>
            <!--end::Actions-->
          </div>
          <!--end::Title-->
        </div>
        <!--end::Info-->
      </div>
      <!--end::Details-->

      <!--begin::Content-->
      <div class="d-flex overflow-auto h-55px">
        <!--begin:::Tabs-->
        <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap">
          <!--begin:::Tab item-->
          <li class="nav-item">
            <a class="nav-link text-active-primary pb-4 active" data-bs-toggle="tab"
              href="#kt_customer_view_overview_tab">Bảo mật</a>
          </li>
          <!--end:::Tab item-->

          <!--begin:::Tab item-->
          <li class="nav-item">
            <a class="nav-link text-active-primary me-6" data-bs-toggle="tab" href="#kt_password_tab">Đổi mật khẩu</a>
          </li>
          <!--end:::Tab item-->
        </ul>
        <!--end:::Tabs-->
      </div>
      <!--end::Content-->
    </div>
  </div>
  <!--end::Navbar-->
  <!--begin:::Tab content-->
  <div class="tab-content" id="myTabContent">
    <!--begin:::Tab pane-->
    <div class="tab-pane fade show active" id="kt_customer_view_overview_tab" role="tabpanel">
      <div>
        <div class="card pt-4 mb-6 mb-xl-9">
          <!--begin::Card header-->
          <div class="card-header border-0">
            <!--begin::Card title-->
            <div class="card-title">
              <h2>Profile</h2>
            </div>
            <!--end::Card title-->
          </div>
          <!--end::Card header-->

          <!--begin::Card body-->
          <div class="card-body pt-0 pb-5">
            <!--begin::Table wrapper-->
            <div class="table-responsive">
              <!--begin::Table-->
              <table class="table align-middle table-row-dashed gy-5 " id="kt_table_users_login_session">
                <tbody class="fs-6 fw-semibold text-gray-600">
                  <tr>
                    <td>Username</td>
                    <td>
                      <span class="ms-4">{{ editData.username }}</span>
                    </td>
                    <td class="text-end">
                      <KTIcon class="fs-3 me-2" icon-name="cross-square" icon-class="fs-2" />
                    </td>
                  </tr>
                  <tr>
                    <td>Họ tên</td>
                    <td>
                      <input v-model="editData.first_name" type="text" name="name" autocomplete="name"
                        :class="(Object.keys(errors.first_name).length == 0) ? 'text-hover-primary' : 'text-danger'"
                        class="form-control form-control-flush" @active="123" placeholder="Example input" />
                    </td>
                    <td class="text-end">
                      <i class="ki-duotone ki-pencil fs-3 me-2"><span class="path1"></span><span class="path2"></span></i>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class=" w-100 text-end ">
                <!--begin::Button-->
                <button @click="handleReset" :disabled="loading" class="btn btn-sm  btn-light me-3">
                  Đặt lại
                </button>
                <!--end::Button-->

                <!--begin::Button-->
                <button @click="handleClick" :disabled="loading" :data-kt-indicator="loading ? 'on' : null"
                  class="btn btn-sm btn-primary" type="submit">
                  <span v-if="!loading" class="indicator-label">
                    Gửi
                    <KTIcon icon-name="arrow-right" icon-class="fs-3 ms-2 me-0" />
                  </span>
                  <span v-if="loading" class="indicator-progress">
                    Đang gửi...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
                <!--end::Button-->
              </div>
              <!--end::Table-->
            </div>
            <!--end::Table wrapper-->
          </div>
          <!--end::Card body-->
        </div>
      </div>
    </div>
    <!--end:::Tab pane-->

    <!--begin:::Tab pane-->
    <div class="tab-pane fade" id="kt_password_tab" role="tabpanel">
      <div>
        <div class="card pt-4 mb-6 mb-xl-9">
          <!--begin::Card body-->
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <!--begin::Form-->
            <VForm class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" @submit="updatePassword"
              id="kt_login_password_reset_form" :validation-schema="changePassword">

              <!--begin::Input group--->
              <div class="fv-row mb-10 fv-plugins-icon-container">
                <label class="required form-label fs-6 mb-2" for="currentpassword">Mật khẩu cũ</label>
                <Field type="password" class="form-control form-control-solid h-35px" placeholder=""
                  name="currentpassword" autocomplete="off" id="currentpassword"
                  v-model="dataPasswordChange.currentpassword" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="currentpassword" /><br>
                    <span v-if="Object.keys(erroPasswordChange.currentpassword).length !== 0">
                      <template v-for="(el, key) in erroPasswordChange.currentpassword" :key="key">{{ el }}<br></template>
                    </span>
                  </div>
                </div>
              </div>
              <!--end::Input group--->

              <!--begin::Input group-->
              <div class="mb-10 fv-row fv-plugins-icon-container" data-kt-password-meter="true">
                <!--begin::Wrapper-->
                <div class="mb-1">
                  <!--begin::Label-->
                  <label class="form-label fw-semibold fs-6 mb-2" for="newpassword">
                    Mật khẩu mới
                  </label>
                  <!--end::Label-->

                  <!--begin::Input wrapper-->
                  <div class="position-relative mb-3">
                    <Field :type="!eyeButtonRef ? 'password' : 'text'" class="form-control form-control-solid h-35px"
                      name="newpassword" id="newpassword" v-model="dataPasswordChange.newpassword" />

                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                      <KTIcon :icon-name="!eyeButtonRef ? 'eye-slash' : 'eye'" icon-class="fs-2" @click="eyePassword" />
                    </span>
                  </div>
                  <!--end::Input wrapper-->

                  <!--begin::Meter-->
                  <div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                      :class="(percentagePassword >= 25) ? 'active' : ''"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                      :class="(percentagePassword >= 50) ? 'active' : ''"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                      :class="(percentagePassword >= 75) ? 'active' : ''"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
                      :class="(percentagePassword == 100) ? 'active' : ''"></div>
                  </div>
                  <!--end::Meter-->
                </div>
                <!--end::Wrapper-->

                <!--begin::Hint-->
                <div class="text-muted"> Sử dụng 8 ký tự trở lên với sự kết hợp của các chữ cái, số &amp; ký hiệu.</div>
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="newpassword" />
                    <span v-if="Object.keys(erroPasswordChange.newpassword).length !== 0"><br>
                      <template v-for="(el, key) in erroPasswordChange.newpassword" :key="key">{{ el }}<br></template>
                    </span>
                  </div>
                </div>
                <!--end::Hint-->
                <div class="fv-plugins-message-container invalid-feedback"></div>
              </div>
              <!--end::Input group--->

              <!--begin::Input group--->
              <div class="fv-row mb-10 fv-plugins-icon-container">
                <label class="form-label fw-semibold fs-6 mb-2" for="confirmpassword">Nhập lại mật khẩu</label>

                <div class="position-relative mb-3">
                  <Field :type="!eyeButtonRef2 ? 'password' : 'text'" class="form-control form-control-solid h-35px"
                    name="confirmpassword" id="confirmpassword" v-model="dataPasswordChange.confirmpassword" />

                  <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                    <KTIcon :icon-name="!eyeButtonRef2 ? 'eye-slash' : 'eye'" icon-class="fs-2" @click="eyePassword2" />
                  </span>
                </div>

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="confirmpassword" /><br>
                    <span v-if="Object.keys(erroPasswordChange.confirmpassword).length !== 0">
                      <template v-for="(el, key) in erroPasswordChange.confirmpassword" :key="key">{{ el }}<br></template>
                    </span>
                  </div>
                </div>
              </div>
              <!--end::Input group--->

              <!--begin::Actions-->
              <div class="d-flex">
                <button :disabled="loading" id="kt_password_submit" type="submit" ref="updatePasswordButton"
                  class="btn btn-primary me-2 px-6 btn-sm">
                  <span class="indicator-label"> Cập nhật </span>
                  <span class="indicator-progress">
                    Đang cập nhật...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
              </div>
              <!--end::Actions-->
            </VForm>
            <!--end::Form-->
          </div>
          <!--end::Card body-->
        </div>
      </div>
    </div>
    <!--end:::Tab pane-->

  </div>
  <!--end:::Tab content-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import ApiService from "@/core/services/ApiService";

// validate
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Fillter from "@/views/apps/telegrams/filterGroup.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import * as Yup from "yup";
import { useToast } from 'vue-toast-notification';

interface APIData {
  username: string;
  first_name: string;
  is_admin: string;
}

interface NewPassword {
  confirmpassword: string;
  currentpassword: string;
  newpassword: string;
}

export default defineComponent({
  name: "kt-profile",

  components: {
    ErrorMessage,
    Field,
    VForm,
    Fillter,
    CodeHighlighter,
  },
  setup() {
    const loading = ref<boolean>(false)
    const initialData = {
      username: '',
      first_name: '',
      is_admin: '',
    };

    const list = ref<APIData>({ ...initialData });
    const editData = ref<APIData>({ ...initialData });
    const erroPasswordChange = ref<NewPassword>({
      confirmpassword: '',
      currentpassword: '',
      newpassword: '',
    });

    const dataPasswordChange = reactive({
      confirmpassword: '',
      currentpassword: '',
      newpassword: '',
    });

    // getdata
    const getData = () => {
      loading.value = true;

      return ApiService.get(`/account`)
        .then(({ data }) => {
          list.value = {
            username: data.username,
            first_name: data.first_name,
            is_admin: data.is_admin,
          }
          editData.value = {
            username: data.username,
            first_name: data.first_name,
            is_admin: data.is_admin,
          }
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        })
        .finally(() => {
          loading.value = false
        });
    }

    // thồng báo
    const notification = (values: string, icon: string, more: string) => {
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: "Đồng ý!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then(() => {
        // hideModal( newTSetingModalRef.value);
      });
    };

    // on click event
    const errors = ref<object | any>({ first_name: '' });
    const toastr = useToast();

    const handleClick = () => {
      errors.value.first_name = '';
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      if (editData.value.first_name !== list.value.first_name && editData.value.first_name) {
        upadateAccount();
      } else {
        return toastr.warning('Bạn chưa có thay đổi gì!', { position: 'top-right' });
      }
    };

    const handleReset = () => {
      errors.value.first_name = '';
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      if (editData.value.first_name !== list.value.first_name) {
        editData.value = { ...list.value };
        return toastr.info('Đã khôi phục lại tên!', { position: 'top-right' });
      } else {
        return toastr.warning('Bạn chưa có thay đổi gì!', { position: 'top-right' });
      }
    };


    const disabled = ref<boolean>(false);

    // update data
    const upadateAccount = async () => {
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 1000);
      return ApiService.post("/account/update", { first_name: editData.value.first_name })
        .then(({ data }) => {
          notification(data.detail, 'success', 'Cập nhật thành công')
          getData();
        })
        .catch(({ response }) => {
          if (response.data) {
            errors.value.first_name = response.data.first_name;
            toastr.error(response.data.first_name, { position: 'top-right' });
          } else {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          }
        });
    };

    // change Password

    //Create form validation object
    const updatePasswordButton = ref<HTMLElement | null>(null);
    const changePassword = Yup.object().shape({
      currentpassword: Yup.string().required('Vui lòng nhập mật khẩu cũ').label("Mật khẩu cũ"),
      newpassword: Yup.string().min(8, 'Mật khẩu tối thiểu 8 kí tự').required('Vui lòng nhập mật khẩu mới').label("Mật khẩu nới"),
      confirmpassword: Yup.string()
        .min(8, 'Mật khẩu tối thiểu 8 kí tự')
        .required('Vui lòng nhập lại mật khẩu mới')
        .oneOf([Yup.ref("newpassword"), null], "Mật khẩu không khớp với mật khẩu mới")
        .label("Nhập lại mật khẩu"),
    });

    const updatePassword = async (data: any) => {
      if (updatePasswordButton.value) {
        updatePasswordButton.value.setAttribute("data-kt-indicator", "on");
        loading.value = true;
        setTimeout(() => {
          updatePasswordButton.value?.removeAttribute("data-kt-indicator");
          loading.value = false;
        }, 1000);
        let newPassword = {
          password: data.currentpassword,
          new_password: data.newpassword,
          re_new_password: data.confirmpassword
        }
        return ApiService.post("/account/change-password", newPassword)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Cập nhật mật khẩu thành công')
            getData();
            resetForm();
          })
          .catch(({ response }) => {
            if (response.data) {
              erroPasswordChange.value.currentpassword = response.data.password ?? '';
              erroPasswordChange.value.newpassword = response.data.new_password ?? '';
              erroPasswordChange.value.confirmpassword = response.data.re_new_password ?? '';
              toastr.error(response.data.detail, { position: 'top-right' });
            } else {
              notification(response.data.detail, 'error', 'Có lỗi xảy ra')
            }
          });
      }
    };

    // reset form 
    const discardButtonRef = ref<HTMLElement | null>(null);
    const resetForm = () => {
      erroPasswordChange.value.currentpassword = '';
      erroPasswordChange.value.newpassword = '';
      erroPasswordChange.value.confirmpassword = '';

      dataPasswordChange.currentpassword = '';
      dataPasswordChange.newpassword = '';
      dataPasswordChange.confirmpassword = '';

      percentagePassword.value = 0

      if (discardButtonRef.value != null) {
        discardButtonRef.value.click();
      }
    };

    // eyePassword
    const eyeButtonRef = ref<boolean>(false);
    const eyePassword = () => {
      eyeButtonRef.value = (eyeButtonRef.value) ? false : true;
    };

    const eyeButtonRef2 = ref<boolean>(false);
    const eyePassword2 = () => {
      eyeButtonRef2.value = (eyeButtonRef2.value) ? false : true;
    };

    // checkStringValidity
    const percentagePassword = ref<number>(0);
    watch(() => dataPasswordChange.newpassword, (newValue) => {
      checkStringValidity(newValue);
    });

    const checkStringValidity = (password: string) => {
      // Kiểm tra chứa chữ thường
      const containsLowercase = /[a-z]/.test(password);

      // Kiểm tra chứa chữ in hoa
      const containsUppercase = /[A-Z]/.test(password);

      // Kiểm tra chứa số
      const containsNumber = /\d/.test(password);

      // Kiểm tra chứa ký tự đặc biệt
      const containsSpecialChar = /[!@#$%^&*()]/.test(password);

      // Tính toán tỷ lệ phần trăm
      const percentage = Math.round(
        ((containsLowercase ? 1 : 0) +
          (containsUppercase ? 1 : 0) +
          (containsNumber ? 1 : 0) +
          (containsSpecialChar ? 1 : 0)) /
        4 *
        100
      );

      return percentagePassword.value = percentage;
    };


    onMounted(() => {
      getData();
    });

    return {
      getData,
      list,

      // crud
      handleClick,
      upadateAccount,
      errors,
      editData,
      handleReset,
      loading,

      // password
      updatePassword,
      changePassword,
      updatePasswordButton,
      erroPasswordChange,
      discardButtonRef,
      resetForm,

      // eye
      eyePassword,
      eyeButtonRef,
      dataPasswordChange,
      eyeButtonRef2,
      eyePassword2,

      checkStringValidity,
      percentagePassword,
      disabled,
    };
  },
});
</script>
