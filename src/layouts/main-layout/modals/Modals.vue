<template>
  <KTUpgradePlanModal />
  <KTCreateAppModal />
  <KTNewTargetModal />
  <KTNewTargetGroupModal />
  <KTViewUsersModal />
  <KTInviteFriendsModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTUpgradePlanModal from "@/components/modals/general/UpgradePlanModal.vue";
import KTCreateAppModal from "@/components/modals/wizards/create-app-modal/CreateAppModal.vue";
import KTNewTargetModal from "@/components/modals/forms/NewTargetModal.vue";
import KTNewTargetGroupModal from "@/components/modals/forms/NewTargetGroupModal.vue";
import KTViewUsersModal from "@/components/modals/general/ViewUsersModal.vue";
import KTInviteFriendsModal from "@/components/modals/general/InviteFriendsModal.vue";

export default defineComponent({
  name: "global-modals",
  components: {
    KTUpgradePlanModal,
    KTCreateAppModal,
    KTNewTargetGroupModal,
    KTNewTargetModal,
    KTViewUsersModal,
    KTInviteFriendsModal,
  },
});
</script>
