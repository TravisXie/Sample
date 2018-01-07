'use strict'

import { app, BrowserWindow } from 'electron'
const Store = require('electron-store')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let loginWindow
// let fileName = require('path').join(__dirname, '../renderer/data') + 'appdata'
const store = new Store({name: 'data'})

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // 创建主窗口
  creatMainWindow()
  // 如果 没有 appCode 就显示登录界面
  if (!store.get('appCode') && mainWindow.isVisible()) {
    console.log('regain appCode')
    mainWindow.hide() // 先隐藏主界面
    // 捕获登录界面的回调
    creatLoginWindow((event, oldUrl, newUrl, isMainFrame) => {
      console.log(oldUrl)
      let code = getAllUrlParam(newUrl).code
      store.set('appCode', code)
      if (!mainWindow.isVisible() && store.get('appCode')) {
        // 显示主界面
        mainWindow.show()
        // 关闭登录窗口
        loginWindow.close()
      }
    })
  } else {
    // 如果已经包含 appCode 则直接显示主界面
    if (loginWindow) loginWindow.close()
    mainWindow.show()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (loginWindow === null) {
    createWindow()
  }
})

function creatLoginWindow (redirectCallBack) {
  if (!loginWindow) {
    loginWindow = new BrowserWindow({ width: 400, height: 320, resizable: false })
    loginWindow.on('close', function () { loginWindow = null })
    loginWindow.loadURL(`https://api.weibo.com/oauth2/authorize?client_id=53257873&redirect_uri=https://api.weibo.com/oauth2/default.html&display=client`)
    loginWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl, isMainFrame) {
      if (redirectCallBack && typeof (redirectCallBack) === 'function') {
        redirectCallBack(event, oldUrl, newUrl, isMainFrame)
      }
    })
  }
}

function creatMainWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 563,
    useContentSize: true,
    show: false,
    frame: false,
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function getAllUrlParam (url) {
  // 从url(可选)或window对象获取查询字符串
  var queryString = url
    ? url.split('?')[1]
    : window.location.search.slice(1)
  // 我们把参数保存在这里
  var obj = {}
  // 如果查询字符串存在
  if (queryString) {
    // 查询字符串不包含#后面的部分，因此去掉它
    queryString = queryString.split('#')[0]
    // 把查询字符串分割成各部分
    var arr = queryString.split('&')
    for (var i = 0; i < arr.length; i++) {
      // 分离出key和value
      var a = arr[i].split('=')
      // 考虑到这样的参数：list[]=thing1&list[]=thing2
      var paramNum
      var paramName = a[0].replace(/\[\d*\]/, function (v) {
        paramNum = v.slice(1, -1)
        return ''
      })
      // 设置参数值（如果为空则设置为true）
      var paramValue = typeof a[1] === 'undefined' ? true : a[1]
      // （可选）保持大小写一致
      paramName = paramName.toLowerCase()
      paramValue = paramValue.toLowerCase()
      // 如果参数名已经存在
      if (obj[paramName]) {
        // 将值转成数组（如果还是字符串）
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]]
        }
        // 如果没有指定数组索引
        if (typeof paramNum === 'undefined') {
          // 将值放到数组的末尾
          obj[paramName].push(paramValue)
        } else {
          // 如果指定了数组索引
          // 将值放在索引位置
          obj[paramName][paramNum] = paramValue
        }
      } else {
        // 如果参数名不存在则设置它
        obj[paramName] = paramValue
      }
    }
  }
  return obj
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
