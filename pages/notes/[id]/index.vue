<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

const user = useSupabaseUser();

watchEffect(() => {
  if (!user.value) {
    navigateTo("/notes");
  }
});
</script>

<template>
  <div class="grid place-items-center min-h-screen px-6">
    <UpdateNoteForm :noteId="id" class="max-w-lg" />
  </div>
</template>
