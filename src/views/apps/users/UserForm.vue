<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack"></KTToolbar>
    <div class="app-container container-fluid pt-5">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20 pt-10">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-width="'33%'"
                :label-position="labelPosition" class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize"
                size="large" status-icon require-asterisk-position="right">
                <el-form-item label="Tên Đăng Nhập" prop="username" class="pb-3 text-capitalize fs-6" tabindex="0"
                    :error="(errors.username) ? errors.username[0] : ''">
                    <el-input v-model="ruleForm.username" size="large" placeholder="Tên đăng nhập" :autofocus="true"
                        :class="(errors.username) ? 'el-error-ruleForm' : ''" :disabled="is_edit"/>
                </el-form-item>
                <el-form-item label="Họ tên" prop="first_name" class="pb-3 text-capitalize fs-6" tabindex="0"
                    :error="(errors.first_name) ? errors.first_name[0] : ''">
                    <el-input v-model="ruleForm.first_name" size="large" placeholder="Họ tên" :autofocus="true"
                        :class="(errors.first_name) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <el-form-item label="Mật khẩu mới" prop="password" class="pb-3 text-capitalize fs-6" tabindex="0"
                    :error="(errors.password) ? errors.password[0] : ''" v-if="!is_edit">
                    <el-input v-model="ruleForm.password" size="large" placeholder="Mật khẩu mới" :autofocus="true"
                        type="password" :show-password="true" :class="(errors.password) ? 'el-error-ruleForm' : ''"
                        autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="Mật khẩu xác nhận" prop="password_confirm" class="pb-3 text-capitalize fs-6"
                    tabindex="0" :error="(errors.password_confirm) ? errors.password_confirm[0] : ''" v-if="!is_edit">
                    <el-input v-model="ruleForm.password_confirm" size="large" placeholder="Mật khẩu xác nhận"
                        :autofocus="true" type="password" :class="(errors.password_confirm) ? 'el-error-ruleForm' : ''"
                        :show-password="true" />
                </el-form-item>
                <el-form-item label="Quản trị viên" prop="is_staff" class="pb-3 text-capitalize fs-6" tabindex="0">
                    <el-checkbox size="large" v-model="ruleForm.is_staff" class="custom-checkbox" />
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
    username: string
    first_name: string
    date_joined: string
    last_login: string
    is_staff: boolean
    password: string
    password_confirm: string

}

interface RuleForm2 {
    username: string
    first_name: string
    password: string
    password_confirm: string
}

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        KTToolbar,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const route = useRoute();
        const ID = ref<any>((route.params.id == 'add' ? null : route.params.id));
        const is_edit = ref<boolean>((ID.value == null ? false : true))
        const type = ref<string>((ID.value == null ? 'Thêm Mới' : 'Chỉnh Sửa'))
        const list = ref<object | any>([])
        const data_group = ref<object | any>([])
        const loading = ref<boolean>(false)
        const router = useRouter();

        const getData = async () => {
            if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
                loading.value = true;
                return ApiService.get(`user/${ID.value}/edit`)
                    .then(({ data }) => {
                        ruleForm.username = data.username
                        ruleForm.first_name = data.first_name
                        ruleForm.is_staff = data.is_staff
                        ruleForm.date_joined = data.date_joined
                        ruleForm.last_login = data.last_login
                    })
                    .catch(({ response }) => {
                        notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                    })
                    .finally(() => {
                        loading.value = false
                    })
            }
            return;
        }

        const notification = (values: string, icon: string, more: string) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            }).then(() => {
                if (icon == 'success' || values == 'Mục tiêu không tồn tại') {
                    router.push({ name: 'user' });
                }
            });
        }
        const resetForm = () => {
            errors.username = ''
            errors.first_name = ''
            errors.password = ''
            errors.password_confirm = ''
        }

        onMounted(() => {
            getData();
        });


        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            username: "",
            first_name: "",
            date_joined: "",
            last_login: "",
            is_staff: false,
            password: "",
            password_confirm: "",
        })
        const errors = reactive<RuleForm2>({
            username: "",
            first_name: "",
            password: "",
            password_confirm: "",
        });

        const validateUsername = (rule: any, value: any, callback: any) => {
            const specialCharacters = /^[0-9a-zA-Z]+$/;
            if (specialCharacters.test(value)) {
                callback();
            } else {
                callback(new Error('Chỉ ký tự chữ và số được cho phép'));
            }
        };
        const validateFirstName = (rule: any, value: any, callback: any) => {
            const specialCharacters = /^[a-zA-Z\sÀ-ỹ]+$/;
            if (specialCharacters.test(value)) {
                callback();
            } else {
                callback(new Error('Chỉ ký tự chữ được cho phép'));
            }
        };
        const validatePassword = (rule: any, value: any, callback: any) => {
            const specialCharacters = /^^(?=.*[ a-z])(?=.*[ A-Z])(?=.*\d)(?=.*[ @$!%*?&])[ A-Za-z\d@$!%*?&]{0,}$/;
            if (specialCharacters.test(value)) {
                callback();
            } else {
                callback(new Error('Mật khẩu phải chứa ít nhất 1 chữ cái, chữ hoa, ký tự đặc biệt'));
            }
        };

        const validateConfirmPassword = (rule: any, value: any, callback: any) => {
            if (value === '') {
                callback(new Error('Mật khẩu xác nhận không được để trống'));
            } else if (value !== ruleForm.password) {
                callback(new Error('Mật khẩu xác nhận không khớp'));
            } else {
                callback();
            }
        };
        
        const rules = reactive<FormRules>({
            username: [
                { required: true, message: 'Tên đăng nhập không được để trống', trigger: 'blur' },
                { min: 6, max: 50, message: 'Độ dài từ 6-50 ký tự', trigger: 'blur' },
                { validator: validateUsername, trigger: 'blur' },
            ],
            first_name: [
                { required: true, message: 'Họ tên không được để trống', trigger: 'blur' },
                { max: 50, message: 'Độ dài tối đa 50 ký tự', trigger: 'blur' },
                { validator: validateFirstName, trigger: 'blur' },
            ],
            password: [
                { required: true, message: 'Mật khẩu không được để trống', trigger: 'blur' },
                { min: 8, max: 150, message: 'Độ dài từ 8-150 ký tự', trigger: 'blur' },
                { validator: validatePassword, trigger: 'blur' },
            ],
            password_confirm: [
                { required: true, message: 'Mật khẩu xác nhận không được để trống', trigger: 'blur' },
                { validator: validateConfirmPassword, trigger: 'blur' },
            ],
        })

        const formSubmit = async (formEl: FormInstance | undefined) => {
            // console.log(rules)
            if (!formEl) return
            resetForm();
            await formEl.validate((valid, fields) => {
                if (valid) {
                    if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
                        editFormSubmit(ruleForm);
                    } else {
                        addFormSubmit(ruleForm);
                    }
                } else {
                    console.log('error submit!', fields)
                }
            })
        }

        const formBack = async (data: any) => {
            router.push({ name: 'user' });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            return ApiService.post("/auth/register/", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                    // getData();
                    // console.log(data);
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.username = response.data.Errors.username;
                        errors.first_name = response.data.Errors.first_name;
                        errors.password = response.data.Errors.password;
                        errors.password_confirm = response.data.Errors.password_confirm;
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            return ApiService.put(`/user/${ID.value}/update`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.username = response.data.Errors.username;
                        errors.first_name = response.data.Errors.first_name;
                        // errors.password = response.data.Errors.password;
                        // errors.password_confirm = response.data.Errors.password_confirm;
                    } else {
                        notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        // tính labelPosition form
        const labelPosition = ref('left')
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth >= 992) {
                labelPosition.value = 'left'
            } else if (windowWidth >= 768) {
                labelPosition.value = 'top'
            } else if (windowWidth >= 576) {
                labelPosition.value = 'top'
            } else {
                labelPosition.value = 'top'
            }
        };

        onMounted(() => {
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            list,
            data_group,
            loading,
            ruleFormRef,
            ruleForm,
            rules,
            type,
            formBack,
            formSubmit,
            errors,
            labelPosition,
            is_edit
        };
    },
});
</script>
<style>
.demo-ruleForm .el-form-item__error {
    text-transform: initial !important;
    line-height: 18px !important;
    color: #f1416c !important;
}

/* .demo-ruleForm .el-error-ruleForm .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
} */

.el-form-item__label {
    font-size: 13px !important;
    font-weight: 500;
    color: #252f4a !important;
}


.demo-ruleForm .el-input__wrapper.is-focus,
.el-textarea__inner:focus {
    background-color: #f1f1f2 !important;
    /* color: #4b5675 !important; */
}

.demo-ruleForm .el-input__wrapper,
.el-textarea__inner {
    background: #f9f9f9;
    border-radius: 10px !important;
    box-shadow: none !important;
}


.demo-ruleForm .el-input__wrapper input,
.el-textarea textarea {
    font-weight: 500 !important;
    color: #252f4a !important;
    font-size: 13px !important;
    line-height: 21px !important;
}


.demo-ruleForm .el-form-item--default .el-form-item__error {
    padding-top: 4px;
}

.custom-checkbox .el-checkbox__inner {
    width: 22.75px !important;
    height: 22.75px !important;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 8px;
    background: #f9f9f9;
}

.custom-checkbox .el-checkbox__inner::after {
    width: 10px !important;
    height: 10px !important;
}


</style>