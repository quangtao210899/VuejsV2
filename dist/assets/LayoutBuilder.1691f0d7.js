import{g as T}from"./assets.627312db.js";import{d as M,K as C,L as z,A as b,O as _,x as V,aa as f,R as I,ab as u,_ as S,r as v,i as U,k as e,q as p,p as i,B as a,ac as l,ax as c,I as r,l as k,w as A,F as L,o as P}from"./index.69b36d76.js";import{C as D}from"./CodeHighlighter.b2d3f0b2.js";import{t as B}from"./documentation.5bc44fc8.js";import"./clipboard.b86e1ca9.js";const y="layoutBuilderTabIndex_demo1",N=M({name:"layout-builder",components:{CodeHighlighter:D},setup(){const s=C(),t=z(),d=b("main"),m=b(_.value);return V(()=>{d.value=localStorage.getItem(y)||"main"}),{tabIndex:d,config:f,reset:o=>{o.preventDefault(),localStorage.removeItem(u),window.location.reload()},setActiveTab:o=>{const n=o.target;d.value=n.getAttribute("data-tab-index"),localStorage.setItem(y,d.value)},submit:o=>{o.preventDefault(),t.setLayoutConfigProperty("general.layout",m),localStorage.setItem(u,JSON.stringify(f.value)),window.location.reload()},themeMode:I,themeName:B,layout:_,layoutType:m,onThemeModeChange:o=>{const n=o.target;t.setLayoutConfigProperty("general.mode",n.value),s.setThemeMode(n.value),localStorage.setItem(u,JSON.stringify(f.value))},getAssetPath:T}}}),H={class:"card mb-10"},j={class:"card-body d-flex align-items-center py-8"},F={class:"d-flex h-50px w-50px h-lg-80px w-lg-80px flex-shrink-0 flex-center position-relative align-self-start align-self-lg-center mt-3 mt-lg-0"},W=e("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",class:"text-primary h-75px w-75px h-lg-100px w-lg-100px position-absolute opacity-5"},[e("path",{fill:"currentColor",d:"M10.2,21.23,4.91,18.17a3.58,3.58,0,0,1-1.8-3.11V8.94a3.58,3.58,0,0,1,1.8-3.11L10.2,2.77a3.62,3.62,0,0,1,3.6,0l5.29,3.06a3.58,3.58,0,0,1,1.8,3.11v6.12a3.58,3.58,0,0,1-1.8,3.11L13.8,21.23A3.62,3.62,0,0,1,10.2,21.23Z"})],-1),E=e("div",{class:"ms-6"},[e("p",{class:"list-unstyled text-gray-600 fw-semobold fs-6 p-0 m-0"}," The layout builder is to assist your set and configure your preferred project layout specifications and preview it in real time and export the HTML template with its includable partials of this demo. The downloaded version does not include the assets folder since the layout builder's main purpose is to help to generate the final HTML code without hassle. ")],-1),K={class:"card mb-10"},O={class:"card-header card-header-stretch"},R={class:"nav nav-stretch nav-line-tabs fw-semobold border-0",role:"tablist",id:"kt_layout_builder_tabs",ref:"kt_layout_builder_tabs"},$={class:"nav-item"},G={class:"nav-item"},J={class:"nav-item"},q={class:"nav-item"},Y={class:"card-body"},Z={class:"tab-content pt-3",id:"kt_tabs"},Q={class:"row"},X={class:"col-lg-6 pe-lg-15"},ee={class:"form-group"},se=e("div",{class:"mb-6"},[e("h4",{class:"fw-bold text-dark"},"Theme Mode"),e("div",{class:"fw-semibold text-muted fs-7 d-block lh-1"}," Enjoy Dark & Light modes. ")],-1),oe={class:"row","data-kt-buttons":"true","data-kt-buttons-target":".form-check-image,.form-check-input","data-kt-initialized":"1"},te={class:"col-6"},ae={class:"form-check-wrapper"},ie=["src"],le={class:"form-check form-check-custom form-check-solid form-check-sm form-check-success"},de=["checked"],ce=e("div",{class:"form-check-label text-gray-700"}," Light ",-1),re={class:"col-6"},ne={class:"form-check-wrapper"},me=["src"],he={class:"form-check form-check-custom form-check-solid form-check-sm form-check-success"},fe=["checked"],ue=e("div",{class:"form-check-label text-gray-700"},"Dark",-1),pe=e("div",{class:"separator separator-dashed my-6"},null,-1),ke={class:"form-group"},ge=e("div",{class:"d-flex flex-column mb-4"},[e("h4",{class:"fw-bold text-dark"},"Width Mode"),e("div",{class:"fs-7 fw-semibold text-muted"}," Page width options ")],-1),be={class:"d-flex"},_e={class:"form-check form-check-custom form-check-success form-check-solid form-check-sm me-7"},ve=e("label",{class:"form-check-label text-gray-700 fw-bold text-nowrap",for:"kt_builder_page_width_default"},"Default",-1),ye={class:"form-check form-check-custom form-check-success form-check-solid form-check-sm me-7"},we=e("label",{class:"form-check-label text-gray-700 fw-bold text-nowrap",for:"kt_builder_page_width_fluid"},"Fluid",-1),xe={class:"form-check form-check-custom form-check-success form-check-solid form-check-sm me-7"},Te=e("label",{class:"form-check-label text-gray-700 fw-bold text-nowrap",for:"kt_builder_page_width_fixed"},"Fixed",-1),Me=e("div",{class:"separator separator-dashed my-6"},null,-1),Ce={class:"form-group d-flex flex-stack"},ze=e("div",{class:"d-flex flex-column"},[e("h4",{class:"fw-bold text-dark"},"Keenicons Style"),e("div",null,[e("span",{class:"fs-7 fw-semibold text-muted"},"Select global UI icons style."),r(k(" ")+" "),e("a",{class:"fw-semibold",href:"https://preview.keenthemes.com/html/metronic/docs/icons/keenicons",target:"_blank"},"Learn more")])],-1),Ve={class:"d-flex flex-stack gap-3 mw-lg-600px","data-kt-buttons":"true","data-kt-buttons-target":".form-check-image,.form-check-input","data-kt-initialized":"1"},Ie={class:"form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4"},Se=e("span",{class:"fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700"},"Duotone",-1),Ue={style:{visibility:"hidden",height:"0",width:"0",overflow:"hidden"}},Ae=["checked"],Le=e("div",{class:"form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4"},[e("i",{class:"ki-outline ki-picture fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700"}),e("span",{class:"fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700"},"Outline")],-1),Pe={style:{visibility:"hidden",height:"0",width:"0",overflow:"hidden"}},De=["checked"],Be=e("div",{class:"form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4"},[e("i",{class:"ki-solid ki-picture fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700"}),e("span",{class:"fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700"},"Solid")],-1),Ne={style:{visibility:"hidden",height:"0",width:"0",overflow:"hidden"}},He=["checked"],je=e("div",{class:"separator separator-dashed my-6"},null,-1),Fe={class:"form-group d-flex flex-stack"},We=e("div",{class:"d-flex flex-column"},[e("h4",{class:"fw-bold text-dark"},"Menu Icon"),e("div",{class:"fs-7 fw-semibold text-muted"}," Sidebar menu icon options ")],-1),Ee={class:"d-flex justify-content-end"},Ke={class:"form-check form-check-custom form-check-success form-check-solid me-7","data-bs-toggle":"tooltip","data-kt-initialized":"1"},Oe=e("label",{class:"form-check-label text-gray-700 fw-bold text-nowrap",for:"kt_builder_icon_svg"},"Bootstrap",-1),Re={class:"form-check form-check-custom form-check-success form-check-solid me-7","data-bs-toggle":"tooltip","data-kt-initialized":"1"},$e=e("label",{class:"form-check-label text-gray-700 fw-bold text-nowrap",for:"kt_builder_icon_font"},"Keenthemes",-1),Ge=e("div",{class:"mb-6"},[e("h4",{class:"fw-bold text-dark"},"Layouts"),e("span",{class:"fw-semibold text-muted fs-7 lh-1"},"4 main layout options.")],-1),Je={class:"row gy-5","data-kt-buttons":"true","data-kt-buttons-target":".form-check-image:not(.disabled),.form-check-input:not([disabled])","data-kt-initialized":"1"},qe={class:"col-lg-3"},Ye={class:"form-check-wrapper"},Ze=["src"],Qe={class:"form-check form-check-custom form-check-success form-check-sm form-check-solid"},Xe=e("div",{class:"form-check-label text-gray-800"}," Dark Sidebar ",-1),es={class:"col-lg-3"},ss={class:"form-check-wrapper"},os=["src"],ts={class:"form-check form-check-custom form-check-success form-check-sm form-check-solid"},as=e("div",{class:"form-check-label text-gray-800"}," Light Sidebar ",-1),is={class:"col-lg-3"},ls={class:"form-check-wrapper"},ds=["src"],cs={class:"form-check form-check-custom form-check-success form-check-sm form-check-solid"},rs=e("div",{class:"form-check-label text-gray-800"}," Dark Header ",-1),ns={class:"col-lg-3"},ms={class:"form-check-wrapper"},hs=["src"],fs={class:"form-check form-check-custom form-check-success form-check-sm form-check-solid"},us=e("div",{class:"form-check-label text-gray-800"}," Light Header ",-1),ps={class:"form-group d-flex flex-stack"},ks=e("div",{class:"d-flex flex-column"},[e("h4",{class:"fw-bold text-dark"},"Minimize"),e("div",{class:"fs-7 fw-semibold text-muted"}," Sidebar minimize mode ")],-1),gs={class:"d-flex justify-content-end"},bs={class:"form-check form-check-custom form-check-solid form-check-success form-switch"},_s=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_sidebar_minimize_desktop_enabled","data-bs-toggle":"tooltip","data-kt-initialized":"1"},"Minimize Toggle",-1),vs={class:"form-check form-check-custom form-check-solid form-check-success form-switch ms-10"},ys=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_sidebar_minimize_desktop_hoverable","data-bs-toggle":"tooltip","data-kt-initialized":"1"},"Hoverable",-1),ws={class:"form-check form-check-custom form-check-solid form-check-success form-switch ms-10"},xs=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_sidebar_minimize_desktop_default","data-bs-toggle":"tooltip","data-kt-initialized":"1"},"Default Minimized",-1),Ts={class:"tab-pane active show",id:"kt_builder_header",role:"tabpanel"},Ms={class:"form-group d-flex flex-stack"},Cs=e("div",{class:"d-flex flex-column"},[e("h4",{class:"fw-bold text-dark"},"Fixed"),e("div",{class:"fs-7 fw-semibold text-muted"}," Fixed toolbar mode ")],-1),zs={class:"d-flex justify-content-end"},Vs={class:"form-check form-check-custom form-check-solid form-check-success form-switch me-10"},Is=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_header_fixed_desktop"},"Desktop Mode",-1),Ss={class:"form-check form-check-custom form-check-solid form-check-success form-switch"},Us=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_header_fixed_mobile"},"Mobile Mode",-1),As=e("div",{class:"separator separator-dashed my-6"},null,-1),Ls={class:"form-group d-flex flex-stack"},Ps=e("div",{class:"d-flex flex-column"},[e("h4",{class:"fw-bold text-dark"},"Page Title"),e("div",{class:"fs-7 fw-semibold text-muted"}," Page title layout options ")],-1),Ds={class:"d-flex justify-content-end"},Bs={class:"form-check form-check-custom form-check-solid form-check-success form-check-sm me-10"},Ns=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_page_title_direction_column","data-bs-toggle":"tooltip","data-kt-initialized":"1"},"Column",-1),Hs={class:"form-check form-check-custom form-check-solid form-check-success"},js=e("label",{class:"form-check-label text-gray-700 fw-bold",for:"kt_builder_page_title_direction_row","data-bs-toggle":"tooltip","data-kt-initialized":"1"},"Row",-1),Fs={class:"card-footer py-6"},Ws={class:"row"},Es={class:"col-lg-9"},Ks=e("button",{type:"submit",id:"kt_layout_builder_preview",class:"btn btn-primary me-2"},[e("span",{class:"indicator-label"}," Preview "),e("span",{class:"indicator-progress"},[r(" Please wait... "),e("span",{class:"spinner-border spinner-border-sm align-middle ms-2"})])],-1),Os={class:"card"},Rs={class:"card-body p-10 p-lg-15"},$s=e("h1",{class:"anchor fw-bold mb-5",id:"overview"},"Generated configuration",-1),Gs={class:"py-5"},Js=e("code",null,"src/core/config/DefaultLayoutConfig.ts",-1);function qs(s,t,d,m,w,x){const h=v("KTIcon"),g=v("CodeHighlighter");return P(),U(L,null,[e("div",H,[e("div",j,[e("div",F,[W,p(h,{"icon-name":"wrench","icon-class":"fs-2x fs-lg-3x text-primary position-absolute"})]),E])]),e("div",K,[e("div",O,[e("ul",R,[e("li",$,[e("a",{class:i(["nav-link cursor-pointer",{active:s.tabIndex==="main"}]),"data-bs-toggle":"tab",onClickPassive:t[0]||(t[0]=o=>s.setActiveTab(o)),"data-tab-index":"main",role:"tab"}," Main ",34)]),e("li",G,[e("a",{class:i(["nav-link cursor-pointer",{active:s.tabIndex==="layout"}]),"data-bs-toggle":"tab",onClickPassive:t[1]||(t[1]=o=>s.setActiveTab(o)),"data-tab-index":"layout",role:"tab"}," Layout ",34)]),e("li",J,[e("a",{class:i(["nav-link cursor-pointer",{active:s.tabIndex==="sidebar"}]),"data-bs-toggle":"tab",onClickPassive:t[2]||(t[2]=o=>s.setActiveTab(o)),"data-tab-index":"sidebar",role:"tab"}," Sidebar ",34)]),e("li",q,[e("a",{class:i(["nav-link cursor-pointer",{active:s.tabIndex==="header"}]),"data-bs-toggle":"tab",onClickPassive:t[3]||(t[3]=o=>s.setActiveTab(o)),"data-tab-index":"header",role:"tab"}," Header ",34)])],512)]),e("form",{class:"form",id:"kt_layout_builder_form",onSubmit:t[26]||(t[26]=o=>s.submit(o))},[e("div",Y,[e("div",Z,[e("div",{class:i(["tab-pane",{active:s.tabIndex==="main"}]),id:"kt_builder_main"},[e("div",Q,[e("div",X,[e("div",ee,[se,e("div",oe,[e("div",te,[e("label",{class:i(["form-check-image form-check-success",[s.themeMode==="light"&&"active"]])},[e("div",ae,[e("img",{src:s.getAssetPath("media/misc/layout/demo1-light.png"),class:"mw-100",alt:""},null,8,ie)]),e("div",le,[e("input",{class:"form-check-input",type:"radio",checked:s.themeMode==="light"?void 0:!1,value:"light",name:"theme_mode",onChange:t[4]||(t[4]=(...o)=>s.onThemeModeChange&&s.onThemeModeChange(...o))},null,40,de),ce])],2)]),e("div",re,[e("label",{class:i(["form-check-image form-check-success",[s.themeMode==="dark"&&"active"]])},[e("div",ne,[e("img",{src:s.getAssetPath("media/misc/layout/demo1-dark.png"),class:"mw-100",alt:""},null,8,me)]),e("div",he,[e("input",{class:"form-check-input",type:"radio",checked:s.themeMode==="dark"?void 0:!1,value:"dark",name:"theme_mode",onChange:t[5]||(t[5]=(...o)=>s.onThemeModeChange&&s.onThemeModeChange(...o))},null,40,fe),ue])],2)])])])])]),pe,e("div",ke,[ge,e("div",be,[e("div",_e,[a(e("input",{"onUpdate:modelValue":t[6]||(t[6]=o=>s.config.general.pageWidth=o),class:"form-check-input",type:"radio",value:"default",id:"kt_builder_page_width_default"},null,512),[[l,s.config.general.pageWidth]]),ve]),e("div",ye,[a(e("input",{"onUpdate:modelValue":t[7]||(t[7]=o=>s.config.general.pageWidth=o),class:"form-check-input",type:"radio",value:"fluid",id:"kt_builder_page_width_fluid"},null,512),[[l,s.config.general.pageWidth]]),we]),e("div",xe,[a(e("input",{"onUpdate:modelValue":t[8]||(t[8]=o=>s.config.general.pageWidth=o),class:"form-check-input",type:"radio",value:"fixed",id:"kt_builder_page_width_fixed"},null,512),[[l,s.config.general.pageWidth]]),Te])])]),Me,e("div",Ce,[ze,e("div",Ve,[e("label",{class:i([s.config.general.iconsType==="duotone"&&"active","form-check-image form-check-success w-100 parent-active parent-hover"])},[e("div",Ie,[p(h,{"icon-type":"duotone","icon-name":"picture","icon-class":"fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700"}),Se]),e("div",Ue,[a(e("input",{"onUpdate:modelValue":t[9]||(t[9]=o=>s.config.general.iconsType=o),class:"form-check-input",type:"radio",value:"duotone",checked:s.config.general.iconsType==="duotone"},null,8,Ae),[[l,s.config.general.iconsType]])])],2),e("label",{class:i([s.config.general.iconsType==="outline"&&"active","form-check-image form-check-success w-100 parent-active parent-hover"])},[Le,e("div",Pe,[a(e("input",{"onUpdate:modelValue":t[10]||(t[10]=o=>s.config.general.iconsType=o),class:"form-check-input",type:"radio",value:"outline",name:"outline",checked:s.config.general.iconsType==="outline"},null,8,De),[[l,s.config.general.iconsType]])])],2),e("label",{class:i([s.config.general.iconsType==="solid"&&"active","form-check-image form-check-success w-100 parent-active parent-hover"])},[Be,e("div",Ne,[a(e("input",{"onUpdate:modelValue":t[11]||(t[11]=o=>s.config.general.iconsType=o),class:"form-check-input",type:"radio",value:"solid",name:"solid",checked:s.config.general.iconsType==="solid"},null,8,He),[[l,s.config.general.iconsType]])])],2)])]),je,e("div",Fe,[We,e("div",Ee,[e("div",Ke,[a(e("input",{"onUpdate:modelValue":t[12]||(t[12]=o=>s.config.sidebar.default.menu.iconType=o),class:"form-check-input w-20px h-20px",type:"radio",value:"bootstrap",id:"kt_builder_icon_svg"},null,512),[[l,s.config.sidebar.default.menu.iconType]]),Oe]),e("div",Re,[a(e("input",{"onUpdate:modelValue":t[13]||(t[13]=o=>s.config.sidebar.default.menu.iconType=o),class:"form-check-input w-20px h-20px",type:"radio",value:"keenthemes",id:"kt_builder_icon_font"},null,512),[[l,s.config.sidebar.default.menu.iconType]]),$e])])])],2),e("div",{class:i(["tab-pane",{active:s.tabIndex==="layout"}]),id:"kt_builder_layout"},[Ge,e("div",Je,[e("div",qe,[e("label",{class:i([[s.layoutType==="dark-sidebar"&&"active"],"form-check-image form-check-success"])},[e("div",Ye,[e("img",{src:s.getAssetPath("media/misc/layout/dark-sidebar.png"),class:"mw-100",alt:""},null,8,Ze)]),e("div",Qe,[a(e("input",{"onUpdate:modelValue":t[14]||(t[14]=o=>s.layoutType=o),class:"form-check-input",type:"radio",value:"dark-sidebar",name:"layoutType"},null,512),[[l,s.layoutType]]),Xe])],2)]),e("div",es,[e("label",{class:i([[s.layoutType==="light-sidebar"&&"active"],"form-check-image form-check-success"])},[e("div",ss,[e("img",{src:s.getAssetPath("media/misc/layout/light-sidebar.png"),class:"mw-100",alt:""},null,8,os)]),e("div",ts,[a(e("input",{"onUpdate:modelValue":t[15]||(t[15]=o=>s.layoutType=o),class:"form-check-input",type:"radio",value:"light-sidebar",name:"layoutType"},null,512),[[l,s.layoutType]]),as])],2)]),e("div",is,[e("label",{class:i([[s.layoutType==="dark-header"&&"active"],"form-check-image form-check-success"])},[e("div",ls,[e("img",{src:s.getAssetPath("media/misc/layout/dark-header.png"),class:"mw-100",alt:""},null,8,ds)]),e("div",cs,[a(e("input",{"onUpdate:modelValue":t[16]||(t[16]=o=>s.layoutType=o),class:"form-check-input",type:"radio",value:"dark-header",name:"layoutType"},null,512),[[l,s.layoutType]]),rs])],2)]),e("div",ns,[e("label",{class:i([[s.layoutType==="light-header"&&"active"],"form-check-image form-check-success"])},[e("div",ms,[e("img",{src:s.getAssetPath("media/misc/layout/light-header.png"),class:"mw-100",alt:""},null,8,hs)]),e("div",fs,[a(e("input",{"onUpdate:modelValue":t[17]||(t[17]=o=>s.layoutType=o),class:"form-check-input",type:"radio",value:"light-header",name:"layoutType"},null,512),[[l,s.layoutType]]),us])],2)])])],2),e("div",{class:i(["tab-pane",{active:s.tabIndex==="sidebar"}]),id:"kt_builder_sidebar"},[e("div",ps,[ks,e("div",gs,[e("div",bs,[a(e("input",{"onUpdate:modelValue":t[18]||(t[18]=o=>s.config.sidebar.default.minimize.desktop.enabled=o),class:"form-check-input w-45px h-30px",type:"checkbox",value:"true",id:"kt_builder_sidebar_minimize_desktop_enabled"},null,512),[[c,s.config.sidebar.default.minimize.desktop.enabled]]),_s]),e("div",vs,[a(e("input",{"onUpdate:modelValue":t[19]||(t[19]=o=>s.config.sidebar.default.minimize.desktop.hoverable=o),class:"form-check-input w-45px h-30px",type:"checkbox",value:"true",id:"kt_builder_sidebar_minimize_desktop_hoverable"},null,512),[[c,s.config.sidebar.default.minimize.desktop.hoverable]]),ys]),e("div",ws,[a(e("input",{"onUpdate:modelValue":t[20]||(t[20]=o=>s.config.sidebar.default.minimize.desktop.default=o),class:"form-check-input w-45px h-30px",type:"checkbox",value:"true",id:"kt_builder_sidebar_minimize_desktop_default"},null,512),[[c,s.config.sidebar.default.minimize.desktop.default]]),xs])])])],2),e("div",{class:i(["tab-pane",{active:s.tabIndex==="header"}]),id:"kt_builder_header"},[e("div",Ts,[e("div",Ms,[Cs,e("div",zs,[e("div",Vs,[a(e("input",{"onUpdate:modelValue":t[21]||(t[21]=o=>s.config.header.default.fixed.desktop=o),class:"form-check-input w-45px h-30px",type:"checkbox",value:"true",id:"kt_builder_header_fixed_desktop"},null,512),[[c,s.config.header.default.fixed.desktop]]),Is]),e("div",Ss,[a(e("input",{"onUpdate:modelValue":t[22]||(t[22]=o=>s.config.header.default.fixed.mobile=o),class:"form-check-input w-45px h-30px",type:"checkbox",value:"true",id:"kt_builder_header_fixed_mobile"},null,512),[[c,s.config.header.default.fixed.mobile]]),Us])])]),As,e("div",Ls,[Ps,e("div",Ds,[e("div",Bs,[a(e("input",{"onUpdate:modelValue":t[23]||(t[23]=o=>s.config.pageTitle.direction=o),class:"form-check-input",type:"radio",value:"column",id:"kt_builder_page_title_direction_column"},null,512),[[l,s.config.pageTitle.direction]]),Ns]),e("div",Hs,[a(e("input",{"onUpdate:modelValue":t[24]||(t[24]=o=>s.config.pageTitle.direction=o),class:"form-check-input",type:"radio",value:"row",id:"kt_builder_page_title_direction_row"},null,512),[[l,s.config.pageTitle.direction]]),js])])])])],2)])]),e("div",Fs,[e("div",Ws,[e("div",Es,[Ks,e("button",{onClickPassive:t[25]||(t[25]=o=>s.reset(o)),type:"button",id:"kt_layout_builder_reset",class:"btn btn-active-light btn-color-muted fw-semobold"}," Reset ",32)])])])],32)]),e("div",Os,[e("div",Rs,[$s,e("div",Gs,[r(" This config is used as a "),e("b",null,k(s.themeName),1),r(" layout config, you can update default values inside file "),Js]),p(g,{lang:"json"},{default:A(()=>[r(k(s.config),1)]),_:1})])])],64)}const so=S(N,[["render",qs]]);export{so as default};
