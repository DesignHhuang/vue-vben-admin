<script lang="ts" setup>
import { ref } from 'vue';

import { VbenTooltip } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import { Divider, Empty, Input, message } from 'ant-design-vue';

import { getBatData } from '#/api';

const keyword = ref('');
const batData = ref<any[]>([]);

const handleKeywordChanged = useDebounceFn(async (e: any) => {
  const key = e.target.value;
  keyword.value = key;
  if (!keyword.value) {
    batData.value = [];
  }
  // console.log(key);
  // 查询数据
  const data = await getBatData(keyword.value);
  // console.log(data);
  if (isEmpty(data)) {
    batData.value = [];
  } else {
    const dataObj: any = Object.values(data)[0];
    batData.value = dataObj['48'].level1;
  }
}, 300);

// 处理数据并传给接口
const changeChecked = (bmusn: string, index: number, value: number) => {
  batData.value = batData.value.map((res) => {
    if (res.Reg_09_BMUSN === bmusn) {
      const balanceData = res.Reg_0E_Balance_State_au16;
      balanceData.splice(index, 1, value ? 0 : 1);
      res.Reg_0E_Balance_State_au16 = balanceData;
    }
    return res;
  });
  // console.log(batData.value);
  // const sendData = batData.value.map((res) => res.Reg_0E_Balance_State_au16);
  // console.log(sendData);
  // 处理数据请求

  message.success(
    value ? `电芯${index + 1}均衡已关闭` : `电芯${index + 1}均衡已开启`,
  );
};
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="card"></div>
    <div class="card-content">
      <Input
        class="my-[20px] w-[600px]"
        @change="handleKeywordChanged"
        size="large"
        placeholder="请输入正确的SN"
      />

      <div class="h-full w-full overflow-y-auto p-[24px]">
        <Empty v-if="batData.length === 0" :description="null" />
        <template
          v-else
          :key="bat.Reg_09_BMUSN"
          v-for="(bat, index) in batData"
        >
          <Divider> 电池{{ index + 1 }} SN：{{ bat.Reg_09_BMUSN }} </Divider>
          <div class="flex w-full justify-center">
            <VbenTooltip
              side="top"
              :key="`${bat.Reg_09_BMUSN}_${index}`"
              v-for="(cell, index) in bat.Reg_0E_Balance_State_au16"
            >
              <template #trigger>
                <div
                  class="cell mx-[2px]"
                  :class="{ 'cell-active': cell }"
                  @click="changeChecked(bat.Reg_09_BMUSN, index, cell)"
                ></div>
              </template>
              {{
                cell ? `电芯${index + 1}关闭均衡` : `电芯${index + 1}开启均衡`
              }}
            </VbenTooltip>
          </div>
        </template>
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
  width: 12px;
  height: 36px;
  overflow: hidden;
  cursor: pointer;
  background: #1e1e1e9c;
  transition: all 0.7s ease-in-out;
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
