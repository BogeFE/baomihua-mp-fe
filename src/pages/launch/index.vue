<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <view class="container">
        <text>欢迎来到抱米花</text>
        <image
        class="logo"
            src="../../assets/images/LOGO.png"
        />
        <text>如果寂寞,就来抱抱</text>
    </view>
</template>

<style>
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh
}
.logo{
    width: 600px;
    height: 600px;
}

text{
    font-size: 60px;
}

</style>