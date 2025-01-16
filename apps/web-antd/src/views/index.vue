<script lang="ts" setup>
import { ref } from 'vue';

import { VbenTooltip } from '@vben/common-ui';
import { IconOir } from '@vben/icons';
import { isEmpty } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import { Divider, Input, message, Select } from 'ant-design-vue';

import {
  getBatData,
  getProdBatData,
  setCellBalance,
  setProdCellBalance,
} from '#/api';

const keyword = ref('');
const batData = ref<any[]>([]);
const refreshing = ref(false);
const env = ref('prod');

const envs = [
  { label: '生产环境均衡', value: 'prod' },
  { label: '测试环境均衡', value: 'test' },
];

const getCellData = async () => {
  if (!keyword.value) {
    setTimeout(() => {
      refreshing.value = false;
    }, 1000);
    return;
  }
  // 查询数据
  const data =
    env.value === 'prod'
      ? await getProdBatData(keyword.value)
      : await getBatData(keyword.value);
  if (!isEmpty(data)) {
    const dataObj: any = Object.values(data)[0];
    batData.value = dataObj['48'].level1;
  }
  refreshing.value = false;
};

const handleKeywordChanged = useDebounceFn((e: any) => {
  const key = e.target.value;
  keyword.value = key;
  refreshing.value = true;
  batData.value = [];
  getCellData();
}, 300);

// 处理数据并传给接口
const changeChecked = async (bmusn: string, index: number, value: number) => {
  batData.value = batData.value.map((res) => {
    if (res.Reg_09_BMUSN === bmusn) {
      const balanceData = res.Reg_0E_Balance_State_au16;
      balanceData.splice(index, 1, value ? 0 : 1);
      res.Reg_0E_Balance_State_au16 = balanceData;
    }
    return res;
  });
  const sendData = batData.value.map((res) => res.Reg_0E_Balance_State_au16);
  // 处理数据请求
  env.value === 'prod'
    ? await setProdCellBalance(keyword.value, sendData)
    : await setCellBalance(keyword.value, sendData);
  message.success(
    value ? `电芯${index + 1}均衡已关闭` : `电芯${index + 1}均衡已开启`,
  );
};

const handleEnvChange = () => {
  refreshing.value = true;
  batData.value = [];
  getCellData();
};

const startRefresh = () => {
  refreshing.value = true;
  getCellData();
};
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="card"></div>
    <div class="card-content">
      <div class="flex items-center">
        <Select
          class="mr-4 w-[200px]"
          size="large"
          v-model:value="env"
          :options="envs"
          @change="handleEnvChange"
        />
        <Input
          class="my-[20px] w-[600px]"
          @change="handleKeywordChanged"
          size="large"
          placeholder="请输入正确的SN"
        />
        <IconOir
          width="32"
          class="ml-4 cursor-pointer"
          :class="{ 'animate-spin': refreshing }"
          @click="startRefresh"
        />
      </div>

      <div class="h-full w-full overflow-y-auto p-[24px]">
        <div v-if="batData.length > 0">
          <template :key="bat.Reg_09_BMUSN" v-for="(bat, index) in batData">
            <Divider> 电池{{ index + 1 }} SN：{{ bat.Reg_09_BMUSN }} </Divider>
            <div class="flex w-full justify-center">
              <VbenTooltip
                side="top"
                :key="`${bat.Reg_09_BMUSN}_${i}`"
                v-for="(cell, i) in bat.Reg_0E_Balance_State_au16"
              >
                <template #trigger>
                  <div
                    class="cell mx-[2px]"
                    :class="{ 'cell-active': cell }"
                    @click="changeChecked(bat.Reg_09_BMUSN, i, cell)"
                  ></div>
                </template>
                {{ cell ? `电芯${i + 1}关闭均衡` : `电芯${i + 1}开启均衡` }}
              </VbenTooltip>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  height: calc(100% - 100px);
  padding: 60px 24px;
  background: hsl(240deg 14% 89% / 90%);
  filter: blur(30px);
  border-radius: 20px;
}

.card-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1000px;
  height: calc(100% - 100px);
  padding: 60px 24px;
  border-radius: 20px;
}

.cell {
  position: relative;
  width: 24px;
  height: 46px;
  overflow: hidden;
  cursor: pointer;
  background: #1e1e1e9c;
  border-radius: 8px;
  transition: all 0.7s ease-in-out;
}

.cell-active {
  background-color: #33f11e;
}

.cell:hover {
  background: #bcbccb;
}

.cell::before {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 40%;
  content: '';
  background-color: #33f11e;
  transition: all 0.5s ease-in-out;
  transform: translateY(20px);
}

.cell-active:hover::before {
  background: #a4ef9c;
}

.cell-active::before {
  transform: scale(4) translateY(-2px);
}
</style>
