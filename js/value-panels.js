const dashboard = {
  setup() {
    const averageTemp = computed(() => {
      let array = [];
      for (const key in store.state.data) {
        const temp = store.state.data[key].temperature.map(item => {
          return item.y;
        });
        array = array.concat(temp);
      };
      return arrayAverage(array);
    });
    const averageHum = computed(() => {
      let array = [];
      for (const key in store.state.data) {
        const hum = store.state.data[key].humidity.map(item => {
          return item.y;
        });
        array = array.concat(hum);
      };
      return arrayAverage(array);
    });

    const arrayAverage = (array) => {
      const sum = array.reduce((a, b) => a + b, 0);
      const avg = (sum / array.length) || 0;
      return Number(avg.toFixed(1));
    };

    return {
      averageTemp,
      averageHum
    };
  }
}

createApp(dashboard).mount('#value-panels');