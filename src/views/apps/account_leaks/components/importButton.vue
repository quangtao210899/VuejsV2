<template>
  <!-- <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Upload Account Leaks" placement="top">
    <button type="button" class="btn btn-sm fw-bold btn-info me-2" data-bs-toggle="modal" data-bs-target="#kt_modal_1">
      <KTIcon icon-name="bi bi-upload" icon-class="fs-2" />
      Import
    </button>
  </el-tooltip> -->

  <div class="modal fade" tabindex="-1" id="kt_modal_1" ref="uploadModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload Danh Sách Tài Khoản</h5>
          <!--begin::Close-->
          <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
            <span class="svg-icon svg-icon-2x"></span>
          </div>
          <!--end::Close-->
        </div>

        <div class="modal-body">
          <form action="account-leak/import" class="dropzone" id="my-form">
            <div class="fallback">
              <input name="file" type="file" />
            </div>
            <div class="dz-message" data-dz-message>
              <span>Tải lên tệp của bạn tại đây</span>
            </div>
            <div class="previews"></div>
          </form>
        </div>

        <div class="modal-footer justify-content-between">
          <div>
            <el-link type="primary" :href="url" download="example_account_leaks.xlsx">{{ exampleFileName }}</el-link>
            <!-- <a :href="url" download="example_account_leaks.xlsx">{{exampleFileName}}</a> -->
          </div>
          <div>
            <el-button class="border-0" plain type="info" data-bs-dismiss="modal">Đóng</el-button>
            <el-button class="border-0" plain type="primary" :disabled="disabled" @click="processUpload" :loading=loading>
              Tải Lên
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from "vue";
import Dropzone from "dropzone";
import JwtService from "@/core/services/JwtService";
const emit = defineEmits(["notify",'resetData','confirm']);
let headers = {
  Authorization: `Bearer ${JwtService.getToken()}`,
  Accept: "application/json",
  "Cache-Control": null,
};
let dropzone: Dropzone | null;
function processUpload() {
  if (dropzone == null || dropzone.getQueuedFiles().length === 0) {
    emit(
      "notify",
      "Vui lòng chọn tệp để import vào hệ thống",
      "error",
      "Hãy lựa chọn một tệp",
      false
    );
  } else {
    loading.value = true
    disabled.value = true
    let files = dropzone.getQueuedFiles();
    dropzone.processQueue();
    setTimeout(() => {
      disabled.value = false
    }, 600);
  }
}

Dropzone.options.myForm = {
  paramName: "file",
  maxFilesize: 20,
  maxFiles: 1,
  url: import.meta.env.VITE_APP_API_URL + "/account-leak/import",
  headers: headers,
  method: "post",
  autoProcessQueue: false,
  createImageThumbnails: false,
  acceptedFiles: ".csv, .xlsx",
};
onMounted(() => {
  let myDropzone = new Dropzone("#my-form");
  myDropzone.on("addedfile", (file) => {
    if (myDropzone.files.length > 1) {
      myDropzone.removeFile(myDropzone.files[0]); // Xóa tệp cũ
    }
    let filenameElement = file.previewElement.querySelector(".dz-filename");
    filenameElement.style.marginTop = "30px";
    file.previewElement.addEventListener("click", function () {
      myDropzone.removeFile(file);
    });
    dropzone = myDropzone;
  });
  myDropzone.on("success", (file) => {
    myDropzone.removeAllFiles();
    let res = JSON.parse(file.xhr.response);
    if(res.detail['total_error']){
      const message = `Upload thành công ${res.detail['total_success']} bản ghi, thất bại ${res.detail['total_error']} bản ghi. Tải file để xem chi tiết lỗi`
      emit("confirm", message , "error");
      loading.value = false
    }
    else {
      const message = `Upload thành công ${res.detail['total_success']} bản ghi.`
      emit("notify", message, "success","Thông tin thêm", true);
      loading.value = false
    }
    emit("resetData");
  });
  myDropzone.on("error", file => {
    myDropzone.removeAllFiles();
    let errorMessage = file.previewElement.querySelector(".dz-error-message");
    if (errorMessage) {
      file.previewElement.removeChild(errorMessage);
    }
    try {
      const errorResponse = JSON.parse(file.xhr.response);
      const errorMessage = errorResponse.file.detail ?? "Có lỗi xảy ra";
      emit("notify", errorMessage, "error", "Lỗi", false);
    } catch (error) {
      emit("notify", "Có lỗi xảy ra", "error", "Lỗi", false);
    }
  });
});

const fileExample = 'example_account_leaks.xlsx'
const loading = ref<boolean>(false)
const disabled = ref<boolean>(false);
const url = import.meta.env.VITE_APP_API_URL + '/Storage/accountLeak/' + fileExample
const exampleFileName = "Tải File Mẫu"
import { hideModal } from "@/core/helpers/dom";
const uploadModalRef = ref<null | HTMLElement>(null);
const closeModal = () => {
  hideModal(uploadModalRef.value)
};
defineExpose({
  closeModal
});
</script>
<style scoped>
.dropzone .dz-preview .dz-filename {
  margin-top: 5px;
}
.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>