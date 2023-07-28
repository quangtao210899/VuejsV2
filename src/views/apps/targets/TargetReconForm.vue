<template>
    <KTToolbar :check-search="false" :check-submit="true" :type-text="type" :check-back="true"
        @form-submit="formSubmit(ruleFormRef)" @form-back="formBack" @click="getCheckedKeys" @on-header-height="onheaderHeight"></KTToolbar>
    <el-scrollbar :height="heightTable" >
        <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}">
            <div class="bg-body rounded-3 d-block px-0 mx-0 px-lg-0 mx-lg-0 mx-xxl-20 pb-20 pt-10">
                <el-form ref="ruleFormRef" :model="ruleForm" label-width="33%"
                    class="demo-ruleForm px-0 px-lg-0 mx-5 mx-lg-10 mx-xxl-20 px-xxl-10 mt-10 text-capitalize" size="large" status-icon require-asterisk-position="right">
                    <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                            <span class="" v-if="errors.tree">{{ Array.isArray(errors.tree) ? errors.tree[0] :
                                errors.tree }}</span>
                        </div>
                    </div>

                    <el-tree ref="treeRef" :data="dataFormCreate" show-checkbox node-key="id"
                        :default-expanded-keys="['0-0', '0-0-0', '0-0-1', '0-0-2', '0-0-3']" :props="defaultProps" class="custom-tree text-dark fs-13px"/>
                </el-form>
            </div>
        </div>
    </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import { ElTree } from 'element-plus'
// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
    recon: Object
    target_id: number
}

interface Errors {
    tree: string;
    notifi_error_select: string[];
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
        const treeRef = ref<InstanceType<typeof ElTree>>()
        const type = ref<string>((ID.value == null ? 'Thêm Mới' : 'Chỉnh Sửa'))
        const list = ref<object | any>([])
        const data_group = ref<object | any>([])
        const loading = ref<boolean>(false)
        const router = useRouter();
        const reconID = ref<null | number | any>(route.params.id ?? '');

        // const getData = async () => {
        //     if (!isNaN(parseInt(ID.value)) && ID.value != null && ID.value != '') {
        //         loading.value = true;
        //         return ApiService.get(`targets/${ID.value}`)
        //             .then(({ data }) => {
        //                 ruleForm.domain = data.domain
        //                 ruleForm.ip = data.ip
        //                 ruleForm.name = data.name
        //                 ruleForm.group = data.group.id
        //             })
        //             .catch(({ response }) => {
        //                 notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        //             })
        //             .finally(() => {
        //                 loading.value = false
        //             })
        //     }
        //     return;
        // }

        const defaultProps = reactive({
            children: 'children',
            label: 'label',
        });

        const dataFormCreate = ref([
            {
                label: 'Full recon',
                id: '0-0',
                children: [
                    {
                        label: 'OSINT',
                        name: "OSINT",
                        id: '0-0-0',
                        children: [
                            {
                                label: 'Domain information',
                                name: "domain",
                                id: '0-0-0-0',
                            },
                            {
                                label: 'Emails addresses and users',
                                name: "email",
                                id: '0-0-0-1',
                            },
                            {
                                label: 'Password leaks',
                                name: "password",
                                id: '0-0-0-2',
                            },
                            {
                                label: 'Metadata finder',
                                name: "metadata",
                                id: '0-0-0-3',
                            },
                        ],
                    },
                    {
                        label: 'Subdomains',
                        name: "Subdomains",
                        id: '0-0-1',
                        children: [
                            {
                                id: '0-0-1-0',
                                label: 'Passive',
                                name: "sub_passive",
                            },
                            {
                                id: '0-0-1-1',
                                label: 'Certificate transparency',
                                name: "sub_crt",
                            },
                            {
                                id: '0-0-1-2',
                                label: 'TLS handshake',
                                name: "sub_active",
                            },
                            {
                                id: '0-0-1-3',
                                label: 'NOERROR subdomain discovery',
                                name: "sub_noerror",
                            },
                            {
                                id: '0-0-1-4',
                                label: 'Bruteforce',
                                name: "sub_brute",
                            },
                            {
                                id: '0-0-1-5',
                                label: 'DNS Records',
                                name: "sub_dns",
                            },
                            {
                                id: '0-0-1-6',
                                label: 'JS files & Source Code Scraping',
                                name: "sub_scraping",
                            },
                            {
                                id: '0-0-1-7',
                                label: 'Google Analytics ID',
                                name: "sub_analytics",
                            },
                            {
                                id: '0-0-1-8',
                                label: 'Cloud checkers',
                                name: "s3buckets",
                            },
                            {
                                id: '0-0-1-9',
                                label: 'Subdomains takeover',
                                name: "subdomains_takeover",
                            },
                        ],
                    },
                    {
                        label: 'Hosts',
                        name: 'Hosts',
                        id: '0-0-2',
                        children: [
                            {
                                id: '0-0-2-0',
                                label: 'IP info',
                                name: "whoisxml",
                            },
                            {
                                id: '0-0-2-1',
                                label: 'CDN checker',
                                name: "ipcdn",
                            },
                            {
                                id: '0-0-2-2',
                                label: 'WAF checker',
                                name: "wafw00f",
                            },
                            {
                                id: '0-0-2-3',
                                label: 'Port Scanner',
                                name: "port_scanner",
                            },
                        ],
                    },
                    {
                        label: 'Webs',
                        name: 'Webs',
                        id: '0-0-3',
                        children: [
                            {
                                id: '0-0-3-0',
                                label: 'Web Prober',
                                name: "prober",
                            },
                            {
                                id: '0-0-3-1',
                                label: 'CMS Scanner',
                                name: "cms",
                            },
                            {
                                id: '0-0-3-2',
                                label: 'Url extraction',
                                name: "url_extraction",
                            },
                            {
                                id: '0-0-3-3',
                                label: 'URL patterns Search and filtering',
                                name: "url_filter",
                            },
                            {
                                id: '0-0-3-4',
                                label: 'Javascript analysis',
                                name: "js_analysis",
                            },
                            {
                                id: '0-0-3-5',
                                label: 'Fuzzing',
                                name: "fuzzing",
                            },
                        ],
                    },
                ],
            },
        ]);

        const dataValidateTree = ref([
            {
                key: "0-0-0-2",
                title: "Password leaks",
                children: [
                    {
                        key: "0-0-0-1",
                        title: "Emails addresses and users",
                    },
                ],
            },
            {
                key: "0-0-1-5",
                title: "DNS Records",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-6",
                title: "JS files & Source Code Scraping",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-8",
                title: "Cloud checkers",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-9",
                title: "Subdomains takeover",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-0",
                title: "Web Prober",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-2-1",
                title: "CDN checker",
                children: [
                    {
                        key: "0-0-1-5",
                        title: "DNS Records",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-2-2",
                title: "WAF checker",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                ],
            },
            {
                key: "0-0-3-2",
                title: "Url extraction",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-1",
                title: "CMS Scanner",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-5",
                title: "Fuzzing",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-4",
                title: "Javascript analysis",
                children: [
                    {
                        key: "0-0-1-6",
                        title: "JS files & Source Code Scraping",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-3",
                title: "URL patterns Search and filtering",
                children: [
                    {
                        key: "0-0-3-2",
                        title: "Url extraction",
                    },
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
        ]);

        const getCheckedKeys = () => {
            return treeRef.value!.getCheckedKeys(false)
        }

        const resetData = () => {
            treeRef.value!.setCheckedKeys([], false)
        }

        const validationSchema = () => {
            let checkedKey: string[] = [],
                expandedKey: string[] = [];
            let selectedKey = getCheckedKeys()
            if (getCheckedKeys().length == 0) {
                notification('Bạn phải chọn ít nhất một recon', 'error', 'Có lỗi xảy ra')

                return true
            } else {
                dataValidateTree.value.map(el => {
                    el.children.map(e => {
                        if (getCheckedKeys().includes(el.key) && !getCheckedKeys().includes(e.key)) {
                            let keyExpanded = e.key.slice(0, 5);
                            checkedKey.push(e.key);
                            expandedKey.push(keyExpanded);
                            errors.notifi_error_select.push("Để recon " + el.title + " bạn cần chạy thêm " + e.title);
                        }
                    })
                })

                const mergedArray = [...new Set([...selectedKey, ...checkedKey])];

                treeRef.value!.setCheckedKeys(mergedArray, false)
                
                if (errors.notifi_error_select.length) {
                    const formattedTexts = errors.notifi_error_select.map((text, index) => `<p style='text-align:left'>${index + 1}. ${text}</p>`).join("");
                    notification(formattedTexts, 'error', 'Có lỗi xảy ra', '600px')
                    errors.notifi_error_select = []

                    return true
                }

                return false
            }
        };

        const notification = (values: string, icon: string, more: string, width: string = '') => {
            Swal.fire({
                html: values ?? more,
                icon: icon,
                buttonsStyling: false,
                width: width,
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            }).then(() => {
                if (icon == 'success' || values == 'Mục tiêu không tồn tại' || values == 'Có lỗi xảy ra') {
                    router.push({ name: 'target-recon' });
                }
            });
        }
        const resetForm = () => {
            errors.notifi_error_select = []
            errors.tree = ''
        }

        // onMounted(() => {
        //     getData();
        // });


        // validate
        const ruleFormRef = ref<FormInstance>()
        const ruleForm = reactive<RuleForm>({
            recon: {},
            target_id: 0,
        })

        const errors: Errors = reactive({
            tree: '',
            notifi_error_select: [],
        });

        const formSubmit = async (formEl: FormInstance | undefined) => {
            if (!formEl) return
            resetForm();
            await formEl.validate((valid, fields) => {
                if (valid) {
                    addFormSubmit(ruleForm);
                } else {
                    console.log('error submit!', fields)
                }
            })
        }

        const formBack = async (data: any) => {
            router.push({ name: 'target-recon' });
        }

        const addFormSubmit = async (formData: RuleForm) => {
            if (validationSchema()) {
                return
            }

            let dataTree = dataFormCreate.value[0]['children']
            let checkedKey = getCheckedKeys();

            let arr: string[] = [];

            checkedKey.forEach((element) => {
                if (typeof element === 'string' && element.length > 5) {
                    arr.push(element.slice(0, 5));
                }
            });
            const checkedKeyNew = [...new Set(checkedKey.concat(arr))];

            formData = {
                recon: dataTree.map(({ id, label, children }) => ({
                    title: label,
                    active: checkedKeyNew.find(name => name == id) == id ? true : false,
                    children: children.map(({ name, id, label }) => ({
                        title: label,
                        name: name,
                        active: checkedKeyNew.find(name => name == id) == id ? true : false,
                    }))
                })),
                target_id: reconID.value,
            }

            return ApiService.post("recon/create2/", formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Recon mục tiêu thành công')
                })
                .catch(({ response }) => {
                    notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                });
        }

        const heightTable = ref(0)
        const handleResize = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 1400) {
            heightTable.value = window.innerHeight - 80;
        } else if (windowWidth >= 1200) {
            heightTable.value = window.innerHeight - 80;
        } else if (windowWidth >= 992) {
            heightTable.value = window.innerHeight - 80;
        } else if (windowWidth >= 768) {
            heightTable.value = window.innerHeight - 75;
        } else if (windowWidth >= 576) {
            heightTable.value = window.innerHeight - 75;
        } else {
            // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
            heightTable.value = window.innerHeight - 70;
        }
        };

        // tính labelPosition form
        // const labelPosition = ref('left')
        // const handleResize = () => {
        //     const windowWidth = window.innerWidth;
        //     if (windowWidth >= 992) {
        //         labelPosition.value = 'left'
        //     } else if (windowWidth >= 768) {
        //         labelPosition.value = 'top'
        //     } else if (windowWidth >= 576) {
        //         labelPosition.value = 'top'
        //     } else {
        //         labelPosition.value = 'top'
        //     }
        // };

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
            type,
            formBack,
            formSubmit,
            errors,
            // labelPosition,
            dataFormCreate,
            defaultProps,
            treeRef,
            dataValidateTree,
            getCheckedKeys,
            resetData,
            validationSchema,
            heightTable
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