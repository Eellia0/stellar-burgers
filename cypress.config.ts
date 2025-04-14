import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // Здесь можно добавить плагины, если нужны
    },
    supportFile: false // Отключаем support.js, если он не используется
  }
});