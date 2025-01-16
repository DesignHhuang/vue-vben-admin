import { prodRequestClient, requestClient } from '#/api/request';

/**
 * 获取sn数据
 */
export async function getBatData(sn: string) {
  return requestClient.get(`/api/v1/sn/${sn}`);
}

/**
 * 配置均衡
 */
export async function setCellBalance(sn: string, params: any[]) {
  return requestClient.post(`/balance/${sn}`, params);
}

// 生产环境的接口
export async function getProdBatData(sn: string) {
  return prodRequestClient.get(`/api/v1/sn/${sn}`);
}

export async function setProdCellBalance(sn: string, params: any[]) {
  return prodRequestClient.post(`/balance/${sn}`, params);
}
