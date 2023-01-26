<script setup lang="ts">
import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const title = ref("");
const body = ref("");

const loading = ref(false);

const { refresh: refreshNotes } = await useAsyncData("notes", async () => {
  const { data } = await client
    .from("notes")
    .select("*")
    .eq("user_id", user?.value?.id)
    .order("created_at");

  return data;
});

const createNote = async () => {
  if (user.value?.id === undefined) {
    return;
  }

  if (title.value.trim().length === 0) {
    return;
  }

  loading.value = true;

  const { data, error } = await client.from("notes").upsert([
    {
      user_id: user.value.id,
      title: title.value,
      body: body.value,
    },
  ]);

  if (error) {
    console.log(error);
  }

  title.value = "";
  body.value = "";

  loading.value = false;

  refreshNotes();
};
</script>

<template>
  <form
    @submit.prevent="createNote"
    class="relative flex flex-col gap-4 bg-white p-6 rounded-xl w-full border"
  >
    <div class="flex flex-col gap-1">
      <label for="title" class="font-bold">Title</label>
      <input type="text" v-model="title" class="border rounded px-4 py-2" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="body" class="font-bold">Note</label>
      <textarea
        v-model="body"
        class="border rounded py-2 px-4"
        rows="4"
      ></textarea>
    </div>

    <button class="bg-black px-4 py-2 rounded text-white font-bold">
      Create Note
    </button>
  </form>
</template>
