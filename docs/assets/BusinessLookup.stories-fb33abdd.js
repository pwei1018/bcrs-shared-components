var g=Object.defineProperty;var _=(o,s,e)=>s in o?g(o,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[s]=e;var a=(o,s,e)=>(_(o,typeof s!="symbol"?s+"":s,e),e);import{V as L}from"./vue.esm-b1e57a2f.js";import{C as y,P as i,E as m}from"./Prop-817ec8de.js";import{W as f}from"./Watch-c62128e4.js";import{l as k}from"./lodash-f6b38868.js";import{n as N}from"./_plugin-vue2_normalizer-2bbd088e.js";import"./_commonjsHelpers-de833af9.js";var S=Object.defineProperty,E=Object.getOwnPropertyDescriptor,r=(o,s,e,t)=>{for(var u=t>1?void 0:t?E(s,e):s,p=o.length-1,c;p>=0;p--)(c=o[p])&&(u=(t?c(s,e,u):c(u))||u);return t&&u&&S(s,e,u),u},B=(o=>(o.INITIAL="initial",o.SEARCHING="searching",o.SHOW_RESULTS="show results",o.NO_RESULTS="no results",o.SUMMARY="summary",o))(B||{});let n=class extends L{constructor(){super(...arguments);a(this,"showErrors");a(this,"businessLookup");a(this,"BusinessLookupServices");a(this,"hasBusinessLookupChanges");a(this,"editableBusinessName");a(this,"searchStatus");a(this,"label");a(this,"hint");a(this,"placeholder");a(this,"legalTypes");a(this,"States",B);a(this,"state","initial");a(this,"searchResults",[]);a(this,"selectedBusiness",null);a(this,"businessLookupRules",[e=>!!e||"Business is required"]);a(this,"businessNameRules",[e=>!!(e!=null&&e.trim())||"Business or corporation name is required",e=>(e==null?void 0:e.length)<=150||"Cannot exceed 150 characters"]);a(this,"onSearchInputDebounced",k.debounce(async(e,t)=>{(t==null?void 0:t.length)>2?(e.state="searching",e.searchResults=await e.BusinessLookupServices.search(t,e.searchStatus,e.legalTypes).catch(()=>[]),e.state=e.searchResults.length>0?"show results":"no results"):(e.searchResults=[],e.state="initial")},600))}get identifier(){return this.businessLookup.identifier}get businessName(){return this.businessLookup.name}get businessNumber(){return this.businessLookup.bn||""}get haveBusiness(){return!!this.identifier&&(!!this.businessName||this.editableBusinessName)}get isFormValid(){return this.haveBusiness&&this.state==="summary"}setBusinessName(e){const t=e==null?void 0:e.trim();this.onSelectedBusiness({...this.businessLookup,name:t})}onSearchInput(e){this.onSearchInputDebounced(this,e)}onSelectedBusiness(e){e&&(this.setBusiness(e),this.selectedBusiness=null)}onHaveBusinessChanged(e){this.state=e?"summary":"initial"}onIsFormValidChanged(e){this.emitValid(e)}setBusiness(e){}emitUndo(){}emitValid(e){}};r([i({required:!0})],n.prototype,"showErrors",2);r([i({required:!0})],n.prototype,"businessLookup",2);r([i({required:!0})],n.prototype,"BusinessLookupServices",2);r([i({default:!1})],n.prototype,"hasBusinessLookupChanges",2);r([i({default:!1})],n.prototype,"editableBusinessName",2);r([i({default:"ACTIVE"})],n.prototype,"searchStatus",2);r([i({default:"Business or Corporation Name or Incorporation Number"})],n.prototype,"label",2);r([i({default:null})],n.prototype,"hint",2);r([i({default:null})],n.prototype,"placeholder",2);r([i({default:"A,BC,BEN,C,CBEN,CC,CCC,CP,CUL,FI,GP,LL,LLC,LP,PA,S,SP,ULC,XCP,XL,XP,XS"})],n.prototype,"legalTypes",2);r([f("selectedBusiness")],n.prototype,"onSelectedBusiness",1);r([f("haveBusiness",{immediate:!0})],n.prototype,"onHaveBusinessChanged",1);r([f("isFormValid")],n.prototype,"onIsFormValidChanged",1);r([m("setBusiness")],n.prototype,"setBusiness",1);r([m("undoBusiness")],n.prototype,"emitUndo",1);r([m("valid")],n.prototype,"emitValid",1);n=r([y({})],n);var P=function(){var s=this,e=s._self._c;return s._self._setupProxy,e("div",{attrs:{id:"business-lookup"}},[s.state!==s.States.SUMMARY?e("div",[e("v-autocomplete",{attrs:{autofocus:"",filled:"","no-filter":"","append-icon":"","return-object":"",autocomplete:"chrome-off","menu-props":"{ maxHeight: 380 }","item-text":"identifier",label:s.label,hint:s.hint,placeholder:s.placeholder,name:Math.random(),rules:s.showErrors?s.businessLookupRules:[],items:s.searchResults,loading:s.state==s.States.SEARCHING,"hide-no-data":s.state!=s.States.NO_RESULTS},on:{"update:search-input":function(t){return s.onSearchInput(t)}},scopedSlots:s._u([{key:"selection",fn:function(){},proxy:!0},{key:"no-data",fn:function(){return[e("v-list-item",[e("div",[s._v("No matches found.")])])]},proxy:!0},{key:"item",fn:function({item:t}){return[e("v-row",{staticClass:"business-lookup-result pt-1"},[e("v-col",{attrs:{cols:"2"}},[e("div",{staticClass:"result-identifier"},[s._v(" "+s._s(t.identifier)+" ")])]),e("v-col",{attrs:{cols:"10"}},[e("div",{staticClass:"result-name"},[s._v(" "+s._s(t.name)+" ")]),e("div",{staticClass:"result-bn"},[s._v(" "+s._s(t.bn)+" ")])])],1)]}}],null,!1,2512664218),model:{value:s.selectedBusiness,callback:function(t){s.selectedBusiness=t},expression:"selectedBusiness"}})],1):s._e(),s.state===s.States.SUMMARY&&s.haveBusiness?e("div",{staticClass:"summary-block"},[e("v-row",{attrs:{"no-gutters":""}},[e("v-col",{attrs:{cols:"10"}},[e("v-row",{attrs:{"no-gutters":""}},[e("v-col",{attrs:{cols:"12"}},[s.editableBusinessName?e("div",{staticClass:"d-flex align-center"},[e("label",[s._v("Business or Corporation Name:")]),e("v-text-field",{staticClass:"mx-4 mr-md-0",attrs:{id:"organization-name",dense:"",filled:"","hide-details":"auto",rules:s.businessNameRules,value:s.businessName},on:{input:function(t){return s.setBusinessName(t)}}})],1):[e("label",[s._v("Name: ")]),e("span",[s._v(s._s(s.businessName))])]],2)],1),e("v-row",{staticClass:"mt-1",attrs:{"no-gutters":""}},[e("v-col",{attrs:{cols:"12"}},[e("label",[s._v("Incorporation Number: ")]),e("span",[s._v(s._s(s.identifier))])])],1),e("v-row",{staticClass:"mt-1",attrs:{"no-gutters":""}},[e("v-col",{attrs:{cols:"12"}},[e("label",[s._v("Business Number: ")]),e("span",[s._v(s._s(s.businessNumber))])])],1)],1),e("v-col",{attrs:{cols:"2"}},[e("div",{attrs:{id:"bl-more-actions"}},[e("v-btn",{attrs:{id:"bl-undo-btn",text:"",color:"primary"},on:{click:function(t){return s.emitUndo()}}},[e("v-icon",{attrs:{small:""}},[s._v(" mdi-undo ")]),e("span",[s._v("Undo")])],1)],1)])],1)],1):s._e()])},w=[],C=N(n,P,w,!1,null,"aaeb0d55",null,null);const x=C.exports;C.exports.__docgenInfo={exportName:"default",displayName:"BusinessLookup",description:"",tags:{},props:[{name:"showErrors",tags:{},description:"Whether to show errors.",type:{name:"boolean"},required:!0},{name:"businessLookup",tags:{},description:"The Business Lookup object.",type:{name:"BusinessLookupIF"},required:!0},{name:"BusinessLookupServices",tags:{},description:"Class for Business Lookup Services.",type:{name:"any"},required:!0},{name:"hasBusinessLookupChanges",tags:{},description:"Whether to display Change features.",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"editableBusinessName",tags:{},description:"Whether to allow editing of business name.",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"searchStatus",tags:{},description:"Business status to search for (eg, ACTIVE or HISTORICAL or '' to match all.",type:{name:"string"},defaultValue:{func:!1,value:"'ACTIVE'"}},{name:"label",tags:{},description:"Label for Business Lookup component.",type:{name:"string"},defaultValue:{func:!1,value:"'Business or Corporation Name or Incorporation Number'"}},{name:"hint",tags:{},description:"Hint for Business Lookup component.",type:{name:"string"},defaultValue:{func:!1,value:"null"}},{name:"placeholder",tags:{},description:"Placeholder for Business Lookup component.",type:{name:"string"},defaultValue:{func:!1,value:"null"}},{name:"legalTypes",tags:{},description:"Legal types to search for.",type:{name:"string"},defaultValue:{func:!1,value:"'A,BC,BEN,C,CBEN,CC,CCC,CP,CUL,FI,GP,LL,LLC,LP,PA,S,SP,ULC,XCP,XL,XP,XS'"}}],events:[{name:"setBusiness",description:"Emits event to update the Business object."},{name:"undoBusiness",description:"Emits event to undo the selected business."},{name:"valid",description:"Emits event to update this component's validity."}],sourceFiles:["/Users/cameron.bowler/_Never Backup/bcrs-shared-components/src/components/business-lookup/BusinessLookup.vue"]};const X={title:"component/BusinessLookup"},I=(o,{argTypes:s})=>({props:Object.keys(s),components:{BusinessLookup:x},template:'<business-lookup v-bind="$props" />'}),d={identifier:"BC1234567",name:"Test Business Name"};class R{static async search(s){return Promise.resolve([d])}}const l=I.bind({});l.args={showErrors:!1,businessLookup:{identifier:d.identifier,name:d.name},BusinessLookupServices:R,hasBusinessLookupChanges:!0,label:"Business or Corporation Name or Incorporation Number"};var h,b,v;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    BusinessLookup
  },
  template: '<business-lookup v-bind="$props" />' // $props comes from args below
})`,...(v=(b=l.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const j=["Default"];export{l as Default,j as __namedExportsOrder,X as default};
//# sourceMappingURL=BusinessLookup.stories-fb33abdd.js.map
