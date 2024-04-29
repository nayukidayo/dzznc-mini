// index.js
import { merge, setStatus, getStatus } from '../../utils/util.js'

Page({
  data: {
    tab: 'sv1',
    mode: 'local',
    items: [],
    checked: 0,
  },

  onShow() {
    wx.hideHomeButton()
    this.handleGetStatus()
  },

  onHide() {
    this.req?.abort()
    clearInterval(this.si)
  },

  onTabChange(e) {
    this.setData({ tab: e.detail.name, items: [], checked: 0 })
    this.handleGetStatus()
  },

  onAllClick: function () {
    const items = this.data.items.map(v => ({ ...v, checked: true }))
    this.setData({ items, checked: items.length })
  },

  onAllCancelClick: function () {
    const items = this.data.items.map(v => ({ ...v, checked: false }))
    this.setData({ items, checked: 0 })
  },

  onItemSelect: function (e) {
    const index = e.mark.index
    const coil = this.data.items[index]
    let checked
    if (coil.checked) {
      checked = this.data.checked - 1
    } else {
      checked = this.data.checked + 1
    }
    this.setData({ [`items[${index}].checked`]: !coil.checked, checked })
  },

  onOpenClick: function () {
    this.handleSetStatus(1)
  },

  onCloseClick: function () {
    this.handleSetStatus(0)
  },

  handleGetStatus() {
    this.onHide()
    wx.showLoading({ mask: true, title: '加载中' })
    getStatus(this.data.tab, (err, result) => {
      if (err || !result) {
        wx.showToast({ mask: true, title: '加载失败', icon: 'error' })
      } else {
        this.setData({
          mode: result.mode,
          items: merge(this.data.tab, result.coils, this.data.items),
        })
        wx.hideLoading()
      }
      this.repeatGetStatus()
    })
  },

  repeatGetStatus() {
    this.si = setInterval(() => {
      this.req?.abort()
      this.req = getStatus(this.data.tab, (err, result) => {
        if (err || !result) return
        this.setData({
          mode: result.mode,
          items: merge(this.data.tab, result.coils, this.data.items),
        })
      })
    }, 3e3)
  },

  handleSetStatus(status) {
    if (this.data.checked === 0) return
    wx.showLoading({ mask: true, title: '执行中' })
    const data = { tab: this.data.tab }
    if (this.data.tab === 'pump') {
      data.coils = this.data.items.map(v => Number(v.checked))
      data.status = status
    } else {
      data.coils = this.data.items.map(v => (v.checked ? status : v.status))
    }
    setStatus(data, err => {
      if (err) {
        wx.showToast({ mask: true, title: '执行失败', icon: 'error' })
      } else {
        wx.showToast({ mask: true, title: '执行成功' })
      }
    })
  },
})
