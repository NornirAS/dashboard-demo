const store = {
  state: reactive({
    username: null,
    token: null,
    ws: null,
    id: null,
    data: {},
    ghosts: [],
    selectedGhost: null,
    ghostStatus: {}
  }),

  setUsername(newValue) {
    this.state.username = newValue;
  },

  setToken(newValue) {
    this.state.token = newValue;
  },

  setWS(newValue) {
    this.state.ws = newValue;
  },

  removeWS() {
    this.state.ws = null;
  },

  setDataObject(id) {
    if (!this.state.data[id]) {
      this.state.data[id] = {
        time: null,
        temperature: [],
        humidity: []
      };
    }
  },

  removeData() {
    this.state.data = {};
  },

  setId(id) {
    this.state.id = id;
  },

  setTime({ id, time }) {
    this.state.data[id].time = time;
  },

  setTemperature({ id, temp }) {
    this.state.data[id].temperature.push({ x: new Date(), y: temp });
    const firstElemTime = this.state.data[id].temperature[0].x.getTime();
    const now = Date.now();
    const isOld = now - firstElemTime > 60_000;
    if (isOld) {
      this.state.data[id].temperature.shift();
    }
  },

  setHumidity({ id, hum }) {
    this.state.data[id].humidity.push({ x: new Date(), y: hum });
    const firstElemTime = this.state.data[id].humidity[0].x.getTime();
    const now = Date.now();
    const isOld = now - firstElemTime > 60_000;
    if (isOld) {
      this.state.data[id].humidity.shift();
    }
  },

  setGhosts(newValue) {
    this.state.ghosts = newValue;
  },

  setGhostStatus(newValue) {
    this.state.ghostStatus = Object.assign({}, newValue);
  },

  setSelectedGhost(newValue) {
    this.state.selectedGhost = newValue;
  },

  async getGhosts() {
    const data = {
      url: "https://demo.cioty.com/",
      token: this.state.token
    };
    const res = await fetch("https://synx-hive-api.herokuapp.com/api/ghosts", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const ghosts = await res.json();
    this.setGhosts(ghosts);
  },

  async getGhostStatus(ghostID) {
    const data = {
      url: "https://demo.cioty.com/warehouse",
      token: this.state.token,
      username: this.state.username,
      ghostID
    };
    const res = await fetch("https://synx-hive-api.herokuapp.com/api/ghosts/status", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const ghostStatus = await res.json();
    this.setGhostStatus(ghostStatus);
    this.setSelectedGhost(ghostID);
  },

  initiateWS(ghostID) {
    const ws = new WebSocket(`wss://websocket.cioty.com/demo/warehouse/${ghostID}/channel`);
    this.getData(ws);
  },

  getData(ws) {
    /**
     * Websocket connection
     * Receive data from RTW and do something with it
     */

    this.setWS(ws);

    ws.onopen = (e) => {
      console.log("[open] Connection established");
      console.log("Sending to server");
      ws.send(JSON.stringify({
        token: this.state.token
      }));
    };

    ws.onmessage = ({ data }) => {
      const { RTW } = JSON.parse(data);
      const {
        ID: id,
        TIME: time,
        TEMP: temp,
        HUM: hum,
      } = RTW;

      if (id) {
        this.setId(id);
        this.setDataObject(id);
      }

      if (time) {
        this.setTime({ id, time });
      }

      if (typeof temp === "number") {
        this.setTemperature({ id, temp });
        const data = [...this.state.data[id].temperature];
        this.updateChart(myLineChart, data, "Temperature", id);
      }

      if (typeof hum === "number") {
        this.setHumidity({ id, hum });
        const data = [...this.state.data[id].humidity];
        this.updateChart(myLineChart, data, "Humidity", id);
      }
    };

    ws.onclose = (e) => {
      if (e.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
      } else {
        console.log("[close] Connection died");
      }
    };

    ws.onerror = (error) => {
      console.log(`[error] ${error.message}`);
    };
  },

  closeWS() {
    this.state.ws.close();
    this.removeWS();
  },

  /**
   * Update the chart with new incomming data.
   * @param {chartJS} chart chart.js instance
   * @param {Array} data integer
   * @param {String} label of dataset to update
   */
  updateChart(chart, data, label, id) {
    const dataset = chart.data.datasets.filter(dataset => dataset.label === `${label} ${id}`);
    const colors = {
      temperature: [
        {
          backgroundColor: 'rgba(231,74,59)',
          borderColor: 'rgba(231,74,59)'
        },
        {
          backgroundColor: 'rgba(246,194,62)',
          borderColor: 'rgba(246,194,62)'
        },
        {
          backgroundColor: 'rgba(28,200,138)',
          borderColor: 'rgba(28,200,138)'
        }
      ],
      humidity: [
        {
          backgroundColor: 'rgba(78,115,223, 0.6)',
          borderColor: 'rgba(78,115,223)',
        },
        {
          backgroundColor: 'rgba(188,223,78, 0.6)',
          borderColor: 'rgba(188,223,78)'
        },
        {
          backgroundColor: 'rgba(223,114,78, 0.6)',
          borderColor: 'rgba(223,114,78)'
        }
      ]
    };
    if (dataset.length >= 1) {
      dataset[0].data = data;
      chart.update();
    } else {
      switch (label) {
        case 'Temperature':
          chart.data.datasets.push({
            label: `${label} ${id}`,
            type: 'line',
            data,
            yAxisID: 'A',
            fill: false,
            backgroundColor: colors.temperature[id - 1].backgroundColor,
            borderColor: colors.temperature[id - 1].borderColor,
            borderWidth: 3
          });
          break;
        case 'Humidity':
          chart.data.datasets.push({
            label: `${label} ${id}`,
            type: 'bar',
            data,
            yAxisID: 'B',
            backgroundColor: colors.humidity[id - 1].backgroundColor,
            borderColor: colors.humidity[id - 1].borderColor,
            borderWidth: 1
          });
          break;
      }
      chart.update();
    }
  },
  resetChart(chart) {
    this.removeData();
    chart.data.datasets = [];
    chart.update();
  }
}