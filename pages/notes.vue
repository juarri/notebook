<script setup lang="ts">
import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const currentNote = ref("");

const { data: notes, refresh: refreshNotes } = await useAsyncData(
  "notes",
  async () => {
    const { data } = await client
      .from("notes")
      .select("*")
      .eq("user_id", user?.value?.id)
      .order("created_at");

    return data;
  }
);

useHead({
  title: "notes",
});

watchEffect(() => {
  if (!user.value) {
    navigateTo("/");
  }
});
</script>

<template>
  <div
    v-if="currentNote"
    class="fixed z-20 inset-0 bg-white bg-opacity-50 backdrop-blur-xl grid place-items-center p-6"
    @click="currentNote = ''"
  >
    <UpdateNoteForm :noteId="currentNote" />
  </div>

  <div class="px-4 max-w-4xl mx-auto py-12 flex flex-col gap-8">
    <CreateNoteForm />

    <ul class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <li
        v-for="note in notes"
        :key="note.id"
        @click="currentNote = note.id"
        class="p-4 rounded-xl border"
      >
        <p class="font-bold">{{ note.title }}</p>

        <p class="text-sm">{{ note.body }}</p>
      </li>
    </ul>
  </div>
</template>
