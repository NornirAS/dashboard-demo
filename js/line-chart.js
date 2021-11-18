let ctx = document.getElementById("myLineChart");
let myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          unit: 'second',
          stepSize: 5,
          minUnit: 6000
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
        ticks: {
          beginAtZero: true,
          max: 60,
          min: -40,
          callback: function(value, index, values) {
            return value + '°C';
          }
        }
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          callback: function(value, index, values) {
            return value + '%';
          }
        }
      }]
    }
  }
});