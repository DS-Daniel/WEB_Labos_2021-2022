<template>
  <div id="app">
    <Snowf
        :amount="50"
        :size="5"
        :speed="1.5"
        :wind="0"
        :opacity="0.8"
        :swing="1"
        :image="null"
        :zIndex="0"
        :resize="true"
        color="#fff"
    />
    <router-view/>
    <div v-if="$store.state.currentTrack != null">
      <Player/>
    </div>
  </div>
</template>

<script>
import Player from "./components/Player";
import Snowf from 'vue-snowf';

export default {
  name: "App",
  components: {Player, Snowf},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: auto;
  color: white;
  background: url('./assets/img/bg.jpg') no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
	background-color: #000000;
}

.snowf-canvas {
  pointer-events: none;
}

/* Fonts */
.text-grey {
	color: #cecece;
}

.title,
.subtitle1,
.subtitle2 {
	font-weight: bold;
}

.subtitle1,
.subtitle2,
.body1,
.body2,
.overline {
	line-height: 1.5;
}

.title {
	font-size: 3rem;
	line-height: 1.25;
}

.subtitle1,
.body1 {
	font-size: 1rem;
}

.subtitle2,
.body2 {
	font-size: 0.875rem;
}

.overline {
	font-size: 0.75rem;
}
</style>
