// Taro 没有 react-router。用一份模块级路径状态顶替，保持 useLocation/useNavigate/Outlet
// 的调用形状不变，这样 Other 的组件代码不必为路由改写。
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

let loc = { pathname: '/' };
const stack = ['/'];
const listeners = new Set<() => void>();

function render(pathname: string) {
  loc = { pathname };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useLocation() {
  return useSyncExternalStore(subscribe, () => loc);
}

// react-router 的 navigate 既收路径也收负数步长（-1 即返回），两个都保留给调用方。
export function useNavigate() {
  return (to: string | number) => {
    if (typeof to === 'number') {
      stack.splice(Math.max(1, stack.length + Math.min(to, -1)));
      render(stack[stack.length - 1]);
      return;
    }
    stack.push(to);
    render(to);
  };
}

const OutletContext = createContext<ReactNode>(null);

export const OutletProvider = OutletContext.Provider;

export function Outlet() {
  return <>{useContext(OutletContext)}</>;
}
