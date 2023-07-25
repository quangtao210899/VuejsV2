<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid pt-10">
        <div class="card d-block px-5 pb-20 mt-10 pt-10">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-width="'auto'" :label-position="labelPosition" 
                class="demo-ruleForm px-0 px-md-10 mx-0 mx-md-10 mt-10 text-capitalize" size="large" status-icon require-asterisk-position="right"
                >
                <el-form-item label="Tên mục tiêu" prop="name" class="pb-3 text-capitalize fs-6" tabindex="0" :error="(errors.name) ? errors.name[0] : ''">
                    <el-input v-model="ruleForm.name" size="large" placeholder="Nhập tên mục tiêu" :autofocus="true"
                        :class="(errors.name) ? 'el-error-ruleForm' : ''" />
                    <!-- <div class="fv-help-block  position-absolute start-0 el-form-item__error" style="top: 32px;">
                        <span class="" v-if="errors.name">{{ errors.name[0] }}</span>
                    </div> -->
                </el-form-item>
                <el-form-item label="Domain" prop="domain" class="pb-3 text-capitalize fs-6" :error="(errors.domain) ? errors.domain[0] : ''">
                    <el-input v-model="ruleForm.domain" size="large" v placeholder="Nhập domain mục tiêu" @blur="getAutofill(ruleForm.domain)
                        .then(ip => {
                            ruleForm.ip = ip
                        });" :class="(errors.domain) ? 'el-error-ruleForm' : ''" />
                    <!-- <div class="fv-help-block  position-absolute start-0 el-form-item__error" style="top: 32px;">
                        <span class="" v-if="errors.domain">{{ errors.domain[0] }}</span>
                    </div> -->
                </el-form-item>
                <el-form-item label="IP" prop="ip" class="pb-3 text-capitalize fs-6" :error="(errors.ip) ? errors.ip[0] : ''">
                    <el-input v-model="ruleForm.ip" size="large" placeholder="Nhập ip mục tiêu"
                        :class="(errors.ip) ? 'el-error-ruleForm' : ''" />
                    <!-- <div class="fv-help-block  position-absolute start-0 el-form-item__error" style="top: 32px;">
                        <span class="" v-if="errors.ip">{{ errors.ip[0] }}</span>
                    </div> -->
                </el-form-item>
                <el-form-item label="Nhóm mục tiêu" prop="group" class="pb-3 text-capitalize w-100 fs-6" :error="(errors.group) ? errors.group[0] : ''">
                    <el-select v-model="ruleForm.group" size="large" placeholder="Chọn nhóm mục tiêu" class="w-100" filterable no-match-text="Không có dữ liệu phù hợp"
                        :class="(errors.group) ? 'el-error-ruleForm' : ''">
                        <el-option v-for=" val  in  data_group " :key="val.id" :label="val.title" :value="val.id" />
                    </el-select>
                    <!-- <div class="fv-help-block  position-absolute start-0 el-form-item__error" style="top: 32px;">
                        <span class="" v-if="errors.group">{{ errors.group[0] }}</span>
                    </div> -->
                    <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                            <span class="" v-if="errors.detail">{{ Array.isArray(errors.detail) ? errors.detail[0] :
                                errors.detail }}</span>
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
                if (icon == 'success' || values == 'Mục tiêu không tồn tại') {
                    router.push({ name: 'target-list' });
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
                callback(new Error('Sai định dạng địa chỉ IP'));
            } else {
                callback();
            }
        };

        const isValidDomain = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const specialCharacters = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!specialCharacters.test(value)) {
                callback(new Error('Sai định dạng địa chỉ Domain'));
            } else {
                callback();
            }
        };

        const rules = reactive<FormRules>({
            name: [
                { required: true, message: 'Tên mục tiêu không được để trống', trigger: 'blur' },
                { min: 3, max: 50, message: 'kí tự trong khoảng từ 3 đến 50 kí tự', trigger: 'blur' },
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
            router.push({ name: 'target-list' });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            if (!ruleForm.ip.length) {
                const ip = await getAutofill(ruleForm.domain);
                ruleForm.ip = ip;
            }

            return ApiService.post("/targets/", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                    // getData();
                    console.log(data);
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
            if (!ruleForm.ip.length) {
                const ip = await getAutofill(ruleForm.domain);
                ruleForm.ip = ip;
            }

            return ApiService.put(`/targets/${ID.value}/`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Sửa mới thành công')
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
