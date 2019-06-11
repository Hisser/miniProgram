let App = getApp();

Page({
	data: {
    tabCurIndex: 0,
    isCanLoading: false,
    pageNo: 1,
    hasmore: true,
    orderList:[],
    scrollHeight:1000,
    userId:null,
	},

	onLoad: function (options) {
		let _this = this;
    if (App.globalData.userInfo){
      _this.setData({
        userId: App.globalData.userInfo.userId
      });
    }

    _this.getOrderList(1);

    _this.setListHeight();
	},

  /**
     * 设置商品列表高度
     */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight * 750 / res.windowWidth - 78,
        });
      }
    });
  },


  getOrderList: function (pageNo) {
		let _this = this;
    
    let data = {
      service: 'queryMiniOrderList',
      state: _this.data.tabCurIndex,
      pageNo: pageNo,
      pageSize:10,
    };

    App.fetchPost(data, function (result) {
      if (result.code === 1) {
        let allData = _this.data.orderList;

        for (let i = 0; i < result.data.length; i++) {
          result.data[i].orderTime = form_time(result.data[i].createOrderTime);
          if (result.data[i].tradeStatus===1){
            result.data[i].tradeStatus = "待付款";
          } else if (result.data[i].tradeStatus === 2){
            result.data[i].tradeStatus = "已付款";
          } else if (result.data[i].tradeStatus === 3 || result.data[i].tradeStatus === 4 ) {
            result.data[i].tradeStatus = "已失效";
          } else if (result.data[i].tradeStatus === 5) {
            result.data[i].tradeStatus = "已完成";
          } else if (result.data[i].tradeStatus === 6) {
            result.data[i].tradeStatus = "已补贴";
          }

          allData.push(result.data[i]);
        }

        _this.setData({
          orderList: allData,
          hasmore: result.hasNextPage,
          isCanLoading:true,
        });
      }else{
        _this.setData({
          orderList: [],
          hasmore: false,
          isCanLoading: true,
        });
      }
    });

    function form_time(a) {
      let myDate = new Date(parseInt(a) * 1000);
      let datestr = "";
      datestr = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
      datestr = datestr + "-" + (myDate.getMonth() + 1);       //获取当前月份(0-11,0代表1月)
      datestr = datestr + "-" + myDate.getDate();        //获取当前日(1-31)
      return datestr;
    }
	},

	//事件处理函数
	tabFun: function (e) {
		let _this = this;
		//获取触发事件组件的dataset属性  
		let _datasetId = e.target.dataset.id;
		this.setData({
      tabCurIndex: _datasetId,
      isCanLoading: false,
      orderList: [],
      page: 1,
		});

		// 切换模式
		this.getOrderList(1);
	},


	/**
	 * 页面上拉触底事件的处理函数
	 */
  bindDownLoad: function () {
		let _this = this;
    if (_this.data.hasmore){
      let page = _this.data.pageNo + 1;
      _this.setData({ page: page, isCanLoading: false });
      this.getOrderList(page);
		}
	},

})
