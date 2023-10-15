// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["nuxt-quasar-ui"],
  quasar: {
    plugins: ["Dialog", "Notify"],
  },
  watch: ["server/api/upload.js"],
});
