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
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h1 class="my-12 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h1>

    <form
      class="flex flex-col"
      @submit.prevent="client.auth.signInWithOtp({ email })"
    >
      <label for="email">Email</label>
      <input v-model="email" type="email" placeholder="enter your email" />

      <button>Sign In</button>
    </form>
  </div>
</template>
