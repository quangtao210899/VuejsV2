<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack"></KTToolbar>
    <div class="app-container container-fluid pt-10">
        <div class="card d-block px-5 pb-20 mt-10 pt-10">
            <el-form ref="ruleFormRef" :model="scanFormState" :rules="rules" :label-width="'auto'" :label-position="labelPosition" 
                class="demo-ruleForm px-0 px-md-10 mx-0 mx-md-10 mt-10 text-capitalize" size="large" status-icon require-asterisk-position="right">
                <el-form-item label="Tốc độ scan" prop="domain" class="pb-3 text-capitalize fs-6">
                    <el-radio-group v-model="scanFormState.scanSpeedOption" size="large">
                        <el-radio :label="1">Tuần Tự</el-radio>
                        <el-radio :label="2">Chậm</el-radio>
                        <el-radio :label="3">Trung Bình</el-radio>
                        <el-radio :label="4">Nhanh</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Proxy" prop="proxyCheck" class="pb-3 text-capitalize fs-6">
                    <el-switch
                        v-model="scanFormState.proxyCheck"
                        active-text="Allowed"
                    />
                </el-form-item>
                <div v-if="scanFormState.proxyCheck">
                    <div class="mb-5 fv-row">
                        <el-form-item label="Giao thức" prop="proxyScheme" class="pb-3 text-capitalize w-100 fs-6" :error="(errors.proxyScheme) ? errors.proxyScheme[0] : ''">
                            <el-select v-model="scanFormState.proxyScheme" id="proxyScheme" name="proxyScheme"
                                as="select" placeholder="Chọn giao thức" class="w-100">
                                <el-option label="HTTP" value="HTTP">HTTP</el-option>
                                <el-option label="SOCKS5" value="SOCKS5">SOCKS5</el-option>
                            </el-select>
                            <div class="fv-plugins-message-container">
                                <div class="fv-help-block">
                                    <ErrorMessage name="proxyScheme" />
                                    <span class="" v-if="errors.proxyScheme">{{ errors.proxyScheme[0] }}</span>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="mb-5 fv-row row">
                        <div class="col-6">
                            <el-form-item label="Địa chỉ" prop="proxyAdress" class="pb-3 text-capitalize fs-6" :error="(errors.proxyAdress) ? errors.proxyAdress[0] : ''">
                                <el-input v-model="scanFormState.proxyAdress" size="large" placeholder="Nhập địa chỉ"
                                    :class="(errors.proxyAdress) ? 'el-error-ruleForm' : ''" />
                            </el-form-item>
                        </div>
                        <div class="col-6">
                            <el-form-item label="Cổng Dịch Vụ" prop="proxyPort" class="pb-3 text-capitalize fs-6" :error="(errors.proxyPort) ? errors.proxyPort[0] : ''">
                                <el-input type="number" v-model="scanFormState.proxyPort" size="large" placeholder="Nhập cổng dịch vụ"
                                    :class="(errors.proxyPort) ? 'el-error-ruleForm' : ''" />
                            </el-form-item>
                        </div>
                    </div>
                    <div class="mb-5 fv-row">
                        <el-form-item label="Proxy yêu cầu xác thực" prop="proxyAuthenticationCheck" class="pb-3 text-capitalize fs-6">
                            <el-switch
                                v-model="scanFormState.proxyAuthenticationCheck"
                                active-text="Allowed"
                            />
                        </el-form-item>
                    </div>
                    <div v-if="scanFormState.proxyAuthenticationCheck">
                        <div class="mb-5 fv-row row">
                            <div class="col-6">
                                <el-form-item label="Tên Đăng Nhập" prop="proxyUsername" class="pb-3 text-capitalize fs-6" :error="(errors.proxyUsername) ? errors.proxyUsername[0] : ''">
                                    <el-input v-model="scanFormState.proxyUsername" size="large" placeholder="Nhập tên đăng nhập"
                                        :class="(errors.proxyUsername) ? 'el-error-ruleForm' : ''" />
                                </el-form-item>
                            </div>
                            <div class="col-6">
                                <el-form-item label="Mật Khẩu" prop="proxyUserPassword" class="pb-3 text-capitalize fs-6" :error="(errors.proxyUserPassword) ? errors.proxyUserPassword[0] : ''">
                                    <el-input :type="!eyeButtonRef ? 'password' : 'text'" v-model="scanFormState.proxyUserPassword" size="large" placeholder="Nhập mật khẩu"
                                        :class="(errors.proxyUserPassword) ? 'el-error-ruleForm' : ''" />
                                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                        <KTIcon :icon-name="!eyeButtonRef ? 'eye-slash' : 'eye'"
                                            icon-class="fs-2" @click="eyePassword" />
                                    </span>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-stack">
                    <el-form-item label="Sử dụng Header tùy chọn" prop="headerOptionCheck" class="pb-3 text-capitalize fs-6">
                        <el-switch
                            v-model="scanFormState.headerOptionCheck"
                            active-text="Allowed"
                            @click="clearHeaderOptions"
                        />
                    </el-form-item>
                </div>
                <div v-if="scanFormState.headerOptionCheck">
                    <el-form-item  prop="headerOptionValue" label="Header" class="pb-3 text-capitalize fs-6" :error="(errors.headerOptionValue) ? errors.headerOptionValue[0] : ''">
                        <el-select v-model="scanFormState.headerOptionValue" multiple filterable
                            allow-create default-first-option placeholder="Ví dụ: Cookie: e8452aaa">
                        </el-select>
                    </el-form-item>
                </div>
                <div class="d-flex flex-stack">
                    <el-form-item label="Quét bằng Nmap" prop="nmap_check" class="pb-3 text-capitalize fs-6">
                        <el-switch
                            v-model="scanFormState.nmap_check"
                            active-text="Allowed"
                            @click="clearHeaderOptions"
                        />
                    </el-form-item>
                </div>
                <div class="d-flex flex-stack">
                    <el-form-item label="Quét bằng Nuclei" prop="nuclei_check" class="pb-3 text-capitalize fs-6">
                        <el-switch
                            v-model="scanFormState.nuclei_check"
                            active-text="Allowed"
                            @click="clearHeaderOptions"
                        />
                    </el-form-item>
                </div>
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
        const type = ref<string>((ID.value == null ? 'Thêm Mới' : 'Chỉnh Sửa'))
        const list = ref<object | any>([])
        const loading = ref<boolean>(false)
        const router = useRouter();

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
                    router.push({ name: 'target-list' });
                }
            });
        }

        const resetForm = () => {
            errors.proxyAdress = ''
            errors.proxyPort = ''
            errors.proxyUsername = ''
            errors.proxyUserPassword = ''
            errors.headerOptionValue = ''
            errors.detail = ''
            if (!scanFormState.proxyCheck) {
                scanFormState.proxyScheme = ""
                scanFormState.proxyAdress = ""
                scanFormState.proxyPort = ""
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
            }

            if (!scanFormState.proxyAuthenticationCheck) {
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
            }

            if (!scanFormState.headerOptionCheck) {
                scanFormState.headerOptionValue = []
            }
        }

        // onMounted(() => {
        //     getData();
        // });

        // validate
        const ruleFormRef = ref<FormInstance>()

        const errors = reactive({
            status: "",
            created_at: "",
            finished_at: '',
            user: '',
            detail: '',
            proxyScheme: '',
            proxyAdress: '',
            proxyPort: '',
            proxyUsername: '',
            proxyUserPassword: '',
            headerOptionValue: '',
        });

        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/target-scans\/(\d+)/);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };

        const scanFormState = reactive({
            targetID: getIdFromUrl(),
            scanSpeedOption: 3,
            proxyCheck: false,
            proxyScheme: "",
            proxyAdress: '',
            proxyPort: '',
            proxyAuthenticationCheck: false,
            proxyUsername: '',
            proxyUserPassword: '',
            headerOptionCheck: false,
            headerOptionValue: [],
            rescanOptionCheck: false,
            rescanRecurTime: '',
            nmap_check: false,
            nuclei_check: false,
        })

        const eyeButtonRef = ref<boolean>(false);
        const eyePassword = () => {
            eyeButtonRef.value = (eyeButtonRef.value) ? false : true;
        };

        const validateName = (rule: any, value: any, callback: any) => {
            const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharacters.test(value)) {
                callback(new Error('Tên nhóm không được chứa ký tự đặc biệt'));
            } else {
                callback();
            }
        };

        const clearHeaderOptions = () => {
            scanFormState.headerOptionValue = []
        }

        const isValidIPAddress = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const specialCharacters = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})$/;
            if (!specialCharacters.test(value)) {
                callback(new Error('Sai định dạng địa chỉ IP'));
            } else {
                callback();
            }
        };

        const rules = reactive<FormRules>({
            proxyAdress: [
                { required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' },
                { validator: isValidIPAddress, trigger: 'blur' },
            ],
            proxyPort: [
                { required: true, message: 'Vui lòng nhập port', trigger: 'blur' },
            ],
            proxyUsername: [
                { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
            ],
            proxyUserPassword: [
                { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
            ]
        })

        const formSubmit = async (formEl: FormInstance | undefined) => {
            if (!formEl) return
            resetForm();
            await formEl.validate((valid, fields) => {
                if (valid) {
                    addFormSubmit();
                } else {
                    console.log('error submit!', fields)
                }
            })
        }

        const formBack = async (data: any) => {
            router.push({ name: 'target-scan' });
        }

        const addFormSubmit = async () => {
            console.log(scanFormState, 11111111);
            
            return ApiService.post("scan/create/", scanFormState)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Cấu hình quét lỗ hổng thành công')
                    // getData();
                })
                .catch(({ response }) => {
                    let r = response
                    
                    if (r?.data) {
                        errors.detail = r.data.detail;

                        notification(r?.data?.detail, 'error', 'Có lỗi xảy ra')
                    } else {
                        notification(r?.data?.detail, 'error', 'Có lỗi xảy ra')
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
            loading,
            ruleFormRef,
            rules,
            type,
            formBack,
            formSubmit,
            errors,
            labelPosition,
            scanFormState,
            eyeButtonRef,
            eyePassword,
            clearHeaderOptions,
        };
    },
});
</script>
<style>
.demo-ruleForm .el-form-item__error {
    text-transform: initial !important;
    line-height: 18px !important;
    color:#f1416c !important;
}

/* .demo-ruleForm .el-error-ruleForm .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
} */

.el-form-item__label{
    font-size: 1.075rem !important;
    font-weight: 500;
    color: #252f4a !important;
}

.demo-ruleForm .el-input__wrapper {
    box-shadow: none !important;
    
}
.demo-ruleForm .el-input__wrapper.is-focus{
    background-color: #f1f1f2 !important;
    color: #4b5675 !important;
}

.demo-ruleForm .el-form-item--default .el-form-item__error {
    padding-top: 4px;
}

.demo-ruleForm .el-input__wrapper {
    background: #f9f9f9 ;
    border-radius: 10px !important;

}
.demo-ruleForm .el-input__wrapper input {
    font-weight: 500 !important;
    color: #252f4a !important;
    font-size: 13px !important;
    line-height: 21px !important;
}
</style>
