<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20  pt-10" style="">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="33%" label-position="top"
                class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large"
                status-icon require-asterisk-position="right">
                <el-form-item v-if="!isNaN(parseInt(ID)) && ID != null && ID != ''" label="Tình Trạng" prop="is_ok" class="pb-3 text-capitalize fs-6">
                    <el-switch v-model="ruleForm.is_ok" class="ml-2" name="is_ok"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #f1416C" />
                    <span class="form-check-label user-select-none ms-5">
                        {{ ruleForm.is_ok ? "Đã kiểm tra" : "Chưa kiểm tra" }}
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-col :span="11">
                        <el-form-item label="Tên Đăng Nhập" prop="username" class="pb-3 text-capitalize fs-13px"
                            :error="(errors.username) ? errors.username[0] : ''">
                            <el-input v-model="ruleForm.username" size="large" placeholder="Tên đăng nhập"
                                @keydown="removeErrorMsgText"
                                :class="(errors.username) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="Email" prop="email" class="pb-3 text-capitalize fs-13px"
                            :error="(errors.email) ? errors.email[0] : ''">
                            <el-input v-model="ruleForm.email" size="large" placeholder="Email"
                                @keydown="removeErrorMsgText"
                                :class="(errors.email) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Password Hash" prop="password_hash" class="pb-3 text-capitalize fs-6" :error="(errors.password_hash) ? errors.password_hash[0] : ''">
                    <el-input v-model="ruleForm.password_hash" :rows="5" type="textarea" placeholder="Password hash"
                        :class="(errors.password_hash) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="Password Crack" prop="password_crack" class="pb-3 text-capitalize fs-6" :error="(errors.password_crack) ? errors.password_crack[0] : ''">
                    <el-input v-model="ruleForm.password_crack" :rows="5" placeholder="Password crack"
                        @keydown="removeErrorMsgText"
                        :class="(errors.password_crack) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="Nguồn Dữ Liệu" prop="source_data" class="pb-3 text-capitalize fs-6" :error="(errors.source_data) ? errors.source_data[0] : ''">
                    <el-input v-model="ruleForm.source_data" :rows="5" type="textarea" placeholder="Mua dữ liệu"
                        @keydown="removeErrorMsgText"
                        :class="(errors.source_data) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="Quốc Gia" prop="country_id" class="pb-3 text-capitalize fs-6" :error="(errors.country_id) ? errors.country_id[0] : ''">
                    <el-select placeholder="Quốc gia" as="select" id="country_id"
                        name="country_id" class="w-100" v-model="ruleForm.country_id" filterable>
                        <el-option label="Chọn quốc gia" value="" disabled>Chọn quốc gia</el-option>
                        <el-option label="Khác" value="0"></el-option>
                        <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
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
    email: string;
    username: string;
    password_hash: string;
    password_crack: string;
    source_data: string;
    country_id: String;
    is_ok: boolean;
}

interface CountryItem {
  id: number;
  name: string;
}

interface CountryList extends Array<CountryItem> { }

interface RuleForm2 {
    username: string
    email: string
    password_hash: string
    password_crack: string
    source_data: string
    country_id: number
    country: string
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

        const countryList = ref<CountryList>([
            {
                id: 0,
                name: "Khác",
            },
        ]);

        const getCountryList = async () => {            
            return await ApiService.get("/countries")
                .then(({ data }) => {
                    countryList.value = data;
                })
                .catch(({ response }) => {
                    notification(
                        response.data.detail,
                        "error",
                        "Không tải được danh sách quốc gia",
                    );
                });
        };

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
                if (icon == 'success' || values == 'CVE không tồn tại') {
                    router.push({ name: urlBack.value });
                }
            });
        }

        const resetForm = () => {
            // errors.username = ''
            // errors.email = ''
            // errors.vul_type = ''
            // errors.description = ''
            // errors.shodan_dock = ''
            // errors.version = ''
            // errors.poc = ''
            // errors.detail = ''
        }

        const removeErrorMsgText = () => {
            errors.username = "";
            errors.email = "";
            errors.password_crack = "";
            errors.password_hash = "";
        };

        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            email: "",
            username: "",
            password_hash: "",
            password_crack: "",
            source_data: "",
            country_id: "",
            is_ok: false,
        })
        const errors = reactive<RuleForm2>({
            username: "",
            email: "",
            password_hash: "",
            password_crack: "",
            source_data: "",
            country_id: 0,
            country: "",
            detail: "",
        });

        const detailData = reactive({
            id: "",
            email: "",
            password_hash: "",
            password_crack: "",
            source_data: "",
            country: "",
            country_id: "",
            hash_type: [],
            username: "",
            is_ok: false,
            modified_at: "",
            created_at: "",
        });

        const requireEitherUsernameOrEmail = (rule: any, value: any, callback: any) => {
            if (!value && !ruleForm.email) {
                callback(new Error('Vui lòng điền ít nhất một trong hai trường: username hoặc email'));
            } else {
                callback();
            }
        };

        const requireEitherPasswordHashOrPasswordCrack = (rule: any, value: any, callback: any) => {
            if (!value && !ruleForm.password_crack) {
                callback(new Error('Vui lòng điền ít nhất một trong hai trường: password hash hoặc password crack'));
            } else {
                callback();
            }
        };

        const isValidEmail = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!pattern.test(value)) {
                callback(new Error('Email không đúng định dạng'));
            } else {
                callback();
            }
        };

        const rules = reactive<FormRules>({
            username: [
                { validator: requireEitherUsernameOrEmail, trigger: 'blur' },
            ],
            email: [
                { validator: isValidEmail, trigger: 'blur' },
            ],
            password_hash: [
                { validator: requireEitherPasswordHashOrPasswordCrack, trigger: 'blur' },
            ],
            country_id: [
                { required: true, message: 'Vui lòng chọn quốc gia', trigger: 'blur' },
            ],
        })

        const formSubmit = async (formEl: FormInstance | undefined) => {
            if (!formEl) return
            resetForm();
            await formEl.validate((valid, fields) => {
                if (valid) {
                    if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
                        editFormSubmit(ruleForm);
                        console.log(ruleForm, 1);
                        
                    } else {
                        addFormSubmit(ruleForm);
                    }
                } else {
                    console.log('error submit!', fields)
                }
            })
        }

        const urlBack = ref<string>('account-leaks')

        const formBack = async (data: any) => {
            router.push({ name: urlBack.value });
        }

        const getData = async () => {
            if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
                loading.value = true;
                return ApiService.get(`account-leak/${ID.value}/detail/`)
                    .then(({ data }) => {
                        ruleForm.username = data.username;
                        ruleForm.email = data.email;
                        ruleForm.password_hash = data.password_hash;
                        ruleForm.password_crack = data.password_crack;
                        ruleForm.source_data = data.source_data;
                        ruleForm.country_id = data.country;
                        ruleForm.is_ok = data.is_ok;
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

        const addFormSubmit = async (formData: RuleForm) => {
            return ApiService.post("account-leak/create", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.username = response.data.username;
                        errors.email = response.data.email;
                        errors.password_hash = response.data.password_hash;
                        errors.password_crack = response.data.password_crack;
                        errors.source_data = response.data.source_data;
                        errors.country_id = response.data.country_id
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            return ApiService.put(`/account-leak/${ID.value}/update/`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.username = response.data.username;
                        errors.email = response.data.email;
                        errors.password_hash = response.data.password_hash;
                        errors.password_crack = response.data.password_crack;
                        errors.source_data = response.data.source_data;
                        errors.country_id = response.data.count
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
            getData();
            getCountryList();
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
            countryList,
            removeErrorMsgText,
            ID,
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
</style>