<script lang="ts" setup>
import { ref } from 'vue';

import { Divider, Input } from 'ant-design-vue';

const keyword = ref('');

const checked = ref(false);

const changeChecked = () => {
  checked.value = !checked.value;
};
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="card"></div>
    <div class="card-content">
      <Input
        class="!focus:ring-[#11BE86] my-[20px] w-[600px] outline-none !ring-2 !ring-[transparent] !duration-200"
        v-model:value="keyword"
        size="large"
        placeholder="请输入正确的SN"
      />
      <div class="cell-container w-full overflow-y-auto">
        <div
          class="cell mx-[2px]"
          :class="{ 'cell-active': checked }"
          @click="changeChecked"
        ></div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell cell-active mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
        </div>
        <Divider> 电池SN:4342553454554534543534 </Divider>
        <div class="flex w-full justify-center">
          <div class="cell mx-[2px]" :key="i" v-for="i in 32"></div>
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

.cell-container {
  padding-bottom: 24px;
  background: #e4e4e7;
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
