import merge from '/utils/deepmerge'

//app.js
App({
  onLaunch: function() {
    this.setStorage()
  },

  getContext: function () {
    var that = this
    const contextKeyList = ['company', 'siteuser', 'qiniu', 'weixinuser', 'capi']
    let keys = contextKeyList.join(',')
    wx.request({
      url: wx.getStorageSync('companyUrl') + '/capi/v1/contexters/get_contexters?keys=' + keys,
      header: {
        Cookie: wx.getStorageSync('Cookie')
      },
      success: function (res) {
        that.globalData.CONTEXTERS = res
        console.log('that.globalData.CONTEXTERS', that.globalData.CONTEXTERS)
      }
    })
  },

  setStorage: function () {
    let that = this
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log('res.extConfig', res.extConfig)
          let storageData = res.extConfig.storageData
          for (let key in storageData) {
            wx.setStorageSync(key, storageData[key])
          }
          // that.setCookie()
        }
      })
    }
  },

  setCookie: function () {
    // "sessionid": "yl32q4gz1j9h8rdr9u2dm6ccimjajr49",
    // "csrftoken": "1CMuhdrm38xKIr8m5jEPk4wILWhwDcOy",
    let cookieKeys = ['sessionid', 'csrftoken']
    let cookieList = []
    for (let key of cookieKeys) {
      cookieList.push(`${key}=${wx.getStorageSync(key)}`)
    }
    wx.setStorageSync('Cookie', cookieList.join('; '))
  },

  setUserCookie: function (res) {
    var sessionid = /sessionid=(\w*);/.exec(res.header['Set-Cookie'])[1]
    var csrftoken = /csrftoken=(\w*);/.exec(res.header['Set-Cookie'])[1]
    var cookieList = [`sessionid=${sessionid}`, `csrftoken=${csrftoken}`]
    wx.setStorageSync('Cookie', cookieList.join('; '))
  },

  slogin: function () {
    var that = this
    console.log('wx.login')
    wx.login({
      success: function (res) {
        console.log('login', res)
        if (res.code) {
          var code = res.code // 微信登录接口返回的 code 参数，下面注册接口需要用到
          wx.getUserInfo({
            success: function (res) {
              console.log('getUserInfo', res)
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
              var iv = res.iv
              var encryptedData = res.encryptedData
              // 下面开始调用注册接口
              console.log(`wx.getStorageSync('danluUrl')`, wx.getStorageSync('danluUrl'))
              wx.request({
                url: wx.getStorageSync('danluUrl') + '/wechat/wxapp_login',
                data: {code:code,encryptedData:encryptedData,iv:iv}, // 设置请求的 参数
                method: 'GET',
                success: (res) => {
                  console.log('/wechat/wxapp_login', res)
                  wx.hideLoading()
                  that.setUserCookie(res)
                  let contextKeyList = ['company', 'siteuser', 'capi']
                },
                fail: function (res) {
                  console.log('/wechat/wxapp_login fail', res)
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        console.log('wx.login fail', res)
      }
    })
  },

  globalData: {
    userInfo: null,
    CONTEXTERS: {}
  }
})
