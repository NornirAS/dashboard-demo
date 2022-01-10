const morphedGhosts = {
  template: `
    <p v-if="morphedGhosts" v-for="(ghost, index) in morphedGhostData">{{ ghost }}</p>
    <p v-else>To get data you need to morph a ghost</p>
  `,
  setup() {
    const morphedGhosts = computed(() => store.state.ghostStatus["Secondary Service"]);

    const morphedGhostData = computed(() => {
      if (morphedGhosts.value) {
        return Object
          .keys(morphedGhosts.value)
          .reverse()
          .map(key => {
            const data = key.split("/");
            return `Domain: ${data[0].toLowerCase()} Service: ${data[1].toLowerCase()} ID: ${data[2]}`;
          })
          .sort();
      }
    });

    return {
      morphedGhosts,
      morphedGhostData
    }
  }
}

createApp(morphedGhosts).mount("#morphedGhosts");