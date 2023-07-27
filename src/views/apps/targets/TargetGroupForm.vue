<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20  pt-10">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-width="'33%'" :label-position="labelPosition"
                class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large"
                status-icon require-asterisk-position="right">
                <el-form-item label="Tên nhóm mục tiêu" prop="title" class="pb-3 text-capitalize fs-6" tabindex="0"
                    :error="(errors.title) ? errors.title[0] : ''">
                    <el-input v-model="ruleForm.title" size="large" placeholder="Tên nhóm mục tiêu" :autofocus="true"
                        :class="(errors.title) ? 'el-error-ruleForm' : ''" />
                </el-form-item>
                <el-form-item label="Mô Tả" prop="description" class="pb-3 text-capitalize fs-6">
                    <el-input v-model="ruleForm.description" :rows="5" type="textarea" placeholder="Mô tả nhóm mục tiêu"
                        :autofocus="true" />
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
    title: string
    description: string
}

interface RuleForm2 {
    title: string
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
                return ApiService.get(`targetgroup/${ID.value}`)
                    .then(({ data }) => {
                        ruleForm.title = data.title
                        ruleForm.description = data.description
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
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            }).then(() => {
                if (icon == 'success' || values == 'Mục tiêu không tồn tại') {
                    router.push({ name: 'target-group' });
                }
            });
        }
        const resetForm = () => {
            errors.title = ''
        }

        onMounted(() => {
            getData();
            getDataGroup();
        });


        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            title: '',
            description: '',
        })
        const errors = reactive<RuleForm2>({
            title: '',
        });

        const validateTitle = (rule: any, value: any, callback: any) => {
            const specialCharacters = /^[ a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸ]+$/;
            if (specialCharacters.test(value)) {
                callback();
            } else {
                callback(new Error('Tên nhóm không được chứa ký tự đặc biệt'));
            }
        };



        const rules = reactive<FormRules>({
            title: [
                { required: true, message: 'Tên nhóm mục tiêu không được để trống', trigger: 'blur' },
                // { min: 3, max: 50, message: 'kí tự trong khoảng từ 3 đến 50 kí tự', trigger: 'blur' },
                { validator: validateTitle, trigger: 'blur' },
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
            router.push({ name: 'target-group' });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            return ApiService.post("/targetgroup", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                    // getData();
                    console.log(data);
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.title = response.data.title;
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            return ApiService.put(`/targetgroup/${ID.value}`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.title = response.data.title;
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
            console.log(height)
        }

        onMounted(() => {
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            onheaderHeight,
            headerHeight,
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

.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label-wrap>.el-form-item__label:after,
.demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label:after {
    margin-left: 0px !important;
}</style>