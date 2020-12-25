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
import { Vue } from 'vue-property-decorator'
import { login } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      picArr: [
        require('../assets/image/login/rotation1.jpg'),
        require('../assets/image/login/rotation2.jpg'),
        require('../assets/image/login/rotation3.jpg'),
        require('../assets/image/login/rotation4.png')
      ],
      telephone: window.localStorage.getItem('dhUsername') || '',
      password: window.localStorage.getItem('dhPassword') || '',
      remPsd: true
    }
  },
  methods: {
    goLogin(): void {
      login({
        user_name: this.telephone,
        password: this.password
      }).then((res) => {
        if (res.data.code === 200) {
          window.sessionStorage.setItem('token', res.data.data.access_token)
          window.sessionStorage.setItem('token_type', res.data.data.token_type)
          window.localStorage.setItem('dhUsername', this.telephone)
          if (this.remPsd) {
            window.localStorage.setItem('dhPassword', this.password)
          } else {
            window.localStorage.setItem('dhPassword', '')
          }
          this.$message.success('登录成功')
          this.$router.push('/setting/main/page=1&&keyword')
        } else {
          this.$message.error({
            message: res.data.message
          })
          this.password = ''
        }
      })
    },
    goRegister(): void {
      this.$message.warning({
        message: '注册功能暂不开放'
      })
    }
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/less/login/login.less';
</style>
