<template>
  <div class="imgBox">
    <img v-show="!isShow" src="../assets/1.jpg" alt="" />
    <img v-show="isShow" src="../assets/3.jpg" alt="" />
    <div class="img2">
      <img v-show="!isMaskImgShow" src="../assets/2.jpg" alt="" />
      <img v-show="isMaskImgShow" src="../assets/4.jpg" alt="" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      isShow: false,
      isMaskImgShow:false,
      a:1,
    };
  },
  mounted() {
    setInterval(() => {
    this.a++
    if(this.a%2===0){
      this.isShow = !this.isShow;
    }
    else{
      this.isMaskImgShow = !this.isMaskImgShow;

    }
    },3000);
  },
};
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

img {
  width: 100%;
  height: 495px;
  display: block;
}

.imgBox {
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.img2 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-mask: url(../assets/3.png) no-repeat;
  -webkit-mask-position: center;

  -webkit-animation: mask 3000ms  infinite ease both alternate ;
}
//       @keyframes LgAnimateMask {
//   0% {
//     -webkit-mask-position: -196% -53%;
//   }

//   70% {
//     -webkit-mask-position: 350% -53%;
//   }
//   100% {
//     -webkit-mask-position: 350% -53%;
//   }
// }

@keyframes mask {
  0% {
    -webkit-mask-size: 0;
  }
  100% {
    -webkit-mask-size: 700px, 700px;
  }
}
</style>