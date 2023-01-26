<script setup lang="ts">
import type { Database } from "types/database.types";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const email = ref("");

watchEffect(() => {
  if (user.value) {
    navigateTo("/notes");
  }
});
</script>

<template>
  <div class="min-h-full flex flex-col justify-center mt-44 px-6 lg:px-8">
    <h1
      class="text-center text-3xl font-extrabold u-text-white flex items-center gap-2 justify-center"
    >
      Notepad
      <img
        src="/favicon.png"
        alt=""
        width="36px"
        height="36px"
        class="inline"
      />
    </h1>

    <form
      class="flex flex-col max-w-xs w-full mx-auto mt-24 gap-4"
      @submit.prevent="client.auth.signInWithOtp({ email })"
    >
      <div class="flex flex-col gap-2">
        <label for="email" class="font-bold">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="border py-2 px-4 rounded"
        />
      </div>

      <button class="py-2 px-4 bg-black text-white rounded font-bold">
        Continue with email
      </button>
    </form>
  </div>
</template>
