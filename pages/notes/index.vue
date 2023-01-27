<script setup lang="ts">
const user = useSupabaseUser();

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
  <div class="px-4 max-w-4xl mx-auto py-12 flex flex-col gap-8">
    <section class="max-w-lg mx-auto w-full">
      <CreateNoteForm />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="font-bold">Pinned</h2>
      <Notes :userId="user.id" pinned />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="font-bold">Notes</h3>
      <Notes :userId="user.id" />
    </section>
  </div>
</template>
