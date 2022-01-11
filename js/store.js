const store = {
  state: reactive({
    username: null,
    token: null,
    ws: null,
    ghosts: [],
    selectedGhost: null,
    ghostStatus: {},
    temperature: null,
    humidity: null
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

  setGhosts(newValue) {
    this.state.ghosts = newValue;
  },

  setGhostStatus(newValue) {
    this.state.ghostStatus = Object.assign({}, newValue);
  },

  setSelectedGhost(newValue) {
    this.state.selectedGhost = newValue;
  },

  setTemperature(newValue) {
    this.state.temperature = newValue;
  },

  setHumidity(newValue) {
    this.state.humidity = newValue;
  },

  async init({ username, token }) {
    this.setUsername(username);
    this.setToken(token);

    await this.getGhosts();
    const serviceGhosts = this.state.ghosts.find(ghost => ghost.service === "warehouse");
    if (serviceGhosts) {
      const { ghostID } = serviceGhosts;
      store.initiateWS(ghostID);
      await store.getGhostStatus(ghostID);
    }
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
        SENSOR_ID,
        SENSOR_TIME,
        SENSOR_TEMP,
        SENSOR_HUM,
      } = RTW;

      console.log(RTW);

      if (SENSOR_TEMP) this.setTemperature(SENSOR_TEMP);
      if (SENSOR_HUM) this.setHumidity(SENSOR_HUM);

      const myDiv = document.getElementById('logs');
      const isScrolled = myDiv.scrollTop == myDiv.scrollHeight - myDiv.offsetHeight;
      myDiv.innerHTML += `<p>[${SENSOR_TIME}] Sensor ID: ${SENSOR_ID} -- Temp: ${SENSOR_TEMP} -- Hum: ${SENSOR_HUM}</p>`;
      if(isScrolled) {
        myDiv.scrollTop = myDiv.scrollHeight;
      };
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
}