<template>
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#kt_modal_1"
  >
    <KTIcon icon-name="plus" icon-class="fs-2" />
    Import
  </button>

  <div class="modal fade" tabindex="-1" id="kt_modal_1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>

          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span class="svg-icon svg-icon-2x"></span>
          </div>
          <!--end::Close-->
        </div>

        <div class="modal-body">
          <form action="account-leak/import" class="dropzone" id="my-form">
            <div class="fallback">
              <input name="file" type="file" />
            </div>
            <!-- <div class="previews"></div> -->
            <!-- <button type="submit">Submit data and files!</button> -->
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="processUpload">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import Dropzone from "dropzone";
import JwtService from "@/core/services/JwtService";
const emit = defineEmits(["notify"]);

let headers = {
  Authorization: `Bearer ${JwtService.getToken()}`,
  Accept: "application/json",
  "Cache-Control": null,
};
let dropzone;
function processUpload() {
  if (dropzone == null || dropzone.getAcceptedFiles() == 0) {
    emit(
      "notify",
      "Vui lòng chọn tệp để import vào hệ thống",
      "error",
      "Hãy lựa chọn một tệp",
    );
  } else {
    let files = dropzone.getAcceptedFiles();
    console.log(files);
    dropzone.processQueue();
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
  acceptedFiles: ".csv, .xlsx, .txt",
};
onMounted(() => {
  let myDropzone = new Dropzone("#my-form");
  myDropzone.on("addedfile", file => {
    file.previewElement.addEventListener("click", function () {
      myDropzone.removeFile(file);
    });
    dropzone = myDropzone;
  });
  myDropzone.on("success", file => {
    myDropzone.removeAllFiles();
    console.log(file.xhr.response);
    let res = JSON.parse(file.xhr.response);
    console.log(res);
    emit("notify", res.detail.Errors.toString(), "info", "Thông tin thêm");
  });
});
</script>
