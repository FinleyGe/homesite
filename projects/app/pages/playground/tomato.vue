<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import type { Tomato } from "@prisma/client";
import { toast } from "vue3-toastify";
import { useFetchWithToken } from "~/api/utils";

const timeCountDown = ref<number>(0);
const timer = ref<NodeJS.Timeout | null>(null);

const audio = ref<HTMLAudioElement | null>(null);
const focusOn = ref<string>("");

function setTimer(time: number, callback: () => void) {
  timeCountDown.value = time;
  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(() => {
    timeCountDown.value--;
    if (timeCountDown.value <= 0) {
      callback();
      timer.value && clearInterval(timer.value);
    }
  }, 1000);
}

const { data: nowTomato, refresh: getNowTomato, clear: clearNowTomato } = useFetchWithToken<Tomato>(
  "/api/tomato/now",
  {
    onResponse: ({ response }) => {
      nowTomato.value = response._data;
      nowTomato.value.createdAt = new Date(nowTomato.value.createdAt);
      focusOn.value = nowTomato.value.focusOn ?? "";
      if (nowTomato.value) {
        const now = new Date();
        const start = nowTomato.value.createdAt;
        const diff = now.getTime() - start.getTime();
        const time = 25 * 60 - Math.floor(diff / 1000);
        if (time > 0) {
          setTimer(time, handleNotification);
        }
      }
    },
  },
);

onNuxtReady(() => {
  getNowTomato();
});

async function startTomato() {
  await stopTimer();

  const { error } = await useFetchWithToken<Tomato | string>(
    "/api/tomato/add",
    {
      method: "POST",
      body: {
        focusOn: focusOn.value,
      },
    },
  );
  if (error.value === null) {
    await getNowTomato();
    // nowTomato.value = data.value as Tomato;
  } else {
    toast(error.value.message, {
      type: "error",
      position: "top-right",
    });
  }
}

function handleNotification() {
  toast("Time is up!", {
    type: "success",
    position: "top-right",
  });
  audio.value?.play();
}

async function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value);
  } else {
    return;
  }
  if (timeCountDown.value < 0) {
    return;
  }
  timeCountDown.value = 0;

  if (!nowTomato.value) {
    return;
  }

  const { error } = useFetchWithToken<Tomato>("/api/tomato/cancel", {
    method: "POST",
    body: {
      id: nowTomato.value!.id,
    },
  });
  if (error.value === null) {
    clearNowTomato();
  } else {
    toast(error.value.message, {
      type: "error",
      position: "top-right",
    });
  }
}

function handleShortBreak() {
  stopTimer();
  timeCountDown.value = 5 * 60;
  timer.value = setInterval(() => {
    timeCountDown.value--;
    if (timeCountDown.value <= 0) {
      clearInterval(timer.value!);
      handleNotification();
    }
  }, 1000);
}

function handleLongBreak() {
  stopTimer();
  timeCountDown.value = 15 * 60;
  timer.value = setInterval(() => {
    timeCountDown.value--;
    if (timeCountDown.value <= 0) {
      clearInterval(timer.value!);
      handleNotification();
    }
  }, 1000);
}

const { data: tomatoes, refresh: getToday } = useFetchWithToken<Tomato[]>("/api/tomato/today", {
  onResponse: (response) => {
    console.log(response);
  },
});

</script>

<template>
  <div class="max-w-5xl mx-auto flex flex-col">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-bold cursor-pointer" @click="() => getNowTomato()">
        Tomato
      </h1>
      <input
v-model="focusOn"
        class="border border-gray-300 p-2 rounded-md dark:text-gray-50 dark:bg-gray-600 text-2xl text-center max-w-80 w-full mt-4"
        placeholder="Focus on">
      <p class="text-4xl font-bold gap-2 flex flex-row m-4">
        <span>{{
          Math.floor(timeCountDown / 60) < 10 ? "0" + Math.floor(timeCountDown / 60) : Math.floor(timeCountDown / 60) }}
            </span>
            :
            <span>{{
              timeCountDown % 60 < 10 ? "0" + (timeCountDown % 60) : timeCountDown % 60 }}</span>
      </p>

      <Button @click="startTomato">{{ !timeCountDown ? "Start" : "Restart" }} A Tomato 🍅</Button>
      <Button v-if="timeCountDown" @click="stopTimer">Stop 🛑</Button>
      <Button @click="handleShortBreak">Short Break (5 mins)</Button>
      <Button @click="handleLongBreak">Long Break (20 mins)</Button>
      <Button @click="() => getToday()">Status</Button>

      <audio ref="audio" src="/clock.mp3" />

      <div v-if="tomatoes?.length ?? 0 > 0" class="flex flex-col">
        Today tomatoes: {{ tomatoes?.length }}
        <div v-for="tomato in tomatoes" :key="tomato.id">
          <span v-if="tomato.focusOn">{{ tomato.focusOn }}</span>
          <span v-else>No target</span> : 
          <span class="text-gray-500 text-sm">{{ new Date(tomato.createdAt).toLocaleTimeString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
