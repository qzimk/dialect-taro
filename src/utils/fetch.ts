// 小程序没有 fetch。用 Taro.request 包一层，返回 { ok, status, json() }，
// 调用点保持 fetch 的形状不变（各文件以 `fetchShim as fetch` 导入）。
import Taro from '@tarojs/taro';

type Init = { method?: string; headers?: Record<string, string>; body?: string };

export async function fetchShim(url: string, init: Init = {}) {
  let data: unknown;
  if (init.body) {
    try {
      data = JSON.parse(init.body);
    } catch {
      data = init.body;
    }
  }
  const res = await Taro.request({
    url,
    method: (init.method ?? 'GET') as Parameters<typeof Taro.request>[0]['method'],
    header: init.headers,
    data,
  });
  return {
    ok: res.statusCode >= 200 && res.statusCode < 300,
    status: res.statusCode,
    json: async () => res.data,
  };
}
