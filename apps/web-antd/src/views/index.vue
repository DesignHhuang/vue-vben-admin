<script lang="ts" setup>
import { ref } from 'vue';

import { VbenTooltip } from '@vben/common-ui';
import { IconOir } from '@vben/icons';
import { isEmpty } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import { Button, Input, message, Select } from 'ant-design-vue';

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
const sendData = ref<any[]>([]);

const isGen2 = ref(false);

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
    isGen2.value = Object.hasOwnProperty.call(dataObj, 'slave板数据');
    if (isGen2.value) {
      const merged = [];
      // gen2
      const arr = dataObj['slave板数据'].map((item: any) => {
        const balanceData = [];
        for (let i = 1; i <= 16; i++) {
          balanceData.push(item[`均衡开启标志${i}`]);
        }
        return balanceData;
      });
      for (let i = 0; i < arr.length; i += 2) {
        const pair = [...(arr[i] || []), ...(arr[i + 1] || [])];
        merged.push(pair);
      }
      batData.value = merged.map((res) => ({ cellBalance: res }));
    } else {
      // gen3
      batData.value = dataObj['48'].level1;
    }
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

// 处理数据
const changeChecked = (i: number, index: number, value: number) => {
  if (isGen2.value) {
    // gen2
    batData.value = batData.value.map((res, bmuindex) => {
      if (bmuindex === i) {
        const balanceData = res.cellBalance;
        balanceData.splice(index, 1, value ? 0 : 1);
        res.cellBalance = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.cellBalance);
  } else {
    // gen3
    batData.value = batData.value.map((res, bmuindex) => {
      if (bmuindex === i) {
        const balanceData = res.Reg_0E_Balance_State_au16;
        balanceData.splice(index, 1, value ? 0 : 1);
        res.Reg_0E_Balance_State_au16 = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.Reg_0E_Balance_State_au16);
  }
};

const sendCellData = async () => {
  // 处理数据请求
  env.value === 'prod'
    ? await setProdCellBalance(keyword.value, sendData.value)
    : await setCellBalance(keyword.value, sendData.value);
  message.success('电芯均衡数据已下发');
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

const checkAll = (i: number) => {
  if (isGen2.value) {
    // gen2
    batData.value = batData.value.map((res, index) => {
      if (index === i) {
        const balanceData = res.cellBalance.map((_: any) => 1);
        res.cellBalance = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.cellBalance);
  } else {
    // gen3
    batData.value = batData.value.map((res, index) => {
      if (index === i) {
        const balanceData = res.Reg_0E_Balance_State_au16.map((_: any) => 1);
        res.Reg_0E_Balance_State_au16 = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.Reg_0E_Balance_State_au16);
  }
};

const resetAll = (i: number) => {
  if (isGen2.value) {
    // gen2
    batData.value = batData.value.map((res, index) => {
      if (index === i) {
        const balanceData = res.cellBalance.map((_: any) => 0);
        res.cellBalance = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.cellBalance);
  } else {
    // gen3
    batData.value = batData.value.map((res, index) => {
      if (index === i) {
        const balanceData = res.Reg_0E_Balance_State_au16.map((_: any) => 0);
        res.Reg_0E_Balance_State_au16 = balanceData;
      }
      return res;
    });
    sendData.value = batData.value.map((res) => res.Reg_0E_Balance_State_au16);
  }
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
        <div v-if="batData.length > 0" class="grid grid-cols-1 divide-y">
          <template v-if="isGen2">
            <div class="py-4" :key="index" v-for="(bat, index) in batData">
              <div class="mb-4 flex items-center justify-between">
                <div class="text-base font-semibold">
                  Battery {{ index + 1 }}
                </div>
                <div class="flex items-center justify-end">
                  <Button
                    ghost
                    class="mr-2"
                    size="small"
                    @click="checkAll(index)"
                  >
                    全选
                  </Button>
                  <Button
                    type="dashed"
                    ghost
                    class="ml-2"
                    size="small"
                    @click="resetAll(index)"
                  >
                    重置
                  </Button>
                </div>
              </div>

              <div class="flex w-full justify-center">
                <VbenTooltip
                  side="top"
                  :key="`${index}_${i}`"
                  v-for="(cell, i) in bat.cellBalance"
                >
                  <template #trigger>
                    <div
                      class="cell mx-[2px]"
                      :class="{ 'cell-active': cell }"
                      @click="changeChecked(index, i, cell)"
                    ></div>
                  </template>
                  {{ cell ? `电芯${i + 1}关闭均衡` : `电芯${i + 1}开启均衡` }}
                </VbenTooltip>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="py-4" :key="index" v-for="(bat, index) in batData">
              <div class="mb-4 flex items-center justify-between">
                <div class="text-base font-semibold">
                  Battery {{ index + 1 }} -- SN：{{ bat.Reg_09_BMUSN }}
                </div>
                <div class="flex items-center justify-end">
                  <Button
                    ghost
                    class="mr-2"
                    size="small"
                    @click="checkAll(index)"
                  >
                    全选
                  </Button>
                  <Button
                    type="dashed"
                    ghost
                    class="ml-2"
                    size="small"
                    @click="resetAll(index)"
                  >
                    重置
                  </Button>
                </div>
              </div>

              <div class="flex w-full justify-center">
                <VbenTooltip
                  side="top"
                  :key="`${index}_${i}`"
                  v-for="(cell, i) in bat.Reg_0E_Balance_State_au16"
                >
                  <template #trigger>
                    <div
                      class="cell mx-[2px]"
                      :class="{ 'cell-active': cell }"
                      @click="changeChecked(index, i, cell)"
                    ></div>
                  </template>
                  {{ cell ? `电芯${i + 1}关闭均衡` : `电芯${i + 1}开启均衡` }}
                </VbenTooltip>
              </div>
            </div>
          </template>
        </div>
      </div>

      <button class="send-btn" @click="sendCellData">
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              />
            </svg>
          </div>
        </div>
        <span>下发数据</span>
      </button>
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

.send-btn {
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  padding-left: 0.9em;
  margin-top: 24px;
  overflow: hidden;
  font-family: inherit;
  font-size: 16px;
  color: white;
  cursor: pointer;
  background: #1e1e1e9c;
  border: none;
  border-radius: 16px;
  transition: all 0.2s;
}

.send-btn span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

.send-btn svg {
  display: block;
  transition: transform 0.3s ease-in-out;
  transform-origin: center center;
}

.send-btn:hover {
  background: #0ce515;
}

.send-btn:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

.send-btn:hover svg {
  transform: translateX(2em) rotate(45deg) scale(1.1);
}

.send-btn:hover span {
  transform: translateX(5em);
}

.send-btn:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}
</style>
