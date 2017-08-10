//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showTopTips: false
  },
  getUserInfo: function () {
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true,
        showTopTips: false
      })
    }
    app.slogin()
  },
  submitForm: function () {
    var that = this
    if (that.data.hasUserInfo) {
      wx.navigateTo({
        url:'/pages/form/index'
      })
    } else {
      that.setData({
        showTopTips: true
      })
    }
  },
  onLoad: function (e) {
    var that = this
    if (wx.getStorageSync('Cookie')) {
      wx.getUserInfo({
        success: function (res) {
          console.log('user_info', res)
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            showTopTips: false
          })
        }
      })
    }
  }
})