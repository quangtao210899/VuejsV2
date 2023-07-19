<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid">
        <div class="card d-block px-5  pb-20">
            <!--end::Card header-->
            <div class="card-header flex-wrap border-0 pt-3 p-0">
                <div class="card-title">
                    <h3 class="card-label text-capitalize">
                        {{ `${type} Mục Tiêu` }}
                    </h3>
                </div>
            </div>

            <!--begin::Card body-->
            <div class="h-100 w-100 p-0 m-0">
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto"
                    class="demo-ruleForm px-0 px-md-10 mx-0 mx-md-10 mt-10" :size="formSize" status-icon
                    label-position="left">
                    <el-form-item label="Tên mục tiêu" prop="name" class="pb-3 position-relative text-capitalize">
                        <el-input v-model="ruleForm.name" />
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block  position-absolute start-0" style="top: 25px;">
                                <span class="" v-if="errors.name">{{ errors.name[0] }}</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="Domain" prop="domain" class="pb-3 position-relative text-capitalize">
                        <el-input v-model="ruleForm.domain" />
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block  position-absolute start-0" style="top: 25px;">
                                <span class="" v-if="errors.domain">{{ errors.domain[0] }}</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="IP" prop="ip" class="pb-3 position-relative text-capitalize">
                        <el-input v-model="ruleForm.ip" />
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block  position-absolute start-0" style="top: 25px;">
                                <span class="" v-if="errors.ip">{{ errors.ip[0] }}</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="Nhóm mục tiêu" prop="group" class="pb-3 position-relative text-capitalize w-400px">
                        <el-select v-model="ruleForm.group" placeholder="Chọn nhóm mục tiêu">
                            <el-option v-for=" val  in  data_group " :key="val.id" :label="val.title" :value="val.id" />
                        </el-select>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block  position-absolute start-0" style="top: 25px;">
                                <span class="" v-if="errors.group">{{ errors.group[0] }}</span>
                            </div>
                        </div>
                    </el-form-item>
                    <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                            <span class="" v-if="errors.detail">{{ Array.isArray(errors.detail) ? errors.detail[0] :
                                errors.detail }}</span>
                        </div>
                    </div>
                </el-form>
            </div>
            <!--end::Card body-->
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
        const ID = ref<any>((route.params.id == 'null' ? null : route.params.id));
        const type = ref<string>((ID.value == null ? 'Thêm mới' : 'Chỉnh sửa'))
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
                confirmButtonText: "Đồng ý!",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-danger" : "btn btn-primary",
                },
            }).then(() => {
                if (icon == 'success' || values == 'Mục tiêu không tồn tại') {
                    router.push({ name: 'target-list' });
                }
            });
        }

        onMounted(() => {
            getData();
            getDataGroup();
        });


        // validate
        const formSize = ref('default')
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
                { required: true, message: 'Tên mục tiêu không được để trống', trigger: 'change' },
                { min: 3, max: 50, message: 'kí tự trong khoảng từ 3 đến 50 kí tự', trigger: 'change' },
                { validator: validateName, trigger: 'change' },
            ],
            ip: [
                { validator: isValidIPAddress, trigger: 'change' },
            ],
            domain: [
                { validator: isValidDomain, trigger: 'change' },
            ],
            group: [
                { required: true, message: 'Tên nhóm không được để trống', trigger: 'change' },
            ]
        })

        const formSubmit = async (formEl: FormInstance | undefined) => {
            // console.log(rules)
            if (!formEl) return
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

        return {
            list,
            data_group,
            loading,
            formSize,
            ruleFormRef,
            ruleForm,
            rules,
            type,
            formBack,
            formSubmit,
            errors,
        };
    },
});
</script>
<style >
.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}

.demo-ruleForm .el-form-item__label {
    flex-direction: row-reverse !important
}
</style>