const serviceGhosts = {
  template: `
    <button
      v-if="serviceGhosts.length >= 1"
      class="btn btn-sm btn-block"
      v-for="({ domain, service, ghostID }, index) in serviceGhosts"
      :key="index"
      :class="[ ghostID === selectedGhost ? 'btn-success' : 'btn-light' ]"
      @click="changeServiceGhost(ghostID)"
    >
      ID: {{ ghostID }}
    </button>
    <p v-else>You don't have any service instances</p>
  `,
  setup() {
    const ghosts = computed(() => store.state.ghosts);
    const serviceGhosts = computed(() => ghosts.value.filter(ghost => ghost.service === "warehouse"));
    const selectedGhost = computed(() => store.state.selectedGhost);

    const changeServiceGhost = async (ghostID) => {
      store.closeWS();
      store.resetChart(myLineChart);
      store.initiateWS(ghostID);
      await store.getGhostStatus(ghostID);
    };

    return {
      serviceGhosts,
      selectedGhost,
      changeServiceGhost
    }
  }
}

createApp(serviceGhosts).mount("#serviceGhosts");