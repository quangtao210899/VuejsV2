import{d as z,a7 as H,a6 as K,au as J,A as u,av as Z,aC as G,af as Q,x as W,aw as T,_ as X,r as V,i as l,k as s,l as w,q as i,I as _,B as Y,C as ss,p as k,n as x,w as es,F as v,J as ts,o as d,j}from"./index.69b36d76.js";import{S as as}from"./sweetalert2.242d9dda.js";import{F as os}from"./filterGroup.a9a017fe.js";import{C as ns}from"./CodeHighlighter.b2d3f0b2.js";import{c as is,a as N,e as rs}from"./array.8e0a81f2.js";import"./vue-debounce.min.43c24b86.js";import"./documentation.5bc44fc8.js";import"./clipboard.b86e1ca9.js";const ls=z({name:"kt-profile",components:{ErrorMessage:H,Field:K,VForm:J,Fillter:os,CodeHighlighter:ns},setup(){const e=u(!1),o={username:"",first_name:"",is_admin:""},g=u({...o}),h=u({...o}),m=u({confirmpassword:"",currentpassword:"",newpassword:""}),E=Z({confirmpassword:"",currentpassword:"",newpassword:""}),r=()=>(e.value=!0,setTimeout(()=>e.value=!1,500),T.get("/account").then(({data:t})=>{g.value={username:t.username,first_name:t.first_name,is_admin:t.is_admin},h.value={username:t.username,first_name:t.first_name,is_admin:t.is_admin}}).catch(({response:t})=>{p(t.data.detail,"error","C\xF3 l\u1ED7i x\u1EA3y ra")})),p=(t,y,n)=>{as.fire({text:t!=null?t:n,icon:y,buttonsStyling:!1,confirmButtonText:"Ok, got it!",heightAuto:!1,customClass:{confirmButton:"btn btn-primary"}}).then(()=>{})},f=u({first_name:""}),b=G.exports.useToast(),A=()=>{if(f.value.first_name="",e.value=!0,setTimeout(()=>{e.value=!1},1e3),h.value.first_name!==g.value.first_name&&h.value.first_name)a();else return b.warning("B\u1EA1n ch\u01B0a c\xF3 thay \u0111\u1ED5i g\xEC!",{position:"top-right"})},D=()=>(f.value.first_name="",e.value=!0,setTimeout(()=>{e.value=!1},1e3),h.value.first_name!==g.value.first_name?(h.value={...g.value},b.info("\u0110\xE3 kh\xF4i ph\u1EE5c l\u1EA1i t\xEAn!",{position:"top-right"})):b.warning("B\u1EA1n ch\u01B0a c\xF3 thay \u0111\u1ED5i g\xEC!",{position:"top-right"})),a=async()=>T.post("/account/update",{first_name:h.value.first_name}).then(({data:t})=>{p(t.detail,"success","C\u1EADp nh\u1EADt th\xE0nh c\xF4ng"),r()}).catch(({response:t})=>{t.data?(f.value.first_name=t.data.first_name,b.error(t.data.first_name,{position:"top-right"})):p(t.data.detail,"error","C\xF3 l\u1ED7i x\u1EA3y ra")}),c=u(null),q=is().shape({currentpassword:N().required("Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u c\u0169").label("M\u1EADt kh\u1EA9u c\u0169"),newpassword:N().min(8,"M\u1EADt kh\u1EA9u t\u1ED1i thi\u1EC3u 8 k\xED t\u1EF1").required("Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi").label("M\u1EADt kh\u1EA9u n\u1EDBi"),confirmpassword:N().min(8,"M\u1EADt kh\u1EA9u t\u1ED1i thi\u1EC3u 8 k\xED t\u1EF1").required("Vui l\xF2ng nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi").oneOf([rs("newpassword"),null],"M\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp v\u1EDBi m\u1EADt kh\u1EA9u m\u1EDBi").label("Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u")}),O=async t=>{if(c.value){c.value.setAttribute("data-kt-indicator","on"),e.value=!0,setTimeout(()=>{var n;(n=c.value)==null||n.removeAttribute("data-kt-indicator"),e.value=!1},1e3);let y={password:t.currentpassword,new_password:t.newpassword,re_new_password:t.confirmpassword};return T.post("/account/change-password",y).then(({data:n})=>{p(n.detail,"success","C\u1EADp nh\u1EADt m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng"),r(),U()}).catch(({response:n})=>{var P,F,B;n.data?(m.value.currentpassword=(P=n.data.password)!=null?P:"",m.value.newpassword=(F=n.data.new_password)!=null?F:"",m.value.confirmpassword=(B=n.data.re_new_password)!=null?B:"",b.error(n.data.detail,{position:"top-right"}),console.log(m.value)):p(n.data.detail,"error","C\xF3 l\u1ED7i x\u1EA3y ra")})}},C=u(null),U=()=>{m.value.currentpassword="",m.value.newpassword="",m.value.confirmpassword="",E.currentpassword="",E.newpassword="",E.confirmpassword="",R.value=0,C.value!=null&&(console.log(C.value),C.value.click())},M=u(!1),L=()=>{M.value=!M.value},S=u(!1),I=()=>{S.value=!S.value},R=u(0);Q(()=>E.newpassword,t=>{$(t)});const $=t=>{const y=/[a-z]/.test(t),n=/[A-Z]/.test(t),P=/\d/.test(t),F=/[!@#$%^&*()]/.test(t),B=Math.round(((y?1:0)+(n?1:0)+(P?1:0)+(F?1:0))/4*100);return R.value=B};return W(()=>{r()}),{getData:r,list:g,handleClick:A,upadateAccount:a,errors:f,editData:h,handleReset:D,loading:e,updatePassword:O,changePassword:q,updatePasswordButton:c,erroPasswordChange:m,discardButtonRef:C,resetForm:U,eyePassword:L,eyeButtonRef:M,dataPasswordChange:E,eyeButtonRef2:S,eyePassword2:I,checkStringValidity:$,percentagePassword:R}}}),ds={class:"card mb-5 mb-xxl-8"},cs={class:"card-body pt-9 pb-0"},us={class:"d-flex flex-wrap flex-sm-nowrap mb-3"},ms=s("div",{class:"me-7 mb-4"},[s("div",{class:"symbol symbol-80px symbol-lg-100px symbol-fixed position-relative"},[s("img",{class:"object-fit-cover",src:"https://i.mydramalist.com/66L5p_5f.jpg",alt:"image"}),s("div",{class:"position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"})])],-1),ps={class:"flex-grow-1"},hs={class:"d-flex justify-content-between align-items-start flex-wrap mb-2"},fs={class:"d-flex flex-column"},_s={class:"d-flex align-items-center mb-2"},bs={href:"#",class:"text-gray-800 text-hover-primary fs-2 fw-bold me-1"},ws={href:"#"},vs={class:"d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2"},gs={href:"#",class:"d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"},Es={href:"#",class:"d-flex align-items-center text-gray-400 text-hover-primary mb-2"},ys=s("div",{class:"d-flex my-4"},[s("div",{class:"me-0"},[s("button",{class:"btn btn-sm btn-icon btn-bg-light btn-active-color-primary","data-kt-menu-trigger":"click","data-kt-menu-placement":"bottom-end","data-kt-menu-flip":"top-end"},[s("i",{class:"bi bi-three-dots fs-3"})])])],-1),ks=ts('<div class="d-flex overflow-auto h-55px"><ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"><li class="nav-item"><a class="nav-link text-active-primary pb-4 active" data-bs-toggle="tab" href="#kt_customer_view_overview_tab">B\u1EA3o m\u1EADt</a></li><li class="nav-item"><a class="nav-link text-active-primary me-6" data-bs-toggle="tab" href="#kt_password_tab">\u0110\u1ED5i m\u1EADt kh\u1EA9u</a></li></ul></div>',1),xs={class:"tab-content",id:"myTabContent"},As={class:"tab-pane fade show active",id:"kt_customer_view_overview_tab",role:"tabpanel"},Ds={class:"card pt-4 mb-6 mb-xl-9"},Cs=s("div",{class:"card-header border-0"},[s("div",{class:"card-title"},[s("h2",null,"Profile")])],-1),Ps={class:"card-body pt-0 pb-5"},Fs={class:"table-responsive"},Bs={class:"table align-middle table-row-dashed gy-5",id:"kt_table_users_login_session"},Vs={class:"fs-6 fw-semibold text-gray-600"},Ms=s("td",null,"Username",-1),Ss={class:"ms-4"},Rs={class:"text-end"},Ts=s("td",null,"H\u1ECD t\xEAn",-1),js=s("td",{class:"text-end"},[s("i",{class:"ki-duotone ki-pencil fs-3 me-2"},[s("span",{class:"path1"}),s("span",{class:"path2"})])],-1),Ns={class:"w-100 text-end"},Us=["disabled"],$s=["disabled","data-kt-indicator"],qs={key:0,class:"indicator-label"},Os={key:1,class:"indicator-progress"},Ls=s("span",{class:"spinner-border spinner-border-sm align-middle ms-2"},null,-1),Is={class:"tab-pane fade",id:"kt_password_tab",role:"tabpanel"},zs={class:"card pt-4 mb-6 mb-xl-9"},Hs={class:"modal-body scroll-y mx-5 mx-xl-15 my-7"},Ks={class:"fv-row mb-10 fv-plugins-icon-container"},Js=s("label",{class:"required form-label fs-6 mb-2"},"M\u1EADt kh\u1EA9u c\u0169",-1),Zs={class:"fv-plugins-message-container"},Gs={class:"fv-help-block"},Qs=s("br",null,null,-1),Ws={key:0},Xs=s("br",null,null,-1),Ys={class:"mb-10 fv-row fv-plugins-icon-container","data-kt-password-meter":"true"},se={class:"mb-1"},ee=s("label",{class:"form-label fw-semibold fs-6 mb-2"}," M\u1EADt kh\u1EA9u m\u1EDBi ",-1),te={class:"position-relative mb-3"},ae={class:"btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"},oe={class:"d-flex align-items-center mb-3","data-kt-password-meter-control":"highlight"},ne=s("div",{class:"text-muted"}," S\u1EED d\u1EE5ng 8 k\xFD t\u1EF1 tr\u1EDF l\xEAn v\u1EDBi s\u1EF1 k\u1EBFt h\u1EE3p c\u1EE7a c\xE1c ch\u1EEF c\xE1i, s\u1ED1 & k\xFD hi\u1EC7u.",-1),ie={class:"fv-plugins-message-container"},re={class:"fv-help-block"},le={key:0},de=s("br",null,null,-1),ce=s("br",null,null,-1),ue=s("div",{class:"fv-plugins-message-container invalid-feedback"},null,-1),me={class:"fv-row mb-10 fv-plugins-icon-container"},pe=s("label",{class:"form-label fw-semibold fs-6 mb-2"},"Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u",-1),he={class:"position-relative mb-3"},fe={class:"btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"},_e={class:"fv-plugins-message-container"},be={class:"fv-help-block"},we=s("br",null,null,-1),ve={key:0},ge=s("br",null,null,-1),Ee={class:"d-flex"},ye=["disabled"],ke=s("span",{class:"indicator-label"}," Update Password ",-1),xe=s("span",{class:"indicator-progress"},[_(" Please wait... "),s("span",{class:"spinner-border spinner-border-sm align-middle ms-2"})],-1),Ae=[ke,xe];function De(e,o,g,h,m,E){var A,D;const r=V("KTIcon"),p=V("Field"),f=V("ErrorMessage"),b=V("VForm");return d(),l(v,null,[s("div",ds,[s("div",cs,[s("div",us,[ms,s("div",ps,[s("div",hs,[s("div",fs,[s("div",_s,[s("a",bs,w((A=e.list.first_name)!=null?A:"--"),1),s("a",ws,[i(r,{"icon-name":"verify","icon-class":"fs-1 text-primary"})])]),s("div",vs,[s("a",gs,[i(r,{"icon-name":"profile-circle","icon-class":"fs-4 me-1"}),_(" "+w(e.list.is_admin?"Admin":"User"),1)]),s("a",Es,[i(r,{"icon-name":"sms","icon-class":"fs-4 me-1"}),_(" "+w((D=e.list.username)!=null?D:"--"),1)])])]),ys])])]),ks])]),s("div",xs,[s("div",As,[s("div",null,[s("div",Ds,[Cs,s("div",Ps,[s("div",Fs,[s("table",Bs,[s("tbody",Vs,[s("tr",null,[Ms,s("td",null,[s("span",Ss,w(e.editData.username),1)]),s("td",Rs,[i(r,{class:"fs-3 me-2","icon-name":"cross-square","icon-class":"fs-2"})])]),s("tr",null,[Ts,s("td",null,[Y(s("input",{"onUpdate:modelValue":o[0]||(o[0]=a=>e.editData.first_name=a),type:"text",class:k([Object.keys(e.errors.first_name).length==0?"text-hover-primary":"text-danger","form-control form-control-flush"]),onActive:a=>123,placeholder:"Example input"},null,34),[[ss,e.editData.first_name]])]),js])])]),s("div",Ns,[s("button",{onClick:o[1]||(o[1]=(...a)=>e.handleReset&&e.handleReset(...a)),disabled:e.loading,class:"btn btn-sm btn-light me-3"}," Reset ",8,Us),s("button",{onClick:o[2]||(o[2]=(...a)=>e.handleClick&&e.handleClick(...a)),disabled:e.loading,"data-kt-indicator":e.loading?"on":null,class:"btn btn-sm btn-primary",type:"submit"},[e.loading?x("",!0):(d(),l("span",qs,[_(" Submit "),i(r,{"icon-name":"arrow-right","icon-class":"fs-3 ms-2 me-0"})])),e.loading?(d(),l("span",Os,[_(" Please wait... "),Ls])):x("",!0)],8,$s)])])])])])]),s("div",Is,[s("div",null,[s("div",zs,[s("div",Hs,[i(b,{class:"form w-100 fv-plugins-bootstrap5 fv-plugins-framework",onSubmit:e.updatePassword,id:"kt_login_password_reset_form","validation-schema":e.changePassword},{default:es(()=>[s("div",Ks,[Js,i(p,{type:"password",class:"form-control form-control-solid h-35px",placeholder:"",name:"currentpassword",autocomplete:"off",id:"currentpassword",modelValue:e.dataPasswordChange.currentpassword,"onUpdate:modelValue":o[3]||(o[3]=a=>e.dataPasswordChange.currentpassword=a)},null,8,["modelValue"]),s("div",Zs,[s("div",Gs,[i(f,{name:"currentpassword"}),Qs,Object.keys(e.erroPasswordChange.currentpassword).length!==0?(d(),l("span",Ws,[(d(!0),l(v,null,j(e.erroPasswordChange.currentpassword,(a,c)=>(d(),l(v,{key:c},[_(w(a),1),Xs],64))),128))])):x("",!0)])])]),s("div",Ys,[s("div",se,[ee,s("div",te,[i(p,{type:e.eyeButtonRef?"text":"password",class:"form-control form-control-solid h-35px",name:"newpassword",id:"newpassword",modelValue:e.dataPasswordChange.newpassword,"onUpdate:modelValue":o[4]||(o[4]=a=>e.dataPasswordChange.newpassword=a)},null,8,["type","modelValue"]),s("span",ae,[i(r,{"icon-name":e.eyeButtonRef?"eye":"eye-slash","icon-class":"fs-2",onClick:e.eyePassword},null,8,["icon-name","onClick"])])]),s("div",oe,[s("div",{class:k(["flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2",e.percentagePassword>=25?"active":""])},null,2),s("div",{class:k(["flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2",e.percentagePassword>=50?"active":""])},null,2),s("div",{class:k(["flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2",e.percentagePassword>=75?"active":""])},null,2),s("div",{class:k(["flex-grow-1 bg-secondary bg-active-success rounded h-5px",e.percentagePassword==100?"active":""])},null,2)])]),ne,s("div",ie,[s("div",re,[i(f,{name:"newpassword"}),Object.keys(e.erroPasswordChange.newpassword).length!==0?(d(),l("span",le,[de,(d(!0),l(v,null,j(e.erroPasswordChange.newpassword,(a,c)=>(d(),l(v,{key:c},[_(w(a),1),ce],64))),128))])):x("",!0)])]),ue]),s("div",me,[pe,s("div",he,[i(p,{type:e.eyeButtonRef2?"text":"password",class:"form-control form-control-solid h-35px",name:"confirmpassword",id:"confirmpassword",modelValue:e.dataPasswordChange.confirmpassword,"onUpdate:modelValue":o[5]||(o[5]=a=>e.dataPasswordChange.confirmpassword=a)},null,8,["type","modelValue"]),s("span",fe,[i(r,{"icon-name":e.eyeButtonRef2?"eye":"eye-slash","icon-class":"fs-2",onClick:e.eyePassword2},null,8,["icon-name","onClick"])])]),s("div",_e,[s("div",be,[i(f,{name:"confirmpassword"}),we,Object.keys(e.erroPasswordChange.confirmpassword).length!==0?(d(),l("span",ve,[(d(!0),l(v,null,j(e.erroPasswordChange.confirmpassword,(a,c)=>(d(),l(v,{key:c},[_(w(a),1),ge],64))),128))])):x("",!0)])])]),s("div",Ee,[s("button",{disabled:e.loading,id:"kt_password_submit",type:"submit",ref:"updatePasswordButton",class:"btn btn-primary me-2 px-6 btn-sm"},Ae,8,ye)])]),_:1},8,["onSubmit","validation-schema"])])])])])])],64)}const Te=X(ls,[["render",De]]);export{Te as default};
