const origin = 'https://test.nayuki.top:37211'

export function merge(tab, coils, items) {
  const flag = coils.length === items.length
  return coils.map((v, i) => {
    let name
    switch (tab) {
      case 'sv1':
        name = `${i + 1}号棚`
        break
      case 'sv2':
        name = `${i + 28}号棚`
        break
      default:
        name = `${i + 1}号泵`
        break
    }
    return { name, status: v, checked: flag && items[i].checked }
  })
}

export function setStatus(data, cb) {
  wx.request({
    url: `${origin}/api/status`,
    method: 'POST',
    header: { Authorization: 'nayukidayo' },
    data,
    fail: cb,
    success: res => {
      if (res.statusCode !== 200) return cb(res.statusCode)
      cb(null)
    },
  })
}

export function getStatus(tab, cb) {
  return wx.request({
    url: `${origin}/api/status`,
    method: 'GET',
    header: { Authorization: 'nayukidayo' },
    data: { tab },
    fail: cb,
    success: res => {
      if (res.statusCode !== 200) return cb(res.statusCode)
      cb(null, res.data)
    },
  })
}
