<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid " :style="{marginTop: headerHeight + 'px'}">
        <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20 pt-10"> 
            <el-form ref="ruleFormRef" :model="scanFormState" :rules="rules" label-width="33%"
                label-position="top" class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize"
                size="large" status-icon require-asterisk-position="right">
                <el-form-item label="" prop="scanTool" class="pb-3 text-capitalize fs-6">
                    <el-tree ref="treeRef" :data="scanTool" show-checkbox node-key="id"
                        :default-expanded-keys="['0']" :props="defaultProps" class="custom-tree fs-13px" style="color: #252f4a; font-weight: 500;"/>
                </el-form-item>
                <div class="el-form-item el-form-item--large asterisk-right el-form-item--feedback text-capitalize fs-6">
                    <div class="el-form-item__content d-inline-block">
                        <!-- <el-button @click="switchButton">
                            <el-icon style="vertical-align: middle; width: 25px; height: 25px;">
                                <CirclePlusFilled id="circle-plus-filled" style="width: 25px; height: 25px;" />
                                <RemoveFilled id="remove-filled" style="width: 25px; height: 25px;" class="d-none"/>
                            </el-icon>
                        </el-button> -->
                        <el-button type="" text @click="switchButton">
                            <el-icon style="vertical-align: middle; width: 25px; height: 25px;">
                                <CirclePlusFilled id="circle-plus-filled" style="width: 25px; height: 25px;" />
                                <RemoveFilled id="remove-filled" style="width: 25px; height: 25px;" class="d-none"/>
                            </el-icon>
                        </el-button>
                        <!-- <el-switch
                            v-model="scanFormState.advancedCheck"
                        /> -->
                    </div>
                    <label class="el-form-item__label d-inline-block" style="width: 34%;">Nâng Cao</label>
                </div>
                <div v-if="scanFormState.advancedCheck">
                    <el-form-item label="Tốc độ scan" prop="domain" class="text-capitalize fs-6 custom-form">
                        <el-radio-group v-model="scanFormState.scanSpeedOption" size="large">
                            <el-radio :label="1">Tuần Tự</el-radio>
                            <el-radio :label="2">Chậm</el-radio>
                            <el-radio :label="3">Trung Bình</el-radio>
                            <el-radio :label="4">Nhanh</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="custom-form" style="margin-bottom: 22px;">
                        <div class="el-form-item el-form-item--large asterisk-right el-form-item--feedback text-capitalize fs-6">
                            <label class="el-form-item__label d-inline-block custom-button">Proxy</label>
                            <div class="el-form-item__content d-inline-block">
                                <el-switch
                                    v-model="scanFormState.proxyCheck"
                                />
                            </div>
                        </div>
                        <el-form-item v-if="scanFormState.proxyCheck" label="Giao thức" prop="proxyScheme" class="pb-3 text-capitalize w-100 fs-6" :error="(errors.proxyScheme) ? errors.proxyScheme[0] : ''">
                            <el-select v-model="scanFormState.proxyScheme" id="proxyScheme" name="proxyScheme"
                                as="select" placeholder="Giao thức" class="w-100">
                                <el-option label="HTTP" value="HTTP">HTTP</el-option>
                                <el-option label="SOCKS5" value="SOCKS5">SOCKS5</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="scanFormState.proxyCheck" label="Địa chỉ" prop="proxyAdress" class="pb-3 text-capitalize fs-6" :error="(errors.proxyAdress) ? errors.proxyAdress[0] : ''">
                            <el-input v-model="scanFormState.proxyAdress" size="large" placeholder="Địa chỉ"
                                :class="(errors.proxyAdress) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                        <el-form-item v-if="scanFormState.proxyCheck" label="Cổng Dịch Vụ" prop="proxyPort" class="pb-3 text-capitalize fs-6" :error="(errors.proxyPort) ? errors.proxyPort[0] : ''">
                            <el-input v-model="scanFormState.proxyPort" size="large" placeholder="Cổng dịch vụ"
                                :class="(errors.proxyPort) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                        <div v-if="scanFormState.proxyCheck" class="el-form-item el-form-item--large asterisk-right el-form-item--feedback text-capitalize fs-6">
                            <label class="el-form-item__label d-inline-block custom-button">Proxy yêu cầu xác thực</label>
                            <div class="el-form-item__content d-inline-block">
                                <el-switch
                                    v-model="scanFormState.proxyAuthenticationCheck"
                                />
                            </div>
                        </div>
                        <el-form-item v-if="scanFormState.proxyCheck && scanFormState.proxyAuthenticationCheck" label="Tên Đăng Nhập" prop="proxyUsername" class="pb-3 text-capitalize fs-6" :error="(errors.proxyUsername) ? errors.proxyUsername[0] : ''">
                            <el-input v-model="scanFormState.proxyUsername" size="large" placeholder="Tên đăng nhập"
                                :class="(errors.proxyUsername) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                        <el-form-item v-if="scanFormState.proxyCheck && scanFormState.proxyAuthenticationCheck" label="Mật khẩu mới" prop="proxyUserPassword" class="text-capitalize fs-6" tabindex="0"
                            :error="(errors.proxyUserPassword) ? errors.proxyUserPassword[0] : ''" >
                            <el-input v-model="scanFormState.proxyUserPassword" size="large" placeholder="Mật khẩu mới"
                                type="password" :show-password="true" :class="(errors.proxyUserPassword) ? 'el-error-ruleForm' : ''"
                                autocomplete="new-password" />
                        </el-form-item>
                    </div>
                    <div class="custom-form" style="margin-bottom: 22px;">
                        <div class="el-form-item el-form-item--large asterisk-right el-form-item--feedback text-capitalize fs-6">
                            <label class="el-form-item__label d-inline-block custom-button">Sử Dụng Header Tùy Chọn</label>
                            <div class="el-form-item__content d-inline-block">
                                <el-switch
                                    v-model="scanFormState.headerOptionCheck"
                                />
                            </div>
                        </div>
                        <el-form-item v-if="scanFormState.headerOptionCheck" prop="headerData" label="Header" class="text-capitalize fs-6">
                            <!-- <el-select v-model="scanFormState.headerOptionValue" multiple filterable class="w-100"
                                allow-create default-first-option placeholder="Ví dụ: Cookie: 67b976c29f">
                            </el-select> -->
                            
                            <div class="row w-100">
                                <el-input class="col-10" @keydown.enter.prevent @keyup.enter="addRow(scanFormState.headerData)" v-model="scanFormState.headerData" size="large" placeholder="Ví dụ: Cookie: 67b976c29f"
                                    :class="(errors.headerData && scanFormState.headerData.length == 0) ? 'el-error-ruleForm' : ''"/>
                                <div class="col-2">
                                    <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Thêm" placement="top">
                                        <el-icon @click="addRow(scanFormState.headerData)" style="vertical-align: middle; width: 25px; height: 25px; cursor: pointer;">
                                            <CirclePlusFilled id="circle-plus-filled" style="width: 25px; height: 25px;" />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <div style="text-transform: initial !important;
                                    line-height: 18px !important;
                                    color: #f1416c !important;
                                    font-size: 12px;
                                    padding-top: 4px;
                                    padding-bottom: 15px;">
                                    <span class="" v-if="errors.headerData">
                                        {{ Array.isArray(errors.headerData) ? errors.headerData[0] : errors.headerData }}
                                    </span>
                                </div>
                            </div>
                            <div v-for="(item, index) in scanFormState.headerOptionValue" :key="index" class="w-100 row">
                                <el-input class="col-10 mb-5" disabled v-model="scanFormState.headerOptionValue[index]" size="large" placeholder="Ví dụ: Cookie: 67b976c29f"
                                    :class="(errors.proxyUsername) ? 'el-error-ruleForm' : ''" :autofocus="true"/>
                                <div class="col-2">
                                    <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Xóa" placement="top">
                                        <el-icon @click="removeRow(index)" style="vertical-align: middle; width: 25px; height: 25px; cursor: pointer;">
                                            <DeleteFilled id="remove-filled" style="width: 25px; height: 25px;"/>
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="custom-form">
                        <div class="el-form-item el-form-item--large asterisk-right el-form-item--feedback text-capitalize fs-6">
                            <label class="el-form-item__label d-inline-block custom-button">Quét Lại</label>
                            <div class="el-form-item__content d-inline-block">
                                <el-switch
                                    v-model="scanFormState.rescanRecurTimeCheck"
                                />
                            </div>
                        </div>
                        <el-form-item v-if="scanFormState.rescanRecurTimeCheck" label="Thời Gian (Giờ)" prop="rescanRecurTime" class=" text-capitalize fs-6" :error="(errors.rescanRecurTime) ? errors.rescanRecurTime[0] : ''">
                            <el-input v-model="scanFormState.rescanRecurTime" size="large"
                                :class="(errors.rescanRecurTime) ? 'el-error-ruleForm' : ''" />
                        </el-form-item>
                    </div>
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
import { ElTree } from 'element-plus'
import { RemoveFilled, CirclePlusFilled, DeleteFilled } from '@element-plus/icons-vue'

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        KTToolbar,
        CirclePlusFilled,
        RemoveFilled,
        DeleteFilled,
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
        const treeRef = ref<InstanceType<typeof ElTree>>()
        // const headerData = ref<string>('')

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
                    router.push({ name: 'target-scan' });
                }
            });
        }

        const defaultProps = reactive({
            children: 'children',
            label: 'label',
        });

        const resetForm = () => {
            errors.proxyAdress = ''
            errors.proxyPort = ''
            errors.proxyUsername = ''
            errors.proxyUserPassword = ''
            errors.headerData = ''
            // errors.headerOptionValue = ''
            errors.rescanRecurTime = ''
            errors.detail = ''
            if (!scanFormState.advancedCheck) {
                scanFormState.proxyCheck = false
                scanFormState.headerOptionCheck = false
                scanFormState.rescanRecurTimeCheck = false          
                scanFormState.proxyAuthenticationCheck = false
                scanFormState.scanSpeedOption = 0
                scanFormState.proxyScheme = ""
                scanFormState.proxyAdress = ""
                scanFormState.proxyPort = ""
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
                scanFormState.headerOptionValue = []
                scanFormState.rescanRecurTime = 0
            }

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

            if (!scanFormState.rescanRecurTimeCheck) {
                scanFormState.rescanRecurTime = 0
            }
        }

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
            rescanRecurTime: '',
            headerData: ''
        });

        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/target-scans\/(\d+)/);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };

        const removeRow = (index: any) =>{
            if (scanFormState.headerOptionValue.length > 0) scanFormState.headerOptionValue.splice(index, 1)
            errors.headerData = ''
        }

        const addRow = (value: string) => {
            
            if (!value) {
                errors.headerData = 'Vui lòng nhập Header'

                return
            }

            if (!isValidCookieString(value)) {
                if (scanFormState.headerOptionValue.includes(value)) {
                    errors.headerData = 'Header đã bị trùng lăp'

                    return
                }

                scanFormState.headerOptionValue.push(value)
                scanFormState.headerData = ''
                errors.headerData = ''
            }
        }

        const scanFormState = reactive({
            targetID: getIdFromUrl(),
            scanToolSelect: [] as string[],
            advancedCheck: false,
            scanSpeedOption: 3,
            proxyCheck: false,
            proxyScheme: "",
            proxyAdress: '',
            proxyPort: '',
            proxyAuthenticationCheck: false,
            proxyUsername: '',
            proxyUserPassword: '',
            headerOptionCheck: false,
            headerOptionValue: [] as string[],
            rescanOptionCheck: false,
            rescanRecurTime: 1,
            rescanRecurTimeCheck: false,
            nmap_check: false,
            nuclei_check: false,
            acunetix_check: false,
            headerData: '',
        })

        const scanTool = ref([
            {
                label: 'Scan toàn bộ',
                id: '0',
                children: [
                    {
                        label: 'Acunetix',
                        name: "Acunetix",
                        id: '1',
                    },
                    {
                        label: 'Nessus',
                        name: "Nessus",
                        id: '2',
                    },
                    {
                        label: 'Nmap',
                        name: 'Nmap',
                        id: '3',
                    },
                    {
                        label: 'Nuclei',
                        name: 'Nuclei',
                        id: '4',
                    },
                    {
                        label: 'BurpSuite',
                        name: 'BurpSuite',
                        id: '5',
                    },
                    {
                        label: 'Invicti',
                        name: 'Invicti',
                        id: '6',
                    },
                ],
            },
        ]);

        const getCheckedKeys = () => {
            return treeRef.value!.getCheckedKeys(false)
        }

        const clearHeaderOptions = () => {
            scanFormState.headerOptionValue = []
        }

        const isValidDomain = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            const specialCharacters = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!specialCharacters.test(value)) {
                callback(new Error('Địa chỉ không đúng định dạng'));
            } else {
                callback();
            }
        };

        const isValidCookieString = (value: string) => {
            const specialCharacters = /^Cookie:\s*[^\s].*$/;

            if (!specialCharacters.test(value)) {
                errors.headerData = 'Header không đúng định dạng'

                return true
            } 
            
            return false
        };

        const isValidPort = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            value = Number(value)
            
            if (!Number.isInteger(value)) {
                callback(new Error('Cổng dịch vụ phải là số'))
            } else if (value < 0) {
                callback(new Error('Cổng dịch vụ không được là số âm'))
            } else if (value > 65535) {
                callback(new Error('Giới hạn mà cổng dịch vụ cho phép phải nhỏ hơn 65535'))
            } else {
                callback();
            }
        }

        const isValidrescanRecurTime = (rule: any, value: any, callback: any) => {
            if (value == null || value == '') { return true; }
            value = Number(value)
            
            if (!Number.isInteger(value)) {
                callback(new Error('Thời gian quét phải là số'))
            } else if (value < 0) {
                callback(new Error('Thời gian quét không được là số âm'))
            } else {
                callback();
            }
        }

        const rules = reactive<FormRules>({
            rescanRecurTime: [
                { validator: isValidrescanRecurTime, trigger: 'blur' },
            ],
            proxyAdress: [
                { required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' },
                { validator: isValidDomain, trigger: 'blur' },
            ],
            proxyPort: [
                { required: true, message: 'Vui lòng nhập cổng dịch vụ', trigger: 'blur' },
                { validator: isValidPort, trigger: 'blur' },
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
                    // console.log('error submit!', fields)
                }
            })
        }

        const formBack = async (data: any) => {
            router.push({ name: 'target-scan' });
        }

        const addFormSubmit = async () => {
            let selectedKey = getCheckedKeys()

            if (selectedKey.length == 0) {
                notification('Vui lòng chọn một công cụ để scan', 'error', 'Có lỗi xảy ra')

                return
            }

            scanFormState.nmap_check = selectedKey.includes('3') ? true : false
            scanFormState.nuclei_check = selectedKey.includes('4') ? true : false
            scanFormState.acunetix_check = selectedKey.includes('1') ? true : false

            if (scanFormState.scanToolSelect.length > 0) scanFormState.scanToolSelect = []
            selectedKey.forEach((element) => {
                if (typeof element === 'string') {
                    scanFormState.scanToolSelect.push(element);
                }
            });

            // console.log(scanFormState, 111);            
            
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

        const switchButton = () => {
            let buttonPlus = document.getElementById("circle-plus-filled");
            let buttonRemove = document.getElementById("remove-filled");
            
            if (!scanFormState.advancedCheck) {
                scanFormState.advancedCheck = true
                if (buttonPlus !== null) buttonPlus.classList.add("d-none");
                if (buttonRemove !== null) buttonRemove.classList.remove("d-none");
            } else {
                scanFormState.advancedCheck = false
                if (buttonPlus !== null) buttonPlus.classList.remove("d-none");
                if (buttonRemove !== null) buttonRemove.classList.add("d-none");
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
            loading,
            ruleFormRef,
            rules,
            type,
            formBack,
            formSubmit,
            errors,
            labelPosition,
            scanFormState,
            clearHeaderOptions,
            defaultProps,
            scanTool,
            treeRef,
            switchButton,
            removeRow,
            addRow,
            // headerData,
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

.custom-form {
    border: #ced0d9 1px solid;
    padding: 20px;
    border-radius: 20px;
    margin-left: 40px;
    margin-right: 40px;
}

.el-checkbox__inner {
    width: 18px !important;
    height: 18px !important;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 8px;
    background: #f9f9f9;
}

.el-checkbox__inner::after {
    width: 7px !important;
    height: 9px !important;
}

/* Media query cho màn hình >= 992px (lg) */
@media (min-width: 1466px) {
    .custom-button {
        width: 93%;
    }
}

/* Media query cho màn hình >= 768px và < 992px (md) */
@media (min-width: 673px) and (max-width: 1465px) {
    .custom-button {
        width: 90%;
    }
}

@media (max-width: 672px) {
    .custom-button {
        width: 80%;
    }
}

.el-button.is-text:not(.is-disabled):focus, .el-button.is-text:not(.is-disabled):hover {
    background-color: #fff;
}

.el-radio.el-radio--large .el-radio__label {
    font-size: 13px;
    color: #252f4a;
}
</style>
