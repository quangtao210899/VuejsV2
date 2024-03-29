import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  // target thangdv
  {
    path: "/target",
    redirect: "/target",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/target-list",
        name: "target-list",
        component: () => import("@/views/apps/targets/TargetList.vue"),
        meta: {
          pageTitle: "Danh Sách Mục Tiêu",
          breadcrumbs: ["Mục Tiêu"],
        },
      },
      {
        path: "/target-detail/:id",
        name: "target-detail",
        component: () => import("@/views/apps/targets/TargetListDetail.vue"),
        meta: {
          pageTitle: "Chi tiết mục tiêu",
          breadcrumbs: ["Mục Tiêu", "detail"],
          links: ["/target-list"],
        },
      },
      {
        path: "/target-form/:id",
        name: "target-form",
        component: () => import("@/views/apps/targets/TargetForm.vue"),
        meta: {
          pageTitle: "Chi tiết mục tiêu",
          breadcrumbs: ["Mục Tiêu", "addForm"],
          links: ["/target-list"],
        },
      },
      {
        path: "/target-group-form/:id",
        name: "target-group-form",
        component: () => import("@/views/apps/targets/TargetGroupForm.vue"),
        meta: {
          pageTitle: "Chi tiết nhóm mục tiêu",
          breadcrumbs: ["Nhóm Mục Tiêu", "addForm"],
          links: ["/target-group"],
        },
      },
      {
        path: "/target-recons/:id",
        name: "target-recon",
        component: () => import("@/views/apps/targets/TargetReconList.vue"),
        meta: {
          pageTitle: "Danh Sách Recon",
          breadcrumbs: ["Mục Tiêu","Recon"],
          links: ["/target-list"],
        },
      },
      {
        path: "/target-recons/:id/add",
        name: "target-recon-add",
        component: () => import("@/views/apps/targets/TargetReconForm.vue"),
        meta: {
          pageTitle: "Recon Mục Tiêu",
          breadcrumbs: ["Mục Tiêu", "Recon", "Thêm mới"],
          links: ["/target-list", ''],
        },
      },
      {
        path: "/target-recon-detail/:idRecon/:id/detail",
        name: "target-recon-tab",
        component: () => import("@/views/apps/targets/TargetReconTabList.vue"),
        meta: {
          pageTitle: "Chi tiết recon",
          breadcrumbs: ["Mục Tiêu","Recon","Chi Tiết Recon"],
          links: ["/target-list",''],
        },
      },
      {
        path: "/target-recon-detail/:idRecon/:id/subdomains",
        name: "target-recon-tab-subdomains",
        component: () => import("@/views/apps/targets/TargetReconTabSubdomainsList.vue"),
        meta: {
          pageTitle: "Chi tiết Subdomains Recon",
          breadcrumbs: ["Target","Recon","Subdomains"],
          links: ["/target-list",''],
        },
      },
      {
        path: "/target-scans/:id/add",
        name: "target-scan-add",
        component: () => import("@/views/apps/targets/TargetScanForm.vue"),
        meta: {
          pageTitle: "Scan Mục Tiêu",
          breadcrumbs: ["Mục Tiêu","Scan", "Thêm Mới"],
          links: ["/target-list", ''],
        },
      },
      {
        path: "/target-scans/:id",
        name: "target-scan",
        component: () => import("@/views/apps/targets/TargetScanList.vue"),
        meta: {
          pageTitle: "Danh Sách Quét",
          breadcrumbs: ["Mục Tiêu","Scan"],
          links: ["/target-list"],
        },
      },
      {
        path: "/target-scan-detail/:idScan/:id/detail",
        name: "target-scanstab",
        component: () => import("@/views/apps/targets/TargetScanTabList.vue"),
        meta: {
          pageTitle: "Chi tiết danh sách quét",
          breadcrumbs: ["Target","Scan","Chi Tiết"],
          links: ["/target-list",''],
        },
      },
      {
        path: "/target-group",
        name: "target-group",
        component: () => import("@/views/apps/targets/TargetGroupList.vue"),
        meta: {
          pageTitle: "Danh Sách Nhóm Mục Tiêu",
          breadcrumbs: [ "Nhóm Mục Tiêu"],
        },
      },
    ],
  },
  {
    path: "/account-leaks",
    redirect: "/account-leaks",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/account-leaks",
        name: "account-leaks",
        component: () => import("@/views/apps/account_leaks/AccountList_v2.vue"),
        meta: {
          pageTitle: "Tài khoản rò rỉ",
          breadcrumbs: ["Tài Khoản Rò Rỉ"],
        },
      },
      {
        path: "/account-leaks-form/:id",
        name: "account-leaks-form",
        component: () => import("@/views/apps/account_leaks/AccountForm.vue"),
        meta: {
          pageTitle: "Account Leak",
          breadcrumbs: ["Tài Khoản Rò Rỉ", "addForm"],
          links: ["/account-leaks"],
        },
      },
    ],
  },
  {
    path: "/scans",
    redirect: "/scans",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/scans",
        name: "scans",
        component: () => import("@/views/apps/scans/ScanList.vue"),
        meta: {
          pageTitle: "Danh Sách Lỗ Hổng",
          breadcrumbs: ["Lỗ Hổng Bảo Mật"],
        },
      },
      
    ],
  },
  {
    path: "/vpn",
    redirect: "/vpn",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/vpn-list",
        name: "vpn-list",
        meta: {
          breadcrumbs: ["vpn"],
        },
        children: [
          {
            path: "vpn-scan",
            name: "vpn-scan",
            component: () => import("@/views/apps/vpn/VpnListScan.vue"),
            meta: {
              pageTitle: "Vpn Scan",
            },
          },
          {
            path: "vpn-recon",
            name: "vpn-recon",
            component: () => import("@/views/apps/vpn/VpnListRecon.vue"),
            meta: {
              pageTitle: "Vpn Recon",
            },
          },
        ],
      }
    ],
  },
  {
    path: "/telegram",
    redirect: "/telegram",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/telegram-list",
        name: "telegram",
        // component: () => import("@/views/apps/telegrams/TelegramList.vue"),
        component: () => import("@/views/apps/telegrams/TelegramList.vue"),
        meta: {
          pageTitle: "Telegarm",
          breadcrumbs: ["Telegram"],
        },
      },
      {
        path: "/telegram-detail/:id",
        name: "telegram-detail",
        // component: () => import("@/views/apps/telegrams/TelegramListDetail.vue"),
        component: () => import("@/views/apps/telegrams/TelegramListDetail.vue"),
        meta: {
          pageTitle: "Chi tiết nhóm Telegarm",
          breadcrumbs: ["Nhóm Telegram", "Chi Tiết",],
          links: ["/telegram-group"],
        },
      },
      {
        path: "/telegram-group",
        name: "telegram-group",
        component: () => import("@/views/apps/telegrams/TelegramGroupList.vue"),
        meta: {
          pageTitle: "Nhóm Telegarm",
          breadcrumbs: ["Nhóm Telegarm"],
        },
      },
      {
        path: "/telegram-group-form/:id",
        name: "telegram-group-form",
        component: () => import("@/views/apps/telegrams/TeltgramGroupForm.vue"),
        meta: {
          pageTitle: "Nhóm Telegarm",
          breadcrumbs: ["Nhóm Telegarm", "addForm"],
          links: ["/telegram-group"],
        },
      },
      {
        path: "/telegram-list/:id",
        name: "telegram-type",
        component: () => import("@/views/apps/telegrams/TelegramList.vue"),
        meta: {
          pageTitle: "Telegarm",
          breadcrumbs: ["Telegram"],
        },
      },
    ],
  },
  {
    path: "/log",
    redirect: "/log",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/log-list",
        name: "log",
        component: () => import("@/views/apps/logging/logList.vue"),
        meta: {
          pageTitle: "Log",
          breadcrumbs: ["Log"],
        },
      },
    ],
  },
  {
    path: "/cve",
    redirect: "/cve",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/cve",
        name: "scanCVE",
        component: () => import("@/views/apps/cves/CVEList.vue"),
        meta: {
          pageTitle: "CVE",
          breadcrumbs: ["CVE"],
        },
      },
      {
        path: "/cve-form/:id",
        name: "cve-form",
        component: () => import("@/views/apps/cves/CVEForm.vue"),
        meta: {
          pageTitle: "CVE",
          breadcrumbs: ["CVE", "addForm"],
          links: ["/cve"],
        },
      },
      {
        path: "/cve/:id/scan",
        name: "scanCVEList",
        component: () => import("@/views/apps/cves/CVEScanList.vue"),
        meta: {
          pageTitle: "Phát hiện mục tiêu",
          breadcrumbs: ["CVE","Scan"],
          links: ["/cve"],
        },
      },
      {
        path: "/cve/:idCVE/scan-detail/:id",
        name: "targetDetectionListCVE",
        component: () => import("@/views/apps/cves/targetDetectionListCVE.vue"), 
        meta: {
          pageTitle: "Danh sách mục tiêu dính lỗ hổng",
          breadcrumbs: ["CVE","Scan","Chi Tiết Scan"],
          links: ["/cve",''],
        },
      },
      {
        path: "/cve/:id/scan/detail",
        name: "targetDetectionListCVEAll",
        component: () => import("@/views/apps/cves/targetDetectionListCVEAll.vue"),
        meta: {
          pageTitle: "Danh sách mục tiêu dính lỗ hổng",
          breadcrumbs: ["CVE","Chi Tiết Kết Quả"],
          links: ["/cve",''],
        },
        beforeEnter: (to, from, next) => {
          const id = to.params.id; // Lấy giá trị id từ đường dẫn
          // Sử dụng id theo nhu cầu của bạn
          next();
        },
      },
    ],
  },
  {
    path: "/user",
    redirect: "/user",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },    
    children: [
      {
        path: "/user-list",
        name: "user",
        // component: () => import("@/views/apps/users/UserList.vue"),
        component: () => import("@/views/apps/users/UserList.vue"),
        meta: {
          pageTitle: "Người Dùng",
          breadcrumbs: ["Người Dùng"],
        },
      },
      {
        path: "/user-form/:id",
        name: "user-form",
        component: () => import("@/views/apps/users/UserForm.vue"),
        meta: {
          pageTitle: "Chi tiết nhóm mục tiêu",
          breadcrumbs: ["Người Dùng","addForm"],
          links: ["/user-list"],
        },
      },
      {
        path: "/user-profile",
        name: "user-profile",
        component: () => import("@/views/apps/users/ProfileList.vue"),
        meta: {
          pageTitle: "Thông Tin Cá Nhân",
          breadcrumbs: ["Profile"],
        },
      }
    ],
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => import("@/views/LayoutBuilder.vue"),
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "/crafted/pages/profile",
        name: "profile",
        component: () => import("@/components/page-layouts/Profile.vue"),
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () =>
              import("@/views/crafted/pages/profile/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () =>
              import("@/views/crafted/pages/profile/Projects.vue"),
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () =>
              import("@/views/crafted/pages/profile/Campaigns.vue"),
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () =>
              import("@/views/crafted/pages/profile/Documents.vue"),
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () =>
              import("@/views/crafted/pages/profile/Connections.vue"),
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () =>
              import("@/views/crafted/pages/profile/Activity.vue"),
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/crafted/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () => import("@/views/crafted/pages/wizards/Horizontal.vue"),
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () => import("@/views/crafted/pages/wizards/Vertical.vue"),
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/account",
        name: "account",
        component: () => import("@/views/crafted/account/Account.vue"),
        meta: {
          breadcrumbs: ["Crafted", "Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () => import("@/views/crafted/account/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "account-settings",
            component: () => import("@/views/crafted/account/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },
      {
        path: "/apps/customers/getting-started",
        name: "apps-customers-getting-started",
        component: () => import("@/views/apps/customers/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customers-listing",
        name: "apps-customers-listing",
        component: () => import("@/views/apps/customers/CustomersListing.vue"),
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customer-details",
        name: "apps-customers-details",
        component: () => import("@/views/apps/customers/CustomerDetails.vue"),
        meta: {
          pageTitle: "Customers Details",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/subscriptions/getting-started",
        name: "apps-subscriptions-getting-started",
        component: () =>
          import("@/views/apps/subscriptions/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/subscription-list",
        name: "apps-subscriptions-subscription-list",
        component: () =>
          import("@/views/apps/subscriptions/SubscriptionList.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/add-subscription",
        name: "apps-subscriptions-add-subscription",
        component: () =>
          import("@/views/apps/subscriptions/AddSubscription.vue"),
        meta: {
          pageTitle: "Add Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/view-subscription",
        name: "apps-subscriptions-view-subscription",
        component: () =>
          import("@/views/apps/subscriptions/ViewSubscription.vue"),
        meta: {
          pageTitle: "View Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => import("@/views/apps/Calendar.vue"),
        meta: {
          pageTitle: "Calendar",
          breadcrumbs: ["Apps"],
        },
      },
      {
        path: "/apps/chat/private-chat",
        name: "apps-private-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Private Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/group-chat",
        name: "apps-group-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Group Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/drawer-chat",
        name: "apps-drawer-chat",
        component: () => import("@/views/apps/chat/DrawerChat.vue"),
        meta: {
          pageTitle: "Drawer Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/crafted/modals/general/invite-friends",
        name: "modals-general-invite-friends",
        component: () =>
          import("@/views/crafted/modals/general/InviteFriends.vue"),
        meta: {
          pageTitle: "Invite Friends",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/view-user",
        name: "modals-general-view-user",
        component: () => import("@/views/crafted/modals/general/ViewUsers.vue"),
        meta: {
          pageTitle: "View User",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/upgrade-plan",
        name: "modals-general-upgrade-plan",
        component: () =>
          import("@/views/crafted/modals/general/UpgradePlan.vue"),
        meta: {
          pageTitle: "Upgrade Plan",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/share-and-earn",
        name: "modals-general-share-and-earn",
        component: () =>
          import("@/views/crafted/modals/general/ShareAndEarn.vue"),
        meta: {
          pageTitle: "Share And Earn",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/forms/new-target",
        name: "modals-forms-new-target",
        component: () => import("@/views/crafted/modals/forms/NewTarget.vue"),
        meta: {
          pageTitle: "New Target",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-card",
        name: "modals-forms-new-card",
        component: () => import("@/views/crafted/modals/forms/NewCard.vue"),
        meta: {
          pageTitle: "New Card",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-address",
        name: "modals-forms-new-address",
        component: () => import("@/views/crafted/modals/forms/NewAddress.vue"),
        meta: {
          pageTitle: "New Address",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/create-api-key",
        name: "modals-forms-create-api-key",
        component: () =>
          import("@/views/crafted/modals/forms/CreateApiKey.vue"),
        meta: {
          pageTitle: "Create Api Key",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/wizards/two-factor-auth",
        name: "modals-wizards-two-factor-auth",
        component: () =>
          import("@/views/crafted/modals/wizards/TwoFactorAuth.vue"),
        meta: {
          pageTitle: "Two Factory Auth",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-app",
        name: "modals-wizards-create-app",
        component: () => import("@/views/crafted/modals/wizards/CreateApp.vue"),
        meta: {
          pageTitle: "Create App",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-account",
        name: "modals-wizards-create-account",
        component: () =>
          import("@/views/crafted/modals/wizards/CreateAccount.vue"),
        meta: {
          pageTitle: "Create Account",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/widgets/lists",
        name: "widgets-list",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "Lists",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/statistics",
        name: "widgets-statistics",
        component: () => import("@/views/crafted/widgets/Statistics.vue"),
        meta: {
          pageTitle: "Statistics",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/charts",
        name: "widgets-charts",
        component: () => import("@/views/crafted/widgets/Charts.vue"),
        meta: {
          pageTitle: "Charts",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/mixed",
        name: "widgets-mixed",
        component: () => import("@/views/crafted/widgets/Mixed.vue"),
        meta: {
          pageTitle: "Mixed",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/tables",
        name: "widgets-tables",
        component: () => import("@/views/crafted/widgets/Tables.vue"),
        meta: {
          pageTitle: "Tables",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/feeds",
        name: "widgets-feeds",
        component: () => import("@/views/crafted/widgets/Feeds.vue"),
        meta: {
          pageTitle: "Feeds",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/multi-step-sign-up",
    name: "multi-step-sign-up",
    component: () =>
      import("@/views/crafted/authentication/MultiStepSignUp.vue"),
    meta: {
      pageTitle: "Multi-step Sign up",
    },
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  await authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
