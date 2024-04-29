// pages/login/index.js
Page({
  data: {
    auth: '',
  },

  auth: 'dzznc',

  onLogin: function () {
    wx.showLoading({ mask: true, title: '认证中' })
    setTimeout(() => {
      if (this.data.auth !== this.auth) {
        wx.showToast({ mask: true, title: '认证失败', icon: 'error' })
      } else {
        wx.hideLoading()
        wx.redirectTo({ url: '/pages/index/index' })
      }
    }, 500)
  },
})
