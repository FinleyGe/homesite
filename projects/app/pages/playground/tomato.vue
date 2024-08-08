<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import Chart from 'primevue/chart';
import type { Tomato } from "@prisma/client";
import { Edit } from "@vicons/carbon";
import { toast } from "vue3-toastify";
import { addDays } from "date-fns";

const timeCountDown = ref<number>(0);
const timer = ref<NodeJS.Timeout | null>(null);
const audio = ref<HTMLAudioElement | null>(null);

const statusMode = ref<'today' | 'week'>('today');

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

function removeTimer() {
  if (timer.value) {
    clearInterval(timer.value);
  }
  timeCountDown.value = 0;
}

const { data: nowTomato, refresh: getNowTomato, clear: clearNowTomato } = useFetch<Tomato>("/api/tomato/now", {
  method: 'get',
  $fetch: useApi(),
});

watch(nowTomato, (value) => {
  if (value) {
    const start = new Date(value.createdAt).getTime();
    const now = new Date().getTime();
    setTimer((25 * 60 - Math.floor((now - start) / 1000)), handleNotification);
  } else {
    removeTimer();
    getToday();
  }
});

const body = ref(nowTomato.value || {
  focusOn: "",
} as Tomato);

const { execute: addTomato } = useFetch<Tomato | string>("/api/tomato/add", {
  method: "POST",
  body: body,
  watch: false,
  immediate: false,
  $fetch: useApi(),
  onResponse: ({ response }) => {
    if (response.ok) {
      getNowTomato();
      getToday();
      toast.success("Tomato is added");
    }
  },
});

function handleNotification() {
  toast.success("Time is up!");
  audio.value?.play();
}

const { execute: cancelTomato } = useFetch("/api/tomato/cancel", {
  method: "POST",
  body: nowTomato,
  watch: false,
  immediate: false,
  onResponse: ({ response }) => {
    if (response.ok) {
      clearNowTomato();
      toast.info("Tomato is canceled");
    }
  },
  $fetch: useApi(),
});

// async function stopTimer() {
//   if (timer.value) {
//     clearInterval(timer.value);
//   } else {
//     return;
//   }
//   if (timeCountDown.value < 0) {
//     return;
//   }
//   timeCountDown.value = 0;
//
//   if (!nowTomato.value) {
//     return;
//   }
//
//   if (error.value === null) {
//     clearNowTomato();
//   } else {
//     toast.error(error.value.message);
//   }
// }

function handleShortBreak() {
  cancelTomato();
  setTimer(5 * 60, handleNotification);
}

function handleLongBreak() {
  cancelTomato();
  setTimer(20 * 60, handleNotification);
}

const { execute: updateScore } = useFetch("/api/tomato/update", {
  method: "POST",
  body,
  watch: false,
  immediate: false,
  $fetch: useApi(),
  onResponse: ({ response }) => {
    if (response.ok) {
      getToday();
      toast.success("Score is updated");
    }
  },
});

const { data: todayTomatoes, refresh: getToday } = useFetch<Tomato[]>("/api/tomato/today", {
  lazy: true,
  $fetch: useApi(),
});

const { data: lastWeekTomatoes, refresh: getLastWeek } = useFetch<Tomato[]>("/api/tomato/lastWeek", {
  lazy: true,
  $fetch: useApi(),
});

const tomatoes = computed(() => {
  return (statusMode?.value === 'today' ? todayTomatoes.value : lastWeekTomatoes.value)?.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
});

// count of every day
const chartData = computed(() => {
  const labels = Array.from({ length: 7 }, (_, index) => {
    return addDays(new Date(), -7 + index).toLocaleDateString();
  });
  const tomatoCount = tomatoes.value?.reduce((acc, tomato) => {
    const date = new Date(tomato.createdAt).toLocaleDateString();
    acc[date] = acc[date] ? acc[date] + 1 : 1;
    return acc;
  }, {} as Record<string, number>);

  const tomatoCountOfEveryDayArray = labels.map((label) => {
    return tomatoCount?.[label] || 0;
  });

  const scoreAmount = tomatoes.value?.reduce((acc, tomato) => {
    const date = new Date(tomato.createdAt).toLocaleDateString();
    acc[date] = acc[date] ? acc[date] + tomato.score : tomato.score;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels,
    datasets: [
      {
        label: "Tomato",
        data: tomatoCountOfEveryDayArray,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Score",
        data: scoreAmount,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.1,
      }
    ],
  };
});

const chartOptions = computed(() => {
  return {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
});

async function handleStartTomato() {
  if (nowTomato) {
    await cancelTomato();
  }
  addTomato();
}

function handleStopTomato() {
  if (timer.value) {
    timeCountDown.value = 0;
    clearInterval(timer.value);
  }
  if (nowTomato) cancelTomato();
}

</script>

<template>
  <div class="max-w-5xl mx-auto flex flex-col">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-bold cursor-pointer" @click="() => (getNowTomato(), getToday(), getLastWeek())">
        Tomato
      </h1>
      <input
        v-model="body.focusOn"
        class="border border-gray-300 p-2 rounded-md dark:text-gray-50 dark:bg-gray-600 text-2xl text-center max-w-80 w-full mt-4"
        placeholder="Focus on" @keydown.enter="handleStartTomato">
      <p class="text-4xl font-bold gap-2 flex flex-row m-4">
        <span>{{
          Math.floor(timeCountDown / 60) < 10 ? "0" + Math.floor(timeCountDown / 60) : Math.floor(timeCountDown / 60) }}
        </span>
        :
        <span>{{
          timeCountDown % 60 < 10 ? "0" + (timeCountDown % 60) : timeCountDown % 60 }}</span>
      </p>
      <div class="flex">
        <div>
          <span>
            <Button @click="handleStartTomato">{{ !timeCountDown ? "Start" : "Restart" }} A Tomato 🍅</Button>
            <Button v-if="timeCountDown" @click="handleStopTomato">Stop 🛑</Button>
          </span>
          <Button @click="handleShortBreak">Short Break (5 mins)</Button>
          <Button @click="handleLongBreak">Long Break (20 mins)</Button>
          <Button @click="statusMode = statusMode === 'today' ? 'week' : 'today'">
            {{ statusMode === 'today' ? 'Show Week' : 'Show Today' }}
          </Button>
        </div>

        <span class="text-lg ml-8">
          <span>{{ tomatoes?.length }} x 🍅 </span>
          <br>
          <span>Total Score: </span>
          <span>{{ tomatoes?.reduce((acc, tomato) => acc + (tomato.score || 0), 0) }}</span>
          <br>
          <span> Average Score: </span>
          <span>{{ (tomatoes?.reduce((acc, tomato) => acc + (tomato.score || 0), 0) ?? 0 / (tomatoes?.length ??
            1))?.toFixed(2)
          }}</span>
        </span>
      </div>

      <table v-if="tomatoes?.length ?? 0 > 0" class="w-full max-h-80 overflow-y-scroll table-auto">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th>Focus On</th>
            <th>Time</th>
            <th>Score</th>
          </tr>
        </thead>
        <tr v-for="tomato in tomatoes" :key="tomato.id" class="border-b border-gray-200 dark:border-gray-700">
          <td class="bg-gray-200 dark:bg-gray-700 focusOn">
            <button class="editButton mr-1 w-4" @click="body = tomato">
              <Edit />
            </button>
            {{ tomato.focusOn || 'empty' }}
          </td>
          <td class="text-gray-500 text-sm">{{ new Date(tomato.createdAt).toLocaleString() }}</td>
          <td v-if="body?.id !== tomato.id" class="text-gray-500 text-sm" @click="body = tomato">{{
            tomato.score }}</td>
          <td v-else>
            <input v-model.number="body.score" class="dark:bg-gray-700 w-4 text-center" @change="updateScore()">
          </td>
        </tr>
      </table>
      <Chart type="bar" class="w-full" :data="chartData" :options="chartOptions" />
    </div>
    <audio ref="audio" src="/clock.mp3" />
  </div>
</template>

<style lang="scss" scoped>
table {
  td {
    @apply px-2;
  }

  .focusOn {
    &:hover {
      button {
        display: inline;
      }
    }

    button {
      display: none;
    }
  }
}
</style>
