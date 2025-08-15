<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 获取状态栏高度
    const { statusBarHeight } = uni.getSystemInfoSync();
    // 在小程序中设置全局数据，而不是直接操作DOM
    this.globalData.statusBarHeight = statusBarHeight;
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    statusBarHeight: 0
  }
}
</script>

<style>
/*每个页面公共css */
page {
  --status-bar-height: 25px; /* 提供默认值 */
}
/* 全局样式重置 - 使用page选择器代替* */
page,
view,
text,
image,
button {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
