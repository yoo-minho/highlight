<script setup lang="ts">
import type { VsType } from "@/types";

const props = defineProps<{ vs: VsType; type: "MATCH" | "TEAM" }>();
const emits = defineEmits<{ (e: "clickBtn"): void }>();

const { score: aScore, teamName: aTeamName } = props.vs.match?.[0] || {};
const { score: bScore, teamName: bTeamName } = props.vs.match?.[1] || {};

const whoWin = bScore > aScore ? "b" : "a";
</script>
<template>
  <q-item-label>
    <q-item class="q-px-sm q-py-none">
      <q-item-section>
        <q-item-label
          class="row items-center"
          style="justify-content: space-between"
        >
          <div class="teamName flex-center">
            {{ aTeamName }}
          </div>
          <div
            class="score flex-center"
            :class="{ 'text-orange-5': bScore < aScore }"
          >
            {{ aScore }}
          </div>
          <div class="center-wrap flex-center" style="flex: 2">
            <q-btn class="btn" @click="emits('clickBtn')">
              {{ `${type === "TEAM" ? "기록 & 영상 보기" : "영상 보기"}` }}
            </q-btn>
          </div>
          <div
            class="score flex-center"
            :class="{ 'text-orange-5': bScore > aScore }"
          >
            {{ bScore }}
          </div>
          <div class="teamName flex-center">
            {{ bTeamName }}
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped>
.flex-center {
  flex: 1;
  text-align: center;
}
.teamName {
  font-size: 16px;
  width: 140px;
}

.center-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .dateInfo {
    letter-spacing: -1px;
    font-size: 13px;
  }
  .vs {
    font-size: 20px;
    font-weight: bold;
    color: $orange-5;
  }
  .btn {
    font-size: 13px;
    padding: 0px 12px;
    min-height: 2em;
    letter-spacing: -2px;
  }
}

.score {
  font-size: 32px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
