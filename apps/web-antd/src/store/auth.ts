import type { UserInfo } from '@vben/types';

import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();

  const loginLoading = ref(false);

  async function fetchUserInfo() {
    const userInfo: null | UserInfo = null;
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    fetchUserInfo,
    loginLoading,
  };
});
