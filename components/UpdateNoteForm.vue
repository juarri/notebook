<script setup lang="ts">
const props = defineProps({
  noteId: String,
});

import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { data: note } = await useAsyncData("note", async () => {
  const { data } = await client
    .from("notes")
    .select("*")
    .eq("id", props.noteId)
    .single();

  return data;
});

const title = ref(note.value?.title);
const body = ref(note.value?.body);

const updateNote = async () => {
  if (user.value?.id === undefined) {
    return;
  }

  if (title.value?.trim().length === 0) {
    return;
  }

  if (title.value === undefined) {
    return;
  }

  const { error } = await client.from("notes").upsert({
    id: props.noteId,
    user_id: user.value.id,
    title: title.value,
    body: body.value,
  });

  if (error) {
    console.log(error);
  }
};
</script>

<template>
  <form
    @submit.prevent="updateNote"
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
      Update Note
    </button>
  </form>
</template>
