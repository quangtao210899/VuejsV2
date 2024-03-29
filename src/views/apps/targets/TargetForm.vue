<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20  pt-10" style="">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="33%" :label-position="labelPosition"
                class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large"
                status-icon require-asterisk-position="right">
                <el-form-item label="Tên Mục Tiêu" prop="name" class="pb-3 text-capitalize fs-13px"
                    :error="(errors.name) ? errors.name[0] : ''">
                    <el-input v-model="ruleForm.name" size="large" placeholder="Tên mục tiêu"
                        :class="(errors.name) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <el-form-item label="Tên Miền" prop="domain" class="pb-3 text-capitalize fs-13px"
                    :error="(errors.domain) ? errors.domain[0] : ''">
                    <el-input v-model="ruleForm.domain" size="large" v placeholder="Tên miền" @blur="getAutofill(ruleForm.domain)
                        .then(ip => {
                            ruleForm.ip = ip
                        });" :class="(errors.domain) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <el-form-item label="Địa Chỉ IP" prop="ip" class="pb-3 text-capitalize fs-13px"
                    :error="(errors.ip) ? errors.ip[0] : ''">
                    <el-input v-model="ruleForm.ip" size="large" placeholder="Địa chỉ IP"
                        :class="(errors.ip) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <el-form-item label="Nhóm mục tiêu" prop="group" class="pb-3 text-capitalize w-100 fs-13px"
                    :error="(errors.group) ? errors.group[0] : ''">
                    <el-select v-model="ruleForm.group" size="large" placeholder="Nhóm mục tiêu" class="w-100" filterable
                        no-match-text="Không có dữ liệu phù hợp" :class="(errors.group) ? 'el-error-ruleForm' : ''">
                        <el-option v-for=" val  in  data_group " :key="val.id" :label="val.title" :value="val.id" />
                    </el-select>
                    <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                            <span class="" v-if="errors.detail">
                                {{ Array.isArray(errors.detail) ? errors.detail[0] : errors.detail }}
                            </span>
                        </div>
                    </div>
                </el-form-item>

            </el-form>
        </div>
    </div>

    <!--end::Card-->
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
    name: string
    group: string
    domain: string
    ip: string
}

interface RuleForm2 {
    name: string
    group: string
    domain: string
    ip: string
    detail: string
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
        const type = ref<string>((ID.value == null ? 'Thêm Mới' : 'Chỉnh Sửa'))
        const list = ref<object | any>([])
        const data_group = ref<object | any>([])
        const loading = ref<boolean>(false)
        const router = useRouter();

        const getData = async () => {
            if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
                loading.value = true;
                return ApiService.get(`targets/${ID.value}`)
                    .then(({ data }) => {
                        ruleForm.domain = data.domain
                        ruleForm.ip = data.ip
                        ruleForm.name = data.name
                        ruleForm.group = data.group.id
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

        const getAutofill = async (domain) => {
            try {
                const response = await ApiService.get(`targets/ip?domain=${domain}`);
                const { data } = response;
                return data.ip;
            } catch (error: any) {
                notification(error?.response?.data?.detail, 'error', 'Có lỗi xảy ra');
                throw error;
            }
        }

        const getDataGroup = async () => {
            loading.value = true;
            return ApiService.get(`targetgroup/list/`)
                .then(({ data }) => {
                    data_group.value = data
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                });
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
                if (icon == 'success' || values == 'Mục tiêu không tồn tại' || values == 'Có lỗi xảy ra') {
                    router.push({ name: urlBack.value });
                }
            });
        }
        const resetForm = () => {
            errors.name = ''
            errors.domain = ''
            errors.ip = ''
            errors.group = ''
            errors.detail = ''
        }

        onMounted(() => {
            getData();
            getDataGroup();
        });


        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            name: '',
            group: '',
            domain: '',
            ip: '',
        })
        const errors = reactive<RuleForm2>({
            name: '',
            group: '',
            ip: '',
            domain: '',
            detail: ''
        });

        const validateName = (rule: any, value: any, callback: any) => {
            const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharacters.test(value)) {
                callback(new Error('Tên nhóm không được chứa ký tự đặc biệt'));
            } else {
                callback();
            }
        };

        const isValidIPAddress = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const specialCharacters = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})$/;
            if (!specialCharacters.test(value)) {
                callback(new Error('IP không đúng định dạng'));
            } else {
                callback();
            }
        };

        const isValidDomain = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const specialCharacters = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!specialCharacters.test(value)) {
                callback(new Error('Tên miền không đúng định dạng'));
            } else {
                callback();
            }
        };

        const rules = reactive<FormRules>({
            name: [
                { required: true, message: 'Tên mục tiêu không được để trống', trigger: 'blur' },
                { min: 3, max: 50, message: 'Độ dài từ 3-50 ký tự', trigger: 'blur' },
                { validator: validateName, trigger: 'blur' },
            ],
            ip: [
                { validator: isValidIPAddress, trigger: 'blur' },
            ],
            domain: [
                { validator: isValidDomain, trigger: 'blur' },
            ],
            group: [
                { required: true, message: 'Tên nhóm không được để trống', trigger: 'blur' },
            ]
        })

        const formSubmit = async (formEl: FormInstance | undefined) => {
            // // console.log(rules)
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
                    // console.log('error submit!', fields)
                }
            })
        }

        const urlBack = ref<string>('target-list')

        const formBack = async (data: any) => {
            router.push({ name: urlBack.value });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            const ip = await getAutofill(ruleForm.domain);
            ruleForm.ip = ip;
            return ApiService.post("/targets/", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                    // getData();
                    // console.log(data);
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.name = response.data.name;
                        errors.ip = response.data.ip;
                        errors.domain = response.data.domain;
                        errors.group = response.data.group;
                        errors.detail = response.data.detail;
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            const ip = await getAutofill(ruleForm.domain);
            ruleForm.ip = ip;

            return ApiService.put(`/targets/${ID.value}/`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.name = response.data.name;
                        errors.ip = response.data.ip;
                        errors.domain = response.data.domain;
                        errors.group = response.data.group;
                        errors.detail = response.data.detail;
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

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
            
        }

        onMounted(() => {
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            headerHeight,
            onheaderHeight,
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
            getAutofill,
            labelPosition,
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
}

.demo-ruleForm .el-input__wrapper.is-focus {
    background-color: var(--bs-gray-200);
    color: var(--bs-gray-700);
}

.demo-ruleForm .el-form-item--default .el-form-item__error {
    padding-top: 4px;
}

.demo-ruleForm .el-input__wrapper {
    background-color: var(--bs-gray-100);
    color: var(--bs-gray-700);
    border-radius: 10px !important;
    box-shadow: none !important;
}

.demo-ruleForm .el-input__wrapper input {
    font-weight: 500 !important;
    color: var(--bs-gray-700);
    font-size: 13px !important;
    line-height: 21px !important;
}

.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label-wrap>.el-form-item__label:after,
.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label:after {
    margin-left: 0px !important;
}
</style>