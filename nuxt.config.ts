// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/eslint-module", "@element-plus/nuxt"],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
});
