<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20  pt-10" style="">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="33%" :label-position="labelPosition"
                class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large"
                status-icon require-asterisk-position="right">
                <el-form-item label="Tên Nhóm Telegram" prop="name" class="pb-3 text-capitalize fs-13px"
                    :error="(errors.name) ? errors.name[0] : ''">
                    <el-input v-model="ruleForm.name" size="large" placeholder="Tên Nhóm Telegram"
                        :class="(errors.name) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <!--begin::Input group-->
                <div class="d-flex flex-stack mb-8">
                    <!--begin::Label-->
                    <div class="me-5">
                        <label class="fs-6 fw-semobold" for="status">Trạng thái</label>

                        <div class="fs-7 fw-semobold text-gray-400">
                            Bật trạng thái để có thể đồng bộ hóa Telegram
                        </div>
                    </div>
                    <!--end::Label-->

                    <!--begin::Switch-->
                    <label class="form-check form-switch form-check-custom form-check-solid" for="status">
                        <el-switch v-model="ruleForm.status"
                        style="--el-switch-on-color: #50cd89; --el-switch-off-color: #f1416c" :active-value="0"
                        :inactive-value="1" />
                    </label>
                    <!--end::Switch-->
                </div>
                <!--end::Input group-->
                <!--begin::Input group-->
                <div class="mb-15 fv-row">
                    <!--begin::Wrapper-->
                    <div class="d-flex flex-stack">
                        <!--begin::Label-->
                        <div class="fw-semobold me-5">
                            <label class="fs-6" for="type">Kiểu nhóm</label>

                            <div class="fs-7 text-gray-400">
                                Chọn kiểu cho nhóm Telegram
                            </div>
                        </div>
                        <!--end::Label-->

                        <!--begin::radio-->
                        <div class="d-flex align-items-center">
                            <!--begin::radio-->
                            <label class="form-check form-check-custom form-check-solid me-10">
                                <input class="form-check-input h-20px w-20px" type="radio" name="type" value="1"
                                    v-model="ruleForm.type" checked />

                                <span class="form-check-label fw-semobold"> DB Leak </span>
                            </label>
                            <!--end::radio-->

                            <!--begin::radio-->
                            <label class="form-check form-check-custom form-check-solid">
                                <input v-model="ruleForm.type" class="form-check-input h-20px w-20px" type="radio"
                                    name="type" value="2" />

                                <span class="form-check-label fw-semobold"> Hacker News </span>
                            </label>
                            <!--end::radio-->
                        </div>
                        <!--end::radio-->
                    </div>
                    <!--end::Wrapper-->
                </div>
                <!--end::Input group-->
                <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                        <span class="" v-if="errors.detail">
                            {{ Array.isArray(errors.detail) ? errors.detail[0] : errors.detail }}
                        </span>
                    </div>
                </div>
            </el-form>
        </div>
    </div>

    <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onUnmounted } from "vue";
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
    status: number
    type: number
}

interface RuleForm2 {
    name: string
    status: string
    type: string
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
                return ApiService.get(`telegram/group/${ID.value}/edit`)
                    .then(({ data }) => {
                        ruleForm.status = data.status
                        ruleForm.type = data.type
                        ruleForm.name = data.name
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
                if (icon == 'success' || values == 'Nhóm không tồn tại') {
                    router.push({ name: urlBack.value });
                }
            });
        }
        const resetForm = () => {
            errors.name = ''
            errors.type = ''
            errors.status = ''
            errors.detail = ''
        }

        onMounted(() => {
            getData();
        });


        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            name: '',
            type: 1,
            status: 0
        })
        const errors = reactive<RuleForm2>({
            name: '',
            type: '',
            status: '',
            detail: ''
        });

        const rules = reactive<FormRules>({
            name: [
                { required: true, message: 'Tên nhóm telegarm không được để trống', trigger: 'blur' },
                { min: 3, max: 50, message: 'Độ dài từ 3-50 ký tự', trigger: 'blur' },
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

        const urlBack = ref<string>('telegram-group')

        const formBack = async (data: any) => {
            router.push({ name: urlBack.value });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            let formData2 = {
                name: formData.name,
                type: formData.type,
                status: formData.status
            }
            return ApiService.post("/telegram/group/create", formData2)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                    // getData();
                    console.log(data);
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.name = response.data.name;
                        errors.status = response.data.status;
                        errors.type = response.data.type;
                        errors.detail = response.data.detail;
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            let formData2 = {
                name: formData.name,
                type: formData.type,
                status: formData.status
            }
            return ApiService.put(`/telegram/group/${ID.value}/update`, formData2)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.name = response.data.name;
                        errors.status = response.data.status;
                        errors.type = response.data.type;
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
    color: #252f4a !important;
}

.demo-ruleForm .el-input__wrapper {
    box-shadow: none !important;

}

.demo-ruleForm .el-input__wrapper.is-focus {
    background-color: #f1f1f2 !important;
    color: #4b5675 !important;
}

.demo-ruleForm .el-form-item--default .el-form-item__error {
    padding-top: 4px;
}


.demo-ruleForm .el-input__wrapper {
    background: #f9f9f9;
    border-radius: 10px !important;

}

.demo-ruleForm .el-input__wrapper input {
    font-weight: 500 !important;
    color: #252f4a !important;
    font-size: 13px !important;
    line-height: 21px !important;
}

.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label-wrap>.el-form-item__label:after,
.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label:after {
    margin-left: 0px !important;
}
</style>