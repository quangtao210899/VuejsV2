<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20  pt-10" style="">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="33%" label-position="top"
                class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large"
                status-icon require-asterisk-position="right">
                <el-form-item>
                    <el-col :span="6">
                        <el-form-item label="Mã CVE" prop="code" class="pb-3 text-capitalize fs-13px"
                            :error="(errors.code) ? errors.code[0] : ''">
                            <el-input v-model="ruleForm.code" size="large" placeholder="CVE-YYYY-xxxxxx"
                                :class="(errors.code) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Loại Sản Phẩm" prop="product_type" class="pb-3 text-capitalize fs-13px">
                            <el-select id="product_type" name="product_type" placeholder="Loại sản phẩm" class="w-100"
                                @change="removeErrorMsgOption" v-model="ruleForm.product_type">
                                <!-- <el-option label="Chọn loại sản phẩm" value="">Chọn loại sản phẩm</el-option> -->
                                <el-option v-for="item in dataProduct" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Loại Lỗ Hổng" prop="vul_type" class="pb-3 text-capitalize fs-13px">
                            <el-select name="vul_type" placeholder="Loại lỗ hông" @change="removeErrorMsgOption" class="w-100"
                                v-model="ruleForm.vul_type">
                                <!-- <el-option label="Chọn loại lỗ hổng" value="">Chọn loại lỗ hổng</el-option> -->
                                <el-option v-for="item in dataVul" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Mô Tả" prop="description" class="pb-3 text-capitalize fs-6" :error="(errors.description) ? errors.description[0] : ''">
                    <el-input v-model="ruleForm.description" :rows="5" type="textarea" placeholder="Mô tả về CVE"
                        :class="(errors.description) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="Phiên Bản Ảnh Hưởng" prop="version" class="pb-3 text-capitalize fs-6" :error="(errors.version) ? errors.version[0] : ''">
                    <el-input v-model="ruleForm.version" :rows="5" type="textarea" placeholder="Phiên bản sản phẩm bị ảnh hưởng bởi CVE"
                        :class="(errors.version) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="Shodan Dock" prop="shodan_dock" class="pb-3 text-capitalize fs-6" :error="(errors.shodan_dock) ? errors.shodan_dock[0] : ''">
                    <el-input v-model="ruleForm.shodan_dock" :rows="5" type="textarea" placeholder="Câu query shodan để tìm kiếm mục tiêu trên diện rộng. Cú pháp theo cú pháp tìm kiếm của shodan. Query phân cách bởi dấu ;"
                        :class="(errors.shodan_dock) ? 'el-error-ruleForm' : ''"
                    />
                </el-form-item>
                <el-form-item label="POC" prop="poc" class="pb-3 text-capitalize fs-6" :error="(errors.poc) ? errors.poc[0] : ''">
                    <el-input v-model="ruleForm.poc" :rows="5" type="textarea" placeholder="Thông tin POC, cách khai thác"
                        :class="(errors.poc) ? 'el-error-ruleForm' : ''"
                    />
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
    code: string
    product_type: string
    vul_type: string
    description: string
    version: string
    shodan_dock: string
    poc: string
}

interface RuleForm2 {
    code: string
    product_type: string
    vul_type: string
    description: string
    version: string
    shodan_dock: string
    poc: string
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
            errors.code = ''
            errors.product_type = ''
            errors.vul_type = ''
            errors.description = ''
            errors.shodan_dock = ''
            errors.version = ''
            errors.poc = ''
            errors.detail = ''
        }

        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            code: "",
            product_type: '',
            vul_type: '',
            description: '',
            version: '',
            shodan_dock: '',
            poc: '',
        })
        const errors = reactive<RuleForm2>({
            code: '',
            product_type: '',
            vul_type: '',
            description: '',
            version: '',
            shodan_dock: '',
            poc: '',
            detail: ''
        });

        const isValidCVE = (rule: any, value: any, callback: any) => {
            const patternCVECode = /^[Cc][Vv][Ee]-\d{4}-\d+$/;

            if (!patternCVECode.test(value)) {
                callback(new Error('Mã CVE không đúng định dạng'));
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
            code: [
                { required: true, message: 'Vui lòng nhập mã CVE', trigger: 'blur' },
                { validator: isValidCVE, trigger: 'blur' },
            ],
            product_type: [
                { required: true, message: 'Vui lòng chọn loại sản phẩm', trigger: 'blur' },
            ],
            vul_type: [
                { required: true, message: 'Vui lòng chọn loại lỗ hổng', trigger: 'blur' },
            ],
            version: [
                { required: true, message: 'Vui lòng nhập phiên bản ảnh hưởng', trigger: 'blur' },
            ],
            shodan_dock: [
                { required: true, message: 'Vui lòng nhập Shodan Dock', trigger: 'blur' },
            ],
        })

        const removeErrorMsgOption = () => {
            ruleForm.product_type !== '' ? errors.product_type = '' : ''
            ruleForm.vul_type !== '' ? errors.vul_type = '' : ''
        };

        const dataVul = [
            {
                value: 0,
                label: 'DoS',
            },
            {
                value: 1,
                label: 'Code Execution',
            },
            {
                value: 2,
                label: 'Overflow',
            },
            {
                value: 3,
                label: 'Memory Corruption',
            },
            {
                value: 4,
                label: 'Code Execution',
            },
            {
                value: 5,
                label: 'XSS',
            },
            {
                value: 6,
                label: 'Directory Traversal',
            },
            {
                value: 7,
                label: 'Http Response Splitting',
            },
            {
                value: 8,
                label: 'Bypass something',
            },
            {
                value: 9,
                label: 'Gain Information',
            },
            {
                value: 10,
                label: 'Gain Privileges',
            },
            {
                value: 11,
                label: 'CSRF',
            },
            {
                value: 12,
                label: 'File Inclusion',
            },
            {
                value: 13,
                label: 'Khác',
            },
        ]
        const dataProduct = [
            {
                value: 0,
                label: 'Microsoft',
            },
            {
                value: 1,
                label: 'Oracle',
            },
            {
                value: 2,
                label: 'Google',
            },
            {
                value: 3,
                label: 'Debian',
            },
            {
                value: 4,
                label: 'Apple',
            },
            {
                value: 5,
                label: 'IBM',
            },
            {
                value: 6,
                label: 'Redhat',
            },
            {
                value: 7,
                label: 'Fedoraproject',
            },
            {
                value: 8,
                label: 'Canonical',
            },
            {
                value: 9,
                label: 'Cisco',
            },
            {
                value: 10,
                label: 'Linux',
            },
            {
                value: 11,
                label: 'Opensuse',
            },
            {
                value: 12,
                label: 'Mozilla',
            },
            {
                value: 13,
                label: 'Netapp',
            },
            {
                value: 14,
                label: 'Apache',
            },
            {
                value: 15,
                label: 'HP',
            },
            {
                value: 16,
                label: 'Adobe',
            },
            {
                value: 17,
                label: 'SUN',
            },
            {
                value: 18,
                label: 'Jenkins',
            },
            {
                value: 19,
                label: 'SAP',
            },
            {
                value: 20,
                label: 'Suse',
            },
            {
                value: 21,
                label: 'Siemens',
            },
            {
                value: 22,
                label: 'GNU',
            },
            {
                value: 23,
                label: 'Gitlab',
            },
            {
                value: 24,
                label: 'Huawei',
            },
            {
                value: 25,
                label: 'F5',
            },
            {
                value: 26,
                label: 'PHP',
            },
            {
                value: 27,
                label: 'Intel',
            },
            {
                value: 28,
                label: 'Vmware',
            },
            {
                value: 29,
                label: 'Imagemagick',
            },
            {
                value: 30,
                label: 'Wireshark',
            },
            {
                value: 31,
                label: 'Novell',
            },
            {
                value: 32,
                label: 'Dell',
            },
            {
                value: 33,
                label: 'Mcafee',
            },
            {
                value: 34,
                label: 'Symantec',
            },
            {
                value: 35,
                label: 'Fortinet',
            },
            {
                value: 36,
                label: 'Moodle',
            },
            {
                value: 37,
                label: 'Juniper',
            },
            {
                value: 38,
                label: 'Freebsd',
            },
            {
                value: 39,
                label: 'Joomla',
            },
            {
                value: 40,
                label: 'XEN',
            },
            {
                value: 41,
                label: 'Broadcom',
            },
            {
                value: 42,
                label: 'Cpanel',
            },
            {
                value: 43,
                label: 'Zohocorp',
            },
            {
                value: 44,
                label: 'Ffmpeg',
            },
            {
                value: 45,
                label: 'Atlassian',
            },
            {
                value: 46,
                label: 'Mariadb',
            },
            {
                value: 47,
                label: 'EMC',
            },
            {
                value: 48,
                label: 'Wordpress',
            },
            {
                value: 49,
                label: 'Qemu',
            },
            {
                value: 50,
                label: 'Khác',
            },
        ]

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

        const urlBack = ref<string>('scanCVE')

        const formBack = async (data: any) => {
            router.push({ name: urlBack.value });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            return ApiService.post("cve/create/", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Thêm mới thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.code = response.data.code;
                        errors.product_type = response.data.product_type;
                        errors.vul_type = response.data.vul_type;
                        errors.description = response.data.description;
                        errors.version = response.data.version;
                        errors.poc = response.data.poc;
                        errors.shodan_dock = response.data.shodan_dock;
                        errors.detail = response.data.detail;
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        }

        const editFormSubmit = async (formData: RuleForm) => {
            return ApiService.put(`/targets/${ID.value}/`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Chỉnh sửa thành công')
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.code = response.data.code;
                        errors.product_type = response.data.product_type;
                        errors.vul_type = response.data.vul_type;
                        errors.description = response.data.description;
                        errors.version = response.data.version;
                        errors.poc = response.data.poc;
                        errors.shodan_dock = response.data.shodan_dock;
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
            removeErrorMsgOption,
            dataProduct,
            dataVul,
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