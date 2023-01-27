<script setup lang="ts">
const props = defineProps({ userId: String, pinned: Boolean });

import type { RealtimeChannel } from "@supabase/supabase-js";

import type { Database } from "types/database.types";
const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: notes, refresh: refreshNotes } = await useAsyncData(
  `notes${props.pinned && "-pinned"}`,
  async () => {
    const { data } = await client
      .from("notes")
      .select("*")
      .match({
        user_id: props.userId,
        pinned: props.pinned,
      })
      .order("created_at", { ascending: false });
    return data;
  }
);

onMounted(() => {
  realtimeChannel = client
    .channel("public:notes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notes" },
      () => refreshNotes()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>

<template>
  <ul class="grid grid-cols-2 gap-4 md:grid-cols-4">
    <li v-for="note in notes" :key="note.id">
      <NuxtLink :to="'/notes/' + note.id">
        <div class="p-4 rounded-xl border cursor-pointer h-full">
          <p class="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
            {{ note.title }}
          </p>

          <p class="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {{ note.body }}
          </p>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>
