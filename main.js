const {
  app,
  BrowserWindow,
  WebContentsView,
  ipcMain
} = require("electron");

const path = require("path");

let mainWindow;
let chatGPTView;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 800,
    minHeight: 600,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Prevent Electron window content from appearing in screenshots/screen sharing.
  mainWindow.setContentProtection(true);

  /*
   * ---------------------------------------------------------
   * Main Interview AI UI
   * ---------------------------------------------------------
   */
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  /*
   * ---------------------------------------------------------
   * ChatGPT Browser View
   * ---------------------------------------------------------
   */

  chatGPTView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.contentView.addChildView(chatGPTView);

  // Load ChatGPT
  chatGPTView.webContents.loadURL("https://chatgpt.com/");

  /*
   * Initially hide ChatGPT.
   *
   * Your index.html can later tell Electron when
   * the ChatGPT tab should be visible.
   */
  chatGPTView.setVisible(false);

  /*
   * Resize ChatGPT when Electron window changes size.
   */
  mainWindow.on("resize", () => {
    updateChatGPTBounds();
  });

  mainWindow.on("maximize", () => {
    updateChatGPTBounds();
  });

  mainWindow.on("unmaximize", () => {
    updateChatGPTBounds();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    chatGPTView = null;
  });
}


/*
 * ---------------------------------------------------------
 * Set ChatGPT View Position
 * ---------------------------------------------------------
 */

function updateChatGPTBounds() {
  if (!mainWindow || !chatGPTView) {
    return;
  }

  const [width, height] = mainWindow.getContentSize();

  /*
   * Your sidebar is currently 250px.
   * Your topbar is 58px.
   */

  chatGPTView.setBounds({
    x: 250,
    y: 58,
    width: Math.max(0, width - 250),
    height: Math.max(0, height - 58)
  });
}


/*
 * ---------------------------------------------------------
 * Show ChatGPT
 * ---------------------------------------------------------
 */

ipcMain.handle("chatgpt:show", () => {
  if (!chatGPTView) {
    return { ok: false };
  }

  updateChatGPTBounds();

  chatGPTView.setVisible(true);

  return {
    ok: true
  };
});


/*
 * ---------------------------------------------------------
 * Hide ChatGPT
 * ---------------------------------------------------------
 */

ipcMain.handle("chatgpt:hide", () => {
  if (!chatGPTView) {
    return { ok: false };
  }

  chatGPTView.setVisible(false);

  return {
    ok: true
  };
});


/*
 * ---------------------------------------------------------
 * Navigate ChatGPT
 * ---------------------------------------------------------
 */

ipcMain.handle("chatgpt:navigate", async (_event, url) => {
  if (!chatGPTView) {
    return {
      ok: false,
      error: "ChatGPT view is not available"
    };
  }

  try {
    const parsedUrl = new URL(url);

    /*
     * Only allow ChatGPT.
     *
     * You can expand this later if you want a
     * general-purpose browser.
     */
    if (
      parsedUrl.protocol !== "https:" ||
      !(
        parsedUrl.hostname === "chatgpt.com" ||
        parsedUrl.hostname.endsWith(".chatgpt.com")
      )
    ) {
      return {
        ok: false,
        error: "Only chatgpt.com URLs are allowed"
      };
    }

    await chatGPTView.webContents.loadURL(parsedUrl.toString());

    return {
      ok: true
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
});


/*
 * ---------------------------------------------------------
 * Browser Controls
 * ---------------------------------------------------------
 */

ipcMain.handle("chatgpt:back", () => {
  if (!chatGPTView) {
    return false;
  }

  if (chatGPTView.webContents.canGoBack()) {
    chatGPTView.webContents.goBack();
    return true;
  }

  return false;
});


ipcMain.handle("chatgpt:forward", () => {
  if (!chatGPTView) {
    return false;
  }

  if (chatGPTView.webContents.canGoForward()) {
    chatGPTView.webContents.goForward();
    return true;
  }

  return false;
});


ipcMain.handle("chatgpt:reload", () => {
  if (!chatGPTView) {
    return false;
  }

  chatGPTView.webContents.reload();

  return true;
});


/*
 * ---------------------------------------------------------
 * Get Current ChatGPT URL
 * ---------------------------------------------------------
 */

ipcMain.handle("chatgpt:url", () => {
  if (!chatGPTView) {
    return "";
  }

  return chatGPTView.webContents.getURL();
});


/*
 * ---------------------------------------------------------
 * Backend Health
 * ---------------------------------------------------------
 */

ipcMain.handle("health", async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/health"
    );

    return await response.json();
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
});


/*
 * ---------------------------------------------------------
 * Interview AI
 * ---------------------------------------------------------
 */

ipcMain.handle("ask-ai", async (_event, question) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/interview/answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {
    throw new Error(error.message);
  }
});


/*
 * ---------------------------------------------------------
 * Electron Lifecycle
 * ---------------------------------------------------------
 */

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});