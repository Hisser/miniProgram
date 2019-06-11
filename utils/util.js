const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const judgeNull = value => {
  if (value == null || value == undefined) return true
  if (this.judgeString(value)) {
    if (value.trim().length == 0) return true
  } else if (this.judgeArray(value)) {
    if (value.length == 0) return true
  } else if (this.judgeObject(value)) {
    for (let name in value) return false
    return true
  }
  return false;
}

const judgeNumber = value => {
  return value != null && value != undefined && value.constructor == Number
}

/*获取当前页url*/
const getCurrentPageUrl = () => {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
const getCurrentPageUrlWithArgs = () => {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

const searchStore = id => {
  var result = {};
  var stores = getStores();
  for (let i = 0; i < stores.length; i++) {
    let store = stores[i]
    if (store.storeId == id) {
      result = store
      break;
    }
  }
  return result || {}
} 

function getStores(){
  var stores = [
    {
      "storeId": 1,
      "storeName": "悦子街1",
      "logo": "http://oss.yuezijie.cn/public/yuezijie_logo.png?x-oss-process=style/logo"
    },
    {
      "storeId": 2,
      "storeName": "悦子街2",
      "logo": "http://oss.yuezijie.cn/public/yuezijie_logo.png?x-oss-process=style/logo"
    }
  ]
  return stores;
}

const getParamsObj = search => {
  var params = search.split("_");
  var paramsObjStr = '{'
  for (var i = 0; i < params.length; i++) {
    var key = params[i].split("=")[0];
    var value = params[i].split("=")[1];
    if (i == 0) {
      paramsObjStr += '"' + key + '":"' + value + '"';
    } else {
      paramsObjStr += ',"' + key + '":"' + value + '"';
    }
  }
  paramsObjStr += '}';
  return JSON.parse(paramsObjStr)
}

module.exports = {
  formatTime: formatTime,
  judgeNull: judgeNull,
  judgeNumber: judgeNumber,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  searchStore: searchStore,
  getParamsObj: getParamsObj
}
