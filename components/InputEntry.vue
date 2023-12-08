<script setup lang="ts">
import type { Grades, Hello } from '~/server/models'

// const name = ref('')

// const router = useRouter()
// function go() {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }

const myData: Ref<Grades | null> = ref(null)
const screenTime = ref(0)

async function getGrades() {
  myData.value = null
  screenTime.value = 0
  const { data } = await useFetch<Grades | null>('/api/scrape', { method: 'get' })
  if (data.value) {
    myData.value = data.value

    Object.values(myData.value).forEach(info => screenTime.value += info.screenTime)
  }

  // console.log(`date: ${data?.hello}`)
}

function bgColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
    case 'A-':
      return 'text-green-500'
    case 'B+':
    case 'B':
    case 'B-':
      return 'text-lime-300/75'
    case 'C+':
    case 'C':
    case 'C-':
      return 'text-amber-500'
    default: return 'text-red-600'
  }
}
</script>

<template>
  <!-- <div>
    <input
      id="input"
      v-model="name"
      placeholder="What's your name?"
      type="text" autocomplete="off"
      p="x-4 y-2" m="t-5" w="250px"
      text="center" bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    >
    <div>
      <button
        m-3 text-sm btn
        :disabled="!name"
        @click="go"
      >
        GO
      </button>
    </div>
  </div> -->
  <button
    m-3 text-sm btn
    @click="getGrades"
  >
    Get grades
  </button>
  <div v-if="myData">
    <div v-for="subject in Object.keys(myData)" :key="subject" class="w-70 flex">
      <div class="w-30 text-left">
        {{ subject }}
      </div><div class="w-30 text-left">
        {{ myData[subject].teacher }}
      </div><div class="w-10 text-left" :class="bgColor(myData[subject].grade)">
        {{ myData[subject].grade }}
      </div>
    </div>
  </div>
  <div>screenTime: {{ screenTime }}</div>
</template>
