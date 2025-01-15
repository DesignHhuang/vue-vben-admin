import { requestClient } from '#/api/request';

/**
 * 获取sn数据
 */
export async function getBatData(sn: string) {
  return requestClient.get(`/sn/${sn}`);
}
