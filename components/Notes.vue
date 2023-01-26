<script setup lang="ts">
export default {
  props: {
    userId: String,
  },
};
</script>

<script>
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
</script>

<template>
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
</template>
