// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "notebook",
      titleTemplate: "notebook - %s",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      meta: [
        {
          name: "description",
          content: "note taking app",
        },
      ],
    },
  },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],
});
