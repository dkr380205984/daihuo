<template>
  <div id="login">
    <vue-particles color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="background"></vue-particles>
    <div class="loginCtn">
      <div class="atLeft">
        <el-carousel height="370px"
          indicator-position="none">
          <el-carousel-item v-for="(item,index) in picArr"
            :key="index">
            <img class="rotateImg"
              :src="item" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="atRight">
        <div class="title">仓储管理系统</div>
        <div class="welcome">欢迎登录</div>
        <div class="inputCtn">
          <el-input type="text"
            placeholder="请输入手机号"
            v-model="telephone"
            @keydown.enter="goLogin">
          </el-input>
        </div>
        <div class="inputCtn">
          <el-input type="password"
            placeholder="请输入密码"
            v-model="password"
            @keydown.enter="goLogin">
          </el-input>
        </div>
        <div class="psdOp">
          <el-checkbox v-model="remPsd">记住密码</el-checkbox>
          <div class="fogotPsd">忘记密码？</div>
        </div>
        <div class="loginBtn"
          @click="goLogin">登录</div>
        <div class="regBtn"
          @click="goRegister">注册账号</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Login extends Vue {
  picArr: any[] = [
    require('../assets/image/login/rotation1.jpg'),
    require('../assets/image/login/rotation2.jpg'),
    require('../assets/image/login/rotation3.jpg'),
    require('../assets/image/login/rotation4.png'),
  ]
  telephone: string | number = ''
  password: string | number = ''
  remPsd: boolean = false
  goLogin(): void {}
  goRegister(): void {}
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/login/login.less';
</style>