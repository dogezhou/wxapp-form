//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    api_key: null,
    form: {},

    showTopTips: false,

    radioItems: [
        {name: 'cell standard', value: '0'},
        {name: 'cell standard', value: '1', checked: true}
    ],
    checkboxItems: [
        {name: 'standard is dealt for u.', value: '0', checked: true},
        {name: 'standard is dealicient for u.', value: '1'}
    ],

    date: "2016-09-01",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 0,

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },
  get_form: function (formId) {
    var that = this
    console.log('formId', formId)
    console.log(`wx.getStorageSync('danluUrl')`, wx.getStorageSync('danluUrl'))
    console.log(`wx.getStorageSync('apiKey')`, wx.getStorageSync('apiKey'))
    console.log(`wx.getStorageSync('username')`, wx.getStorageSync('username'))
    // wx.getStorageSync('username')
    wx.request({
      url: wx.getStorageSync('danluUrl') + '/store/api/v1/form/' + formId,
      data: {
        api_key: wx.getStorageSync('apiKey'),
        username: wx.getStorageSync('username')
      },
      success: function(res) {
        console.log('res', res)
        that.setData({
          form: res.data
        })
      }
    })
  },
  bindSave: function(e) {
    console.log('submit e', e)
    var that = this
    var data = e.detail.value
    wx.request({
      url: 'https://' + wx.getStorageSync('domain') + '/capi/v1/user_formdata/save_formdata',
      header: {
        Cookie: wx.getStorageSync('Cookie')
      },
      data: {
        formid: that.data.form.id,
        data: data
      },
      method: 'POST',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
             wx.navigateTo({
                url:'/pages/user/index'
              })
            }
          }
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this

    wx.getExtConfig({
      success: function (res) {
        console.log('res.extConfig', res.extConfig)
      }
    })
    // 获取 formId
    console.log('get form')
    var scene = decodeURIComponent(options.scene)
    if (typeof scene == 'undefined') {
      console.log('scene', scene)
      that.get_form(scene)
    } else {
      // 171 线上 11052
      console.log('form 11052')
      that.get_form(171)
    }
  },

  showTopTips: function(){
      var that = this;
      this.setData({
          showTopTips: true
      });
      setTimeout(function(){
          that.setData({
              showTopTips: false
          });
      }, 3000);
  },
  radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
          radioItems: radioItems
      });
  },
  checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value);

      var checkboxItems = this.data.checkboxItems, values = e.detail.value;
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false;

          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
              if(checkboxItems[i].value == values[j]){
                  checkboxItems[i].checked = true;
                  break;
              }
          }
      }

      this.setData({
          checkboxItems: checkboxItems
      });
  },
  bindDateChange: function (e) {
      this.setData({
          date: e.detail.value
      })
  },
  bindTimeChange: function (e) {
      this.setData({
          time: e.detail.value
      })
  },
  bindCountryCodeChange: function(e){
      console.log('picker country code 发生选择改变，携带值为', e.detail.value);

      this.setData({
          countryCodeIndex: e.detail.value
      })
  },
  bindCountryChange: function(e) {
      console.log('picker country 发生选择改变，携带值为', e.detail.value);

      this.setData({
          countryIndex: e.detail.value
      })
  },
  bindAccountChange: function(e) {
      console.log('picker account 发生选择改变，携带值为', e.detail.value);

      this.setData({
          accountIndex: e.detail.value
      })
  },
  bindAgreeChange: function (e) {
      this.setData({
          isAgree: !!e.detail.value.length
      });
  }
})
