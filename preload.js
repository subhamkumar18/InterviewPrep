// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("interviewAI", {
//   health: () => ipcRenderer.invoke("health"),
//   askAI: (question) => ipcRenderer.invoke("ask-ai", question)
// });

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("interviewAI", {
  // Backend health
  health: () => {
    return ipcRenderer.invoke("health");
  },

  // Interview AI
  askAI: (question) => {
    return ipcRenderer.invoke("ask-ai", question);
  },

  // ChatGPT browser
  chatGPT: {
    show: () => {
      return ipcRenderer.invoke("chatgpt:show");
    },

    hide: () => {
      return ipcRenderer.invoke("chatgpt:hide");
    },

    navigate: (url) => {
      return ipcRenderer.invoke("chatgpt:navigate", url);
    },

    back: () => {
      return ipcRenderer.invoke("chatgpt:back");
    },

    forward: () => {
      return ipcRenderer.invoke("chatgpt:forward");
    },

    reload: () => {
      return ipcRenderer.invoke("chatgpt:reload");
    },

    getURL: () => {
      return ipcRenderer.invoke("chatgpt:url");
    }
  }
});