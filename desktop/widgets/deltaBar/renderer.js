const DELTA_TIME_BAR = document.getElementById("bar")
const DELTA_TIME = document.getElementById("time")

setInterval(UpdateDeltaTime, 0.1);

async function UpdateDeltaTime() {
  const deltaTime = JSON.parse(await api.getCurrentDeltaTime("deltaTime"));
  const deltaRate = deltaTime.lapDeltaToSessionBestLapDD;

  const delta = deltaTime.lapDeltaToSessionBestLap < 0 ? 
    -1 * deltaTime.lapDeltaToSessionBestLap : deltaTime.lapDeltaToSessionBestLap;
  const deltaPercentage = (1 * (delta > 1 ? 1 : delta)) / 1;

  const red = `rgb(${
      255
    },${
      255 - (255 * deltaPercentage) 
    },${
      255 - (255 * deltaPercentage) 
    })`
  
  const green = `rgb(${
    255 - (255 * deltaPercentage) 
  },${
    255
  },${
    255 - (255 * deltaPercentage) 
  })`

  DELTA_TIME.innerText = (deltaTime.lapDeltaToSessionBestLap > 0 ? "+" : "") + deltaTime.lapDeltaToSessionBestLap.toFixed(2)
  DELTA_TIME.style.color = deltaTime.lapDeltaToSessionBestLap < 0 ? green : red;
  DELTA_TIME_BAR.style.backgroundColor = deltaRate < 0 ? green : red;

  if (deltaTime.lapDeltaToSessionBestLap === 0) {
    DELTA_TIME_BAR.style.left = "50%"
    DELTA_TIME_BAR.style.right = "50%"
    DELTA_TIME_BAR.style.width = "0%"
  }
  
  DELTA_TIME_BAR.style.width = `${deltaPercentage.toFixed(2) * 100}%`
  DELTA_TIME_BAR.style.marginLeft = deltaTime.lapDeltaToSessionBestLap > 0 ? 
  `${-1 * deltaPercentage.toFixed(2) * 100}%` : `${deltaPercentage.toFixed(2) * 100}%`;

}