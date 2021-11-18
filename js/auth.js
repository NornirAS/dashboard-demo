const auth = {
  template: `
    <form  @submit.prevent="submit(username, token)">
      <div class="form-row align-items-center">
        <div class="col-auto">
          <input v-model="username" type="text" class="form-control" placeholder="Email">
        </div>
        <div class="col-auto">
          <input v-model="token" type="text" class="form-control" placeholder="Token">
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  `,

  setup() {
    const username = ref(null);
    const token = ref(null);
    const ghosts = computed(() => store.state.ghosts);
    const serviceGhosts = computed(() => ghosts.value.filter(ghost => ghost.service === "warehouse"));

    const submit = async (username, token) => {
      store.setUsername(username);
      store.setToken(token);

      await store.getGhosts();
      if (serviceGhosts.value.length >= 1) {
        const { ghostID } = serviceGhosts.value[0]
        store.initiateWS(ghostID);
        await store.getGhostStatus(ghostID);
      }
    }

    return {
      username,
      token,
      submit
    }
  }
};

createApp(auth).mount("#auth");