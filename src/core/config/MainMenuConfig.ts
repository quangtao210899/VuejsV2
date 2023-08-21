export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}
const accountLeakMenu = {
  heading: "Account Leaks",
  route: "/account-leaks",
  pages: [
    {
      heading: "Tài Khoản Rò Rỉ",
      route: "/account-leaks",
      keenthemesIcon: "bi bi-person-exclamation",
      bootstrapIcon: "bi bi-person-exclamation",
    },
  ],
};
const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Trang Chủ",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "Target",
    route: "/target",
    pages: [
      {
        heading: "Mục Tiêu",
        route: "/target-list",
        keenthemesIcon: "bi bi-life-preserver",
        bootstrapIcon: "bi bi-life-preserver",
      },
      {
        heading: "Nhóm Mục Tiêu",
        route: "/target-group",
        keenthemesIcon: "bi bi-diagram-3",
        bootstrapIcon: "bi bi-diagram-3",
      },
    ],
  },
  accountLeakMenu,
  {
    heading: "Telgram",
    route: "/telegram",
    pages: [
      {
        heading: "Telegram",
        route: "/telegram-list",
        keenthemesIcon: "bi bi-telegram",
        bootstrapIcon: "bi bi-telegram",
      },
      {
        heading: "Nhóm Telegram",
        route: "/telegram-group",
        keenthemesIcon: "people",
        bootstrapIcon: "people",
      },
    ],
  },
  {
    heading: "Scans",
    route: "/scans",
    pages: [
      {
        heading: "Lỗ Hổng Bảo Mật",
        route: "/scans",
        keenthemesIcon: "bi bi-bug-fill",
        bootstrapIcon: "bi bi-bug-fill",
      },
    ],
  },
  {
    heading: "Hỗ trợ vấn công",
    route: "/vpn",
    pages: [
      {
        route: "/vpn-list",
        keenthemesIcon: "bi bi-shield-check",
        bootstrapIcon: "bi bi-shield-check",
        sectionTitle: "Kết Nối VPN",
        sub: [
          {
            heading: "Kết Nối VPN Recon",
            route: "/vpn-recon",
          },
          {
            heading: "Kết Nối VPN Scan",
            route: "/vpn-scan",
          },
        ]
      },
    ],
  },
  {
    heading: "Cves",
    route: "/cve",
    pages: [
      {
        heading: "CVE",
        route: "/cve",
        keenthemesIcon: "bi bi-wallet-fill",
        bootstrapIcon: "bi bi-wallet-fill",
      },
    ],
  },
  {
    heading: "User",
    route: "/user",
    pages: [
      {
        heading: "Người Dùng",
        route: "/user-list",
        keenthemesIcon: "user",
        bootstrapIcon: "user",
      },
      {
        heading: "Thông Tin Cá Nhân",
        route: "/user-profile",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "profile-circle",
      },
    ],
  },
  {
    heading: "LOG",
    route: "/log",
    pages: [
      {
        heading: "Logging",
        route: "/log-list",
        keenthemesIcon: "information-5",
        bootstrapIcon: "bi bi-exclamation-circle-fill",
      },
    ],
  },
  // {
  //   heading: "craft",
  //   route: "/crafted",
  //   pages: [
  //     {
  //       sectionTitle: "pages",
  //       route: "/pages",
  //       keenthemesIcon: "element-plus",
  //       bootstrapIcon: "bi-archive",
  //       sub: [
  //         {
  //           sectionTitle: "profile",
  //           route: "/profile",
  //           sub: [
  //             {
  //               heading: "profileOverview",
  //               route: "/crafted/pages/profile/overview",
  //             },
  //             {
  //               heading: "projects",
  //               route: "/crafted/pages/profile/projects",
  //             },
  //             {
  //               heading: "campaigns",
  //               route: "/crafted/pages/profile/campaigns",
  //             },
  //             {
  //               heading: "documents",
  //               route: "/crafted/pages/profile/documents",
  //             },
  //             {
  //               heading: "connections",
  //               route: "/crafted/pages/profile/connections",
  //             },
  //             {
  //               heading: "activity",
  //               route: "/crafted/pages/profile/activity",
  //             },
  //           ],
  //         },
  //         {
  //           sectionTitle: "wizards",
  //           route: "/wizard",
  //           sub: [
  //             {
  //               heading: "horizontal",
  //               route: "/crafted/pages/wizards/horizontal",
  //             },
  //             {
  //               heading: "vertical",
  //               route: "/crafted/pages/wizards/vertical",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       sectionTitle: "account",
  //       route: "/account",
  //       keenthemesIcon: "profile-circle",
  //       bootstrapIcon: "bi-person",
  //       sub: [
  //         {
  //           heading: "accountOverview",
  //           route: "/crafted/account/overview",
  //         },
  //         {
  //           heading: "settings",
  //           route: "/crafted/account/settings",
  //         },
  //       ],
  //     },
  //     {
  //       sectionTitle: "authentication",
  //       keenthemesIcon: "fingerprint-scanning",
  //       bootstrapIcon: "bi-sticky",
  //       sub: [
  //         {
  //           sectionTitle: "basicFlow",
  //           sub: [
  //             {
  //               heading: "signIn",
  //               route: "/sign-in",
  //             },
  //             {
  //               heading: "signUp",
  //               route: "/sign-up",
  //             },
  //             {
  //               heading: "passwordReset",
  //               route: "/password-reset",
  //             },
  //           ],
  //         },
  //         {
  //           heading: "multiStepSignUp",
  //           route: "/multi-step-sign-up",
  //         },
  //         {
  //           heading: "error404",
  //           route: "/404",
  //         },
  //         {
  //           heading: "error500",
  //           route: "/500",
  //         },
  //       ],
  //     },
  //     {
  //       sectionTitle: "modals",
  //       route: "/modals",
  //       keenthemesIcon: "design",
  //       bootstrapIcon: "bi-shield-check",
  //       sub: [
  //         {
  //           sectionTitle: "general",
  //           route: "/general",
  //           sub: [
  //             {
  //               heading: "inviteFriends",
  //               route: "/crafted/modals/general/invite-friends",
  //             },
  //             {
  //               heading: "viewUsers",
  //               route: "/crafted/modals/general/view-user",
  //             },
  //             {
  //               heading: "upgradePlan",
  //               route: "/crafted/modals/general/upgrade-plan",
  //             },
  //             {
  //               heading: "shareAndEarn",
  //               route: "/crafted/modals/general/share-and-earn",
  //             },
  //           ],
  //         },
  //         {
  //           sectionTitle: "forms",
  //           route: "/forms",
  //           sub: [
  //             {
  //               heading: "newTarget",
  //               route: "/crafted/modals/forms/new-target",
  //             },
  //             {
  //               heading: "newCard",
  //               route: "/crafted/modals/forms/new-card",
  //             },
  //             {
  //               heading: "newAddress",
  //               route: "/crafted/modals/forms/new-address",
  //             },
  //             {
  //               heading: "createAPIKey",
  //               route: "/crafted/modals/forms/create-api-key",
  //             },
  //           ],
  //         },
  //         {
  //           sectionTitle: "wizards",
  //           route: "/wizards",
  //           sub: [
  //             {
  //               heading: "twoFactorAuth",
  //               route: "/crafted/modals/wizards/two-factor-auth",
  //             },
  //             {
  //               heading: "createApp",
  //               route: "/crafted/modals/wizards/create-app",
  //             },
  //             {
  //               heading: "createAccount",
  //               route: "/crafted/modals/wizards/create-account",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       sectionTitle: "widgets",
  //       route: "/widgets",
  //       keenthemesIcon: "element-7",
  //       bootstrapIcon: "bi-layers",
  //       sub: [
  //         {
  //           heading: "widgetsLists",
  //           route: "/crafted/widgets/lists",
  //         },
  //         {
  //           heading: "widgetsStatistics",
  //           route: "/crafted/widgets/statistics",
  //         },
  //         {
  //           heading: "widgetsCharts",
  //           route: "/crafted/widgets/charts",
  //         },
  //         {
  //           heading: "widgetsMixed",
  //           route: "/crafted/widgets/mixed",
  //         },
  //         {
  //           heading: "widgetsTables",
  //           route: "/crafted/widgets/tables",
  //         },
  //         {
  //           heading: "widgetsFeeds",
  //           route: "/crafted/widgets/feeds",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   heading: "apps",
  //   route: "/apps",
  //   pages: [
  //     {
  //       sectionTitle: "customers",
  //       route: "/customers",
  //       keenthemesIcon: "abstract-38",
  //       bootstrapIcon: "bi-printer",
  //       sub: [
  //         {
  //           heading: "gettingStarted",
  //           route: "/apps/customers/getting-started",
  //         },
  //         {
  //           heading: "customersListing",
  //           route: "/apps/customers/customers-listing",
  //         },
  //         {
  //           heading: "customerDetails",
  //           route: "/apps/customers/customer-details",
  //         },
  //       ],
  //     },
  //     {
  //       sectionTitle: "subscriptions",
  //       route: "/subscriptions",
  //       keenthemesIcon: "basket",
  //       bootstrapIcon: "bi-cart",
  //       sub: [
  //         {
  //           heading: "getStarted",
  //           route: "/apps/subscriptions/getting-started",
  //         },
  //         {
  //           heading: "subscriptionList",
  //           route: "/apps/subscriptions/subscription-list",
  //         },
  //         {
  //           heading: "addSubscription",
  //           route: "/apps/subscriptions/add-subscription",
  //         },
  //         {
  //           heading: "viewSubscription",
  //           route: "/apps/subscriptions/view-subscription",
  //         },
  //       ],
  //     },
  //     {
  //       heading: "calendarApp",
  //       route: "/apps/calendar",
  //       keenthemesIcon: "calendar-8",
  //       bootstrapIcon: "bi-calendar3-event",
  //     },
  //     {
  //       sectionTitle: "chat",
  //       route: "/chat",
  //       keenthemesIcon: "message-text-2",
  //       bootstrapIcon: "bi-chat-left",
  //       sub: [
  //         {
  //           heading: "privateChat",
  //           route: "/apps/chat/private-chat",
  //         },
  //         {
  //           heading: "groupChat",
  //           route: "/apps/chat/group-chat",
  //         },
  //         {
  //           heading: "drawerChat",
  //           route: "/apps/chat/drawer-chat",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default MainMenuConfig;
