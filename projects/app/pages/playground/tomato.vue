<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import Chart from 'primevue/chart';
import type { Tomato } from "@prisma/client";
import { Edit } from "@vicons/carbon";
import { toast } from "vue3-toastify";
import { useFetchWithToken } from "~/api/utils";

const timeCountDown = ref<number>(0);
const timer = ref<NodeJS.Timeout | null>(null);

const audio = ref<HTMLAudioElement | null>(null);
const focusOn = ref<string>("");

const editFocusOnId = ref<string | null>(null);
const editScoreId = ref<string | null>(null);
const score = ref<number>(0);
const statusMode = ref<'today' | 'week'>('today');

watch(() => editFocusOnId.value, (value) => {
  focusOn.value = tomatoes.value?.find((tomato) => tomato.id === value)?.focusOn ?? "";
});

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

async function handleEnter() {
  if (editFocusOnId.value) {
    // update 
    const { error } = await useFetchWithToken("/api/tomato/update", {
      method: "POST",
      body: {
        id: editFocusOnId.value,
        focusOn: focusOn.value,
      },
    });
    if (error.value === null) {
      editFocusOnId.value = null;
      await getToday();
    } else {
      toast(error.value.message, {
        type: "error",
        position: "top-right",
      });
    }
  } else {
    startTomato();
  }
}

async function updateScore() {
  if (editScoreId.value && score) {
    const { error } = await useFetchWithToken("/api/tomato/update", {
      method: "POST",
      body: {
        id: editScoreId,
        score: Number(score.value),
      },
    });
    if (error.value === null) {
      editScoreId.value = null;
      await getToday();
    } else {
      toast(error.value.message, {
        type: "error",
        position: "top-right",
      });
    }
  }
}

const { data: todayTomatoes, refresh: getToday } = useFetchWithToken<Tomato[]>("/api/tomato/today", {
  lazy: true,
});

const { data: lastWeekTomatoes, refresh: getLastWeek } = useFetchWithToken<Tomato[]>("/api/tomato/lastWeek", {
  lazy: true,
  watch: [statusMode],
});

const tomatoes = computed(() => {
  return (statusMode.value === 'today' ? todayTomatoes.value : lastWeekTomatoes.value).sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
});

// count of every day
const chartData = computed(() => {
  return {
    labels: tomatoes.value.map((tomato) => new Date(tomato.createdAt).toLocaleDateString()).filter((value, index, self) => self.indexOf(value) === index),
    datasets: [
      {
        label: "Tomato",
        data: tomatoes.value.reduce((acc, tomato) => {
          const date = new Date(tomato.createdAt).toLocaleDateString();
          acc[date] = acc[date] ? acc[date] + 1 : 1;
          return acc;
        }, {} as Record<string, number>),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Score",
        data: tomatoes.value.reduce((acc, tomato) => {
          const date = new Date(tomato.createdAt).toLocaleDateString();
          acc[date] = acc[date] ? acc[date] + (tomato.score || 0) : (tomato.score || 0);
          return acc;
        }, {} as Record<string, number>),
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

</script>

<template>
  <div class="max-w-5xl mx-auto flex flex-col">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-bold cursor-pointer" @click="() => { getNowTomato(); getToday(); getLastWeek(); }">
        Tomato
      </h1>
      <input v-model="focusOn"
        class="border border-gray-300 p-2 rounded-md dark:text-gray-50 dark:bg-gray-600 text-2xl text-center max-w-80 w-full mt-4"
        placeholder="Focus on" @keydown.enter="handleEnter">
      <p class="text-4xl font-bold gap-2 flex flex-row m-4">
        <span>{{
          Math.floor(timeCountDown / 60) < 10 ? "0" + Math.floor(timeCountDown / 60) : Math.floor(timeCountDown / 60) }}
            </span>
            :
            <span>{{
              timeCountDown % 60 < 10 ? "0" + (timeCountDown % 60) : timeCountDown % 60 }}</span>
      </p>

      <span>
        <Button @click="startTomato">{{ !timeCountDown ? "Start" : "Restart" }} A Tomato 🍅</Button>
        <Button v-if="timeCountDown" @click="stopTimer">Stop 🛑</Button>
      </span>
      <Button @click="handleShortBreak">Short Break (5 mins)</Button>
      <Button @click="handleLongBreak">Long Break (20 mins)</Button>
      <Button @click="statusMode = statusMode === 'today' ? 'week' : 'today'">
        {{ statusMode === 'today' ? 'Show Week' : 'Show Today' }}
      </Button>

      <div v-if="tomatoes?.length ?? 0 > 0" class="flex flex-col">
        <table class="table-auto w-full max-h-80 overflow-y-scroll">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th>Focus On</th>
              <th>Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tr v-for="tomato in tomatoes" :key="tomato.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="bg-gray-200 dark:bg-gray-700 focusOn">
              <button class="editButton mr-1 w-4" @click="editFocusOnId = tomato.id">
                <Edit />
              </button>
              {{ tomato.focusOn || 'empty' }}
            </td>
            <td class="text-gray-500 text-sm">{{ new Date(tomato.createdAt).toLocaleString() }}</td>
            <td v-if="editScoreId !== tomato.id" class="text-gray-500 text-sm" @click="editScoreId = tomato.id">{{
              tomato.score }}</td>
            <td v-else>
              <input v-model.number="score" class="w-4" @change="updateScore()">
            </td>
          </tr>
        </table>
      </div>
      <Chart type="bar" :data="chartData" :options="chartOptions" />
      <span class="text-lg">
        <span>{{ tomatoes?.length }} x 🍅 </span>
        <br>
        <span>Total Score: </span>
        <span>{{ tomatoes.reduce((acc, tomato) => acc + (tomato.score || 0), 0) }}</span>
        <br>
        <span> Average Score: </span>
        <span>{{ (tomatoes.reduce((acc, tomato) => acc + (tomato.score || 0), 0) / tomatoes.length).toFixed(2)
          }}</span>
      </span>
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
