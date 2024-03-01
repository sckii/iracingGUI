

setInterval(UpdateDeltaTime, 2000);

async function UpdateDeltaTime() {
  const deltaTime = JSON.parse(await api.getCurrentDeltaTime("deltaTime"));
}