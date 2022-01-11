const auth = {
  template: `
    <form  @submit.prevent="submit(userData)">
      <div class="form-row align-items-center">
        <div class="col-auto">
          <input v-model="userData.username" type="email" class="form-control" placeholder="Email">
        </div>
        <div class="col-auto">
          <input v-model="userData.token" type="password" class="form-control" placeholder="Token">
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  `,

  setup() {
    const userData = reactive({
      username: 'gio.elektronikk@gmail.com',
      token: ref('')
    });

    const submit = async (data) => {
      store.init(data);
    };

    return {
      userData,
      submit
    };
  }
};

createApp(auth).mount("#auth");