# [Dashboard demo](https://norniras.github.io/dashboard-demo/)
This demo is for demonstration of basic features of RTW. To send data use 
[Dashboard demo sensor](https://norniras.github.io/dashboard-demo-sensor/).
All service/ghost manipulations can be done on [CIOTY](https://domain.cioty.com/).

## Service Setup

Create two services for this example: "sensors" and "warehouse".

### Sensors service

#### Schema

- ID will be unique for each sensor installed.
- TEMP is temperature readings.
- HUM is humidity readings.

```
<RTW>
<ID></ID>
<TEMP></TEMP>
<HUM></HUM>
</RTW>
```

#### Ghosts

The ghosts of this service will send data that we defined above into the system. For this example we need 3 ghosts with ID's 1, 2 and 3.

### Warehouse service

#### Schema

This service will have the same schema as the "sensors" service but we need to add links to the "sensors" service.*@domain/service#dataElement@* is a link. This way the "warehouse" service will receive data from the "sensors" service.

```
<RTW>
<ID>@DEMO/SENSORS#ID@</ID>
<TEMP>@DEMO/SENSORS#TEMP@</TEMP>
<HUM>@DEMO/SENSORS#HUM@</HUM>
</RTW>
```

#### Ghosts

The ghosts of this service will receive data from the "sensors" service ghosts. For this example we need 2 ghosts with ID's 1, 2.

## Demo Setup

At this point we should have:

1. Service "sensors"
  - Ghost 1
  - Ghost 2
  - Ghost 3

2. Service "warehouse"
  - Ghost 1
  - Ghost 2

3. "warehouse" linking to "sensors"

Now we need to connect ghosts to each other and define sensors for each of the warehouses. To connect sensors to each of the warehouses we need to "Add Morphed Ghosts to warehouse ghosts. We will add ghosts 1 and 2 of "sensors" service to ghost 1 of "warehouse" service and ghost 3 to ghost 2.
 
In this example we can say that warehouse 1 is bigger than warehouse 2 and it needs more sensors to cover the space. When we open a channel for warehouse 1 we will receive data only from sensors 1 and 2, and warehouse 2 will receive data only from sensor 3. We can easily add more ghosts to each service and change relations in the existing setup.
 
Now if the sensor will send data we will see it on our dashboard.

## Technology used
[VueJS](https://v3.vuejs.org/) - Easy to use front-end framework.

[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - Used to receive data from RTW.