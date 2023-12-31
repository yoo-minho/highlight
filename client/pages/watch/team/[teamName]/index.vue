<script setup lang="ts">
import type { TeamInfoType, VsType } from "@/types";
import GameItem from "../components/GameItem.vue";
import TeamItem from "../components/TeamItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { teamName: clubCode } = route.params;
const { tab = "" } = route.query;

const currentTeam = ref();
const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
if (currentTeamState.value.length > 0) {
  currentTeam.value = currentTeamState.value.find(
    (team) => team.id === clubCode
  );
} else {
  const { data: clubs } = await useFetch<TeamInfoType[]>(`/api/club`);
  watch(
    clubs,
    (newData) => {
      if (newData) {
        currentTeamState.value = newData;
        currentTeam.value = currentTeamState.value.find(
          (team) => team.id === clubCode
        );
      }
    },
    { immediate: true }
  );
}

const { data: games } = await useFetch<VsType[]>(`/api/club/${clubCode}/game`);
const currentVsState = useState<VsType[]>("currentVsState", () => []);
watch(
  games,
  (newData) => {
    if (!newData) return;
    currentVsState.value = newData.map((vs) => {
      return {
        ...vs,
        dateInfo: formatGameDate(vs.playDate, vs.gameNo),
        gameCode: `${clubCode}_${vs.playDate}_${vs.gameNo}`,
      };
    });
  },
  { immediate: true }
);

const { data: players } = await useFetch<VsType[]>(
  `/api/club/${clubCode}/player`
);

const moveGame = (gameCode: string) => {
  const route = useRoute();
  const router = useRouter();
  router.push(route.path + "/" + gameCode);
};

const refTab = ref(String(tab) || "player");
watch(refTab, () => {
  const router = useRouter();
  router.replace({ query: { tab: refTab.value } });
});
</script>
<template>
  <TeamItem :team="currentTeam" />
  <q-separator color="#ccc" class="q-mt-sm" />
  <q-tabs
    v-model="refTab"
    dense
    :class="`text-grey js-tab bg-white`"
    :active-color="`orange-5`"
    :indicator-color="`orange-5`"
  >
    <q-tab name="player" :label="`경기기록 (멤버+게스트)`" style="flex: 1" />
    <q-tab
      name="match"
      :label="`최근경기 (${currentVsState.length}게임)`"
      style="flex: 1"
    />
  </q-tabs>
  <q-tab-panels v-model="refTab" style="flex: 1; width: 100%">
    <q-tab-panel name="player" class="q-pa-none">
      <TableAllPlayerByClub :player-stat="players" />
    </q-tab-panel>
    <q-tab-panel name="match" class="q-pa-none">
      <div class="text-center q-mt-md text-orange-5">
        * 정렬조건 : 경기일자 최근순
      </div>
      <q-list>
        <q-separator />
        <template v-for="vs in currentVsState">
          <GameItem
            v-if="vs.gameCode"
            :vs="vs"
            type="TEAM"
            @click-btn="moveGame(vs.gameCode)"
          />
          <q-separator />
        </template>
      </q-list>
    </q-tab-panel>
  </q-tab-panels>
</template>
<style lang="scss" scoped>
.scroll {
  overflow: hidden !important;
}

.teamName {
  font-size: 24px;
  font-weight: bold;
}
.score {
  font-size: 36px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
