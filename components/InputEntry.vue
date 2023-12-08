<script setup lang="ts">
import type { Grades, Hello } from '~/server/models'

// const name = ref('')

// const router = useRouter()
// function go() {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }

const myData: Ref<Grades | null> = ref(null)

async function getGrades() {
  const { data } = await useFetch<Grades | null>('/api/scrape', { method: 'get' })
  if (data.value)

    myData.value = data.value

  // console.log(`date: ${data?.hello}`)
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
  <div>data: {{ myData ? myData : 'blank' }}</div>
</template>
