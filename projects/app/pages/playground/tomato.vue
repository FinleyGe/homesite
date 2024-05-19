<script setup lang="ts">
import Button from '@/components/common/Button.vue'
import type { Tomato } from '@prisma/client';
import { toast } from 'vue3-toastify';
import { useFetchwithToken } from '~/api/utils';

const timer = ref<number>(0)
const interval = ref<NodeJS.Timeout | null>(null);
const audio = ref<HTMLAudioElement | null>(null);

const focusOn = ref<string>('');
const nowTomato = ref<Tomato | null>(null);
const tomatoes = ref<Tomato[]>([]);

function setTimer(time: number, callback: ()=>void) {
  timer.value = time
  if (interval.value) {
    clearInterval(interval.value)
  }
  interval.value = setInterval(()=> {
    timer.value--;
    if (timer.value <= 0) {
      callback();
      interval.value && clearInterval(interval.value);
    }
  }, 1000);
}

async function getNowTomato() {
  const {data} = await useFetchwithToken<Tomato>('/api/tomato/latest', {
    method: 'GET',
  });
  nowTomato.value = data.value!;
  focusOn.value = nowTomato.value?.focusOn || '';
  if (nowTomato.value) {
    const now = new Date();
    const start = new Date(nowTomato.value.createdAt);
    const diff = now.getTime() - start.getTime();
    const time = 25 * 60 - Math.floor(diff / 1000);
    setTimer(time, handleNotification);
  }
}

onNuxtReady(() => {
  getNowTomato();
})

async function startTomato() {
  stopTimer();
  const {
    data,
    error,
  } = await useFetchwithToken<Tomato | string>('/api/tomato/add', {
    method: 'POST',
    body: {
      focusOn: focusOn.value,
    },
  })
  if (error.value === null) {
    nowTomato.value = data.value as Tomato;
    getNowTomato();
  } else {
    toast(error.value.message, {
      type: 'error',
      position: 'top-right',
    })
  }
}

function handleNotification() {
  toast('Time is up!', {
    type: 'success',
    position: 'top-right',
  })
  audio.value?.play()
}

async function stopTimer() {
  clearInterval(interval.value!);
  timer.value = 0;
  const { error } = await useFetchwithToken<Tomato>('/api/tomato/cancel', {
    method: 'POST',
    body: {
      id: nowTomato.value!.id,
    }
  })
  if (error.value === null) {
    nowTomato.value = null;
  } else {
    toast(error.value.message, {
      type: 'error',
      position: 'top-right',
    })
  }
}

function handleShortBreak() {
  stopTimer();
  timer.value = 5 * 60;
  interval.value = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(interval.value!)
      handleNotification()
    }
  }, 1000);
}

function handleLongBreak() {
  stopTimer();
  timer.value = 15 * 60;
  interval.value = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(interval.value!)
      handleNotification()
    }
  }, 1000);
}

async function getToday() {
  const { data } = await useFetchwithToken<Tomato[]>('/api/tomato/today', {
    method: 'GET',
  })

  tomatoes.value = data.value!;
}

</script>

<template>
  <div class="max-w-5xl mx-auto flex flex-col">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-bold cursor-pointer" @click="getNowTomato">Tomato</h1>
      <input v-model="focusOn" class="border border-gray-300 p-2 rounded-md" placeholder="Focus on" />
      <p class="text-4xl font-bold gap-2 flex flex-row">
        <span>{{ Math.floor(timer / 60) < 10 ? '0' + Math.floor(timer / 60) : Math.floor(timer / 60) }} </span>
        :
        <span>{{ timer % 60 < 10 ? '0' + timer % 60 : timer % 60 }}</span>
      </p>
      <Button @click="startTomato">Tomato</Button>
      <Button v-if="timer" @click="stopTimer">Stop</Button>
      <Button @click="handleShortBreak">Short Break</Button>
      <Button @click="handleLongBreak">Long Break</Button>
      <Button @click="getToday">Status</Button>
      <audio src="/clock.mp3" ref="audio"></audio>

      <div class="flex flex-col">
      <div v-for="tomato in tomatoes" :key="tomato.id">
        {{ tomato.focusOn }}
      </div>
        </div>

    </div>
  </div>
</template>
