const THROTTLE = document.getElementById("throttle")
const BREAK = document.getElementById("break")
const GEAR = document.getElementById("gear")
const SPEED = document.getElementById("speed")
const INCIDENT = document.getElementById("playerCarMyIncidentCount")
const SESSION_TIME = document.getElementById("sessionTime")
const TOTAL_LAPS = document.getElementById("sessionLapsTotal")

setInterval(UpdateDeltaTime, 0.1);

async function UpdateDeltaTime() {
  const pedals = JSON.parse(await api.getCurrentDeltaTime("pedals"));

  const break_ = pedals.break;
  const throttle = pedals.throttle;
  const gear = pedals.gear[0];
  const speed = pedals.speed;
  const incidentCount = pedals.playerCarMyIncidentCount;
  const totalLaps = pedals.sessionLapsTotal;
  const remainLaps = pedals.sessionLapsRemainEx;
  const sessionTime = pedals.sessionTime;

  BREAK.style.height = `${break_.toFixed(2) * 100}%`;
  THROTTLE.style.height = `${throttle.toFixed(2) * 100}%`;
  
  if (gear == -1)
    GEAR.innerText = "R";
  else if (gear === 0) 
    GEAR.innerText = "N";
  else 
    GEAR.innerText = gear;

  const timeConverted = {
    minutes: sessionTime.toFixed(0) / 60,
    seconds: sessionTime.toFixed(0) % 60
  }

  SPEED.innerText = `${(121 * speed.toFixed(0)/34).toFixed(0)} km/h`;
  INCIDENT.innerText = `x${incidentCount}`;
  SESSION_TIME.innerText = `${timeConverted.minutes.toFixed(0)}:${timeConverted.seconds.toFixed(0)}`;
  TOTAL_LAPS.innerText = `${remainLaps}/${totalLaps}`
}