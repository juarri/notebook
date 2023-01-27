<script setup lang="ts">
const props = defineProps({
  noteId: String,
});

import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const router = useRouter();

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
const pinned = ref(note.value?.pinned);

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
    pinned: pinned.value,
  });

  if (error) {
    console.log(error);
  }

  router.push("/notes");
};

const deleteNote = async () => {
  await client.from("notes").delete().match({
    id: props.noteId,
  });

  router.push("/notes");
};
</script>

<template>
  <div
    class="relative flex flex-col gap-4 bg-white p-6 rounded-xl w-full border"
  >
    <button
      class="absolute top-4 right-6"
      aria-label="close note"
      @click="router.push('/notes')"
    >
      <svg
        width="24px"
        height="24px"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="#000000"
      >
        <path
          d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>

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

    <div class="flex flex-col gap-1">
      <label for="pinned" class="font-bold">Pinned</label>
      <input type="checkbox" v-model="pinned" class="self-start" />
    </div>

    <div class="flex gap-4 justify-end">
      <button
        @click="deleteNote"
        class="bg-red-500 px-4 py-2 rounded text-white font-bold"
      >
        Delete Note
      </button>
      <button
        @click="updateNote"
        class="bg-black px-4 py-2 rounded text-white font-bold"
      >
        Update Note
      </button>
    </div>
  </div>
</template>
