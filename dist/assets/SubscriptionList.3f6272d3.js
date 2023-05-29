import{g as f}from"./assets.627312db.js";import{D}from"./KTDataTable.c389d200.js";import{a as y}from"./index.30a6773f.js";import{d as S,A as p,_ as A,r as b,i as g,k as e,q as i,I as n,w as o,l as r,o as _,p as w}from"./index.69b36d76.js";const C=S({name:"kt-subscription-list",components:{KTDatatable:D},setup(){const t=p([{id:1,customer:"Emma Smith",status:"Active",color:"success",billing:"Auto-debit",product:"Basic",createdDate:"Oct 25, 2021"},{id:2,customer:"Melody Macy",status:"Active",color:"success",billing:"Manual - Credit Card",product:"Basic",createdDate:"Mar 10, 2021"},{id:3,customer:"Max Smith",status:"Active",color:"primary",billing:"Manual - Cash",product:"Teams Bundle",createdDate:"Jul 25, 2021"},{id:4,customer:"Sean Bean",status:"Expiring",color:"warning",billing:"Manual - Paypal",product:"Enterprise",createdDate:"Aug 19, 2021"},{id:5,customer:"Brian Cox",status:"Expiring",color:"warning",billing:"Auto-debit",product:"Basic",createdDate:"May 05, 2021"},{id:6,customer:"Mikaela Collins",status:"Active",color:"success",billing:"Auto-debit",product:"Enterprise Bundle",createdDate:"Aug 19, 2021"},{id:7,customer:"Francis Mitcham",status:"Active",color:"success",billing:"Auto-debit",product:"Teams",createdDate:"Jun 20, 2021"},{id:8,customer:"Olivia Wild",status:"Suspended",color:"danger",billing:"--",product:"Enterprise",createdDate:"Jun 24, 2021"},{id:9,customer:"Neil Owen",status:"Expiring",color:"warning",billing:"Auto-debit",product:"Basic",createdDate:"Aug 19, 2021"},{id:10,customer:"Dan Wilson",status:"Active",color:"success",billing:"Auto-debit",product:"Enterprise Bundle",createdDate:"Feb 21, 2021"},{id:11,customer:"Emma Bold",status:"Active",color:"success",billing:"Manual - Credit Card",product:"Enterprise",createdDate:"May 05, 2021"},{id:12,customer:"Ana Crown",status:"Active",color:"success",billing:"Manual - Credit Card",product:"Basic",createdDate:"Jun 24, 2021"},{id:13,customer:"Robert Doe",status:"Suspended",color:"danger",billing:"--",product:"Teams Bundle",createdDate:"Jul 25, 2021"},{id:14,customer:"John Miller",status:"Active",color:"success",billing:"Manual - Paypal",product:"Enterprise",createdDate:"Sep 22, 2021"},{id:15,customer:"Lucy Kunic",status:"Active",color:"success",billing:"Manual - Credit Card",product:"Basic",createdDate:"Nov 10, 2021"},{id:16,customer:"Neil Owen",status:"Suspended",color:"danger",billing:"--",product:"Basic Bundle",createdDate:"Jun 20, 2021"},{id:17,customer:"Dan Wilson",status:"Expiring",color:"warning",billing:"Manual - Paypal",product:"Enterprise",createdDate:"May 05, 2021"},{id:18,customer:"Emma Smith",status:"Active",color:"success",billing:"Auto-debit",product:"Teams",createdDate:"Apr 15, 2021"},{id:19,customer:"Melody Macy",status:"Active",color:"success",billing:"Manual - Credit Card",product:"Basic",createdDate:"Oct 25, 2021"},{id:20,customer:"Max Smith",status:"Suspended",color:"danger",billing:"--",product:"Basic Bundle",createdDate:"Feb 21, 2021"}]),u=p([{columnName:"Customer",columnLabel:"customer",sortEnabled:!0},{columnName:"Status",columnLabel:"status",sortEnabled:!0},{columnName:"Billing",columnLabel:"billing",sortEnabled:!0},{columnName:"Product",columnLabel:"product",sortEnabled:!0},{columnName:"Created Date",columnLabel:"createdDate",sortEnabled:!0},{columnName:"Actions",columnLabel:"actions"}]),l=p([]),h=()=>{l.value.forEach(s=>{m(s)}),l.value.length=0},m=s=>{for(let c=0;c<t.value.length;c++)t.value[c].id===s&&t.value.splice(c,1)};return{data:t,headerConfig:u,sort:s=>{const c=s.order==="asc";s.label&&y(t.value,s.label,{reverse:c})},onItemSelect:s=>{l.value=s},selectedIds:l,deleteFewSubscriptions:h,deleteSubscription:m,getAssetPath:f}}}),k={class:"card"},x={class:"card-header border-0 pt-6"},B={class:"card-title"},E={class:"d-flex align-items-center position-relative my-1"},M=e("input",{type:"text","data-kt-subscription-table-filter":"search",class:"form-control form-control-solid w-250px ps-14",placeholder:"Search Subscriptions"},null,-1),N={class:"card-toolbar"},I={key:0,class:"d-flex justify-content-end","data-kt-subscription-table-toolbar":"base"},T={type:"button",class:"btn btn-light-primary me-3","data-bs-toggle":"modal","data-bs-target":"#kt_subscriptions_export_modal"},O={key:1,class:"d-flex justify-content-end align-items-center"},L={class:"fw-bold me-5"},P={class:"me-2"},J={class:"card-body pt-0"},$={href:"#",class:"text-gray-600 text-hover-primary mb-1"},K={class:"badge badge-light"},F={href:"#",class:"btn btn-sm btn-light btn-active-light-primary","data-kt-menu-trigger":"click","data-kt-menu-placement":"bottom-end","data-kt-menu-flip":"top-end"},V={class:"menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold fs-7 w-125px py-4","data-kt-menu":"true"},W={class:"menu-item px-3"},j={class:"menu-item px-3"},q=["onClickPassive"];function z(t,u,l,h,m,v){const d=b("KTIcon"),s=b("router-link"),c=b("KTDatatable");return _(),g("div",k,[e("div",x,[e("div",B,[e("div",E,[i(d,{"icon-name":"magnifier","icon-class":"fs-1 position-absolute ms-6"}),M])]),e("div",N,[t.selectedIds.length===0?(_(),g("div",I,[e("button",T,[i(d,{"icon-name":"exit-up","icon-class":"fs-2"}),n(" Export ")]),i(s,{to:"/apps/subscriptions/add-subscription",class:"btn btn-primary"},{default:o(()=>[i(d,{"icon-name":"plus","icon-class":"fs-2"}),n(" Add Subscription ")]),_:1})])):(_(),g("div",O,[e("div",L,[e("span",P,r(t.selectedIds.length),1),n("Selected ")]),e("button",{type:"button",class:"btn btn-danger",onClickPassive:u[0]||(u[0]=a=>t.deleteFewSubscriptions())}," Delete Selected ",32)]))])]),e("div",J,[i(c,{onOnSort:t.sort,onOnItemsSelect:t.onItemSelect,data:t.data,header:t.headerConfig,"checkbox-enabled":!0},{customer:o(({row:a})=>[i(s,{to:"/apps/subscriptions/view-subscription",class:"text-gray-800 text-hover-primary mb-1"},{default:o(()=>[n(r(a.customer),1)]),_:2},1024)]),status:o(({row:a})=>[e("a",$,[e("div",{class:w(`badge badge-light-${a.color}`)},r(a.status),3)])]),billing:o(({row:a})=>[e("div",K,r(a.billing),1)]),product:o(({row:a})=>[n(r(a.product),1)]),createdDate:o(({row:a})=>[n(r(a.createdDate),1)]),actions:o(({row:a})=>[e("a",F,[n("Actions "),i(d,{"icon-name":"down","icon-class":"fs-5 m-0"})]),e("div",V,[e("div",W,[i(s,{to:"/apps/customers/customer-details",class:"menu-link px-3"},{default:o(()=>[n("View")]),_:1})]),e("div",j,[e("a",{onClickPassive:R=>t.deleteSubscription(a.id),class:"menu-link px-3"},"Delete",40,q)])])]),_:1},8,["onOnSort","onOnItemsSelect","data","header"])])])}const X=A(C,[["render",z]]);export{X as default};
