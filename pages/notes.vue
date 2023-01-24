<script setup lang="ts">
import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const title = ref("");
const body = ref("");

const loading = ref(false);

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

const createNote = async () => {
  if (user.value?.id === undefined) {
    return;
  }

  if (title.value.trim().length === 0) {
    return;
  }

  loading.value = true;

  const { data, error } = await client.from("notes").insert([
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
  <h1>Notes</h1>
  <p>{{ user?.value?.id }}</p>

  <form @submit.prevent="createNote">
    <div class="flex flex-col gap-1">
      <label for="title">title</label>
      <input type="text" v-model="title" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="body">body</label>
      <textarea v-model="body"></textarea>
    </div>

    <button>create note</button>
  </form>

  <ul>
    <li v-for="note in notes" :key="note.id">
      <strong>{{ note.title }}</strong>

      <p>{{ note.body }}</p>
    </li>
  </ul>
</template>
