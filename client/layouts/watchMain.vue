<script setup lang="ts">
import { serviceName } from "@/composables/constants";
import WatchHeader from "./components/WatchHeader.vue";

const routeTabVal = ref("");
</script>
<template>
  <q-layout>
    <WatchHeader type="MAIN" :title="serviceName" style="position: relative" />
    <q-tabs
      v-model="routeTabVal"
      dense
      :class="`text-grey bg-dark`"
      :active-color="`orange-5`"
      :indicator-color="`orange-5`"
    >
      <q-route-tab
        name="team"
        label="Team"
        to="/watch/team"
        :replace="true"
        no-caps
        style="flex: 1"
      />
      <q-route-tab
        name="player"
        label="Player"
        to="/watch/player"
        :replace="true"
        no-caps
        style="flex: 1"
      />
    </q-tabs>
    <q-tab-panels v-model="routeTabVal" class="my-panels">
      <q-tab-panel :name="routeTabVal" class="q-pa-none">
        <slot />
      </q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<style lang="scss" scoped>
body {
  overflow: hidden;
}

ul {
  padding: 5px;
  list-style-type: none;
}

body {
  background-color: $grey-4;
}

h1,
h2,
h3 {
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  margin: 0;
  display: inline-block;
}

h4 {
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  margin: 0;
  display: inline-block;
}

.max-width {
  max-width: 460px;
  min-width: 360px;
  margin: 0 auto;
  width: 100vw;
}

.without-header {
  height: calc(100vh - 51px);
}
.without-header.in-team {
  height: 100vh;
}

.margin-top-header {
  top: 51px;
}

.image-48 {
  width: 48px;
  height: 48px;
  background: black;
  color: white;
  line-height: 48px;
  text-align: center;
}

.subpage {
  position: absolute;
  z-index: 3000;
}

.logo-img {
  height: 36px;
  max-width: 36px;
}
.q-item__section--side {
  padding-right: 8px !important;
}

.q-separator--horizontal:last-child {
  margin-bottom: 0 !important;
}
</style>
