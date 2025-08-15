/// <reference types='@dcloudio/types' />
import 'vue'

// 声明uni全局变量
declare const uni: UniApp.Uni

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {

  }
}

// 扩展Window接口以包含uni
declare global {
  interface Window {
    uni: UniApp.Uni
  }
}
