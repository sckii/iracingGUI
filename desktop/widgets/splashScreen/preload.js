const { contextBridge, ipcRenderer } = require("electron")

function requestAPI(path) {
  const url = "http://localhost:8000/" + path;
    
    const res = fetch(url)
      .then(response => response.json())
      .then(data => {
          // Atualizar o conteúdo da página HTML com os dados recebidos
          return data;
      })
      .catch(error => console.error('Erro ao obter dados:', error));
  return res;
}

contextBridge.exposeInMainWorld("api", {
  getCurrentDeltaTime: (path) => requestAPI(path)
})