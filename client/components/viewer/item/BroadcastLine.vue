<script setup lang="ts">
import type { CutType } from "@/types";

const props = defineProps<{ cut: CutType }>();
const { team, vsScore, skill } = props.cut;
const { main } = getSkillPoints(skill);

const teams = Object.keys(vsScore);
const aScore = vsScore[teams[0]] + (team === teams[0] ? main.pts || 0 : 0);
const bScore = vsScore[teams[1]] + (team === teams[1] ? main.pts || 0 : 0);
</script>
<template>
  <div class="row text-white q-gutter-md">
    <div style="flex: 1; text-align: right">
      <span v-if="team === teams[0]">
        {{ main.pts > 0 ? "🏀" : "" }}{{ getSkillContents(cut.skill) }} -
        {{ cut.mainPlayer }}
      </span>
    </div>
    <div style="width: 60px; text-align: center">
      <template v-if="main.pts > 0">
        <span :class="{ b: team === teams[0] }">{{ aScore }}</span> :
        <span :class="{ b: team === teams[1] }">{{ bScore }}</span>
      </template>
      <template v-else>
        <div>_</div>
      </template>
    </div>
    <div style="flex: 1">
      <span v-if="team === teams[1]">
        {{ cut.mainPlayer }} - {{ getSkillContents(cut.skill) }}
        {{ main.pts > 0 ? "🏀" : "" }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.b {
  font-weight: bold;
}
</style>
