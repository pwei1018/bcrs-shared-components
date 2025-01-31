var d=Object.defineProperty;var v=(o,e,s)=>e in o?d(o,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[e]=s;var i=(o,e,s)=>(v(o,typeof e!="symbol"?e+"":e,s),s);import{V as m}from"./vue.esm-b1e57a2f.js";import{C as _,P as u}from"./Prop-817ec8de.js";import{n as f}from"./_plugin-vue2_normalizer-2bbd088e.js";var g=Object.defineProperty,h=Object.getOwnPropertyDescriptor,c=(o,e,s,t)=>{for(var n=t>1?void 0:t?h(e,s):e,a=o.length-1,r;a>=0;a--)(r=o[a])&&(n=(t?r(e,s,n):r(n))||n);return t&&n&&g(e,s,n),n};let l=class extends m{constructor(){super(...arguments);i(this,"attach");i(this,"dialog",!1);i(this,"resolve",null);i(this,"reject",null);i(this,"title",null);i(this,"message",null);i(this,"options",{width:400,zIndex:200,persistent:!1,yes:"Yes",no:"No",cancel:"Cancel"})}open(s,t,n){return this.dialog=!0,this.title=s,this.message=t,this.options=Object.assign(this.options,n),new Promise((a,r)=>{this.resolve=a,this.reject=r})}onClickYes(){this.resolve(!0),this.dialog=!1}onClickNo(){this.resolve(!1),this.dialog=!1}onClickCancel(){this.reject(),this.dialog=!1}};c([u()],l.prototype,"attach",2);l=c([_({})],l);var C=function(){var e=this,s=e._self._c;return e._self._setupProxy,s("v-dialog",{style:{zIndex:e.options.zIndex},attrs:{"content-class":"confirm-dialog","max-width":e.options.width,persistent:e.options.persistent,attach:e.attach},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"esc",27,t.key,["Esc","Escape"])?null:e.onClickCancel.apply(null,arguments)}},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[s("v-card",[s("v-card-title",[e._v(e._s(e.title))]),s("v-card-text",{directives:[{name:"show",rawName:"v-show",value:!!e.message,expression:"!!message"}],staticClass:"pre-wrap",domProps:{innerHTML:e._s(e.message)}}),s("v-divider",{directives:[{name:"show",rawName:"v-show",value:!!e.options.yes||!!e.options.no||!!e.options.cancel,expression:"!!options.yes || !!options.no || !!options.cancel"}],staticClass:"my-0"}),s("v-card-actions",[s("v-spacer"),e.options.yes?s("v-btn",{staticClass:"dialog-yes-btn",attrs:{text:"",color:"primary"},nativeOn:{click:function(t){return e.onClickYes()}}},[e._v(" "+e._s(e.options.yes)+" ")]):e._e(),e.options.no?s("v-btn",{staticClass:"dialog-no-btn",attrs:{text:"",color:"primary"},nativeOn:{click:function(t){return e.onClickNo()}}},[e._v(" "+e._s(e.options.no)+" ")]):e._e(),e.options.cancel?s("v-btn",{staticClass:"dialog-cancel-btn",attrs:{text:"",color:"primary"},nativeOn:{click:function(t){return e.onClickCancel()}}},[e._v(" "+e._s(e.options.cancel)+" ")]):e._e()],1)],1)],1)},y=[],p=f(l,C,y,!1,null,"cbdb618c",null,null);const O=p.exports;p.exports.__docgenInfo={exportName:"default",displayName:"ConfirmDialog",description:"",tags:{},props:[{name:"attach",tags:{},description:"Prop to provide attachment selector.",type:{name:"string"}}],sourceFiles:["/Users/cameron.bowler/_Never Backup/bcrs-shared-components/src/components/confirm-dialog/ConfirmDialog.vue"]};export{O as C};
//# sourceMappingURL=ConfirmDialog-d3d20a8d.js.map
