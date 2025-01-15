import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/**
 * 获取sn数据
 */
export async function getBatData(sn: string) {
  return requestClient.get(`/sn/${sn}`);
}
