const dashboard = {
  setup() {
    const temperature = computed(() => store.state.temperature);
    const humidity = computed(() => store.state.humidity);

    return {
      temperature,
      humidity
    };
  }
}

createApp(dashboard).mount('#value-panels');