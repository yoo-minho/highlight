<script setup lang="ts">
const videoStore = useVideoStore();

const execPlayers = (funcName: string, data?: any) => {
  videoStore.value.videoElems.forEach((state: any) => {
    state[funcName](data);
  });
};
const togglePlayers = () => execPlayers("togglePlayer");
const KeyPressArrow = (e: any) => execPlayers("KeyPressArrow", e);

const innerHeight = ref("100vh");

const pressedCodes = new Set<string>();
const pressedKeys = new Set<string>();
const isCommand = (_code: string) => [...pressedCodes].filter((code) => _code === code).length > 0;

onMounted(() => {
  watch(
    () => videoStore.value.videoElems.length,
    async () => {
      const videoElems = videoStore.value.videoElems;
      if (videoElems.length < 2) return;
      const video0 = videoElems[0];
      const video1 = videoElems[1];
      const cutStore = await useCutStore(video1.videoName);

      video1.video.addEventListener("timeupdate", () => {
        if (videoStore.value.isMediaRecording) return;

        const syncedTimeSaved = videoStore.value.syncedTime;
        const syncedTimeCalculated = getSyncTime();
        if (!syncedTimeSaved) {
          videoStore.value.syncedTime = syncedTimeSaved || syncedTimeCalculated;
        }

        if (syncedTimeSaved === syncedTimeCalculated) return;

        const isRightVideoActive =
          cutStore.value.filter((c) => c.seekTime === formatTime(video1.video.currentTime)).length > 0;

        if (isRightVideoActive) {
          Notify.create("두 비디오 보정중입니다. [왼쪽변경]");
          video0.video.currentTime = video1.video.currentTime - syncedTimeSaved;
        } else {
          Notify.create("두 비디오 보정중입니다. [오른쪽변경]");
          video1.video.currentTime = video0.video.currentTime + syncedTimeSaved;
        }
      });
    }
  );

  document.addEventListener("keydown", (event) => {
    const focusedElement = document.activeElement;
    if (focusedElement?.tagName.toLowerCase() !== "body") {
      console.log({ focusedElement });
    }

    if (document.activeElement?.tagName === "INPUT") return true;
    pressedCodes.add(event.code);
    pressedKeys.add(event.key);

    handleKeyPress(event);
  });
  document.addEventListener("keyup", (event) => {
    if (document.activeElement?.tagName === "INPUT") return true;
    pressedCodes.delete(event.code);
    pressedKeys.delete(event.key);
  });
  innerHeight.value = `${window.innerHeight}px`;
  window.addEventListener("resize", () => {
    innerHeight.value = `${window.innerHeight}px`;
  });
});

async function handleKeyPress(event: any) {
  const isCommandS = isCommand("KeyS");
  const isCommandA = isCommand("KeyA");
  const isCommandC = "KeyC" === event.code;
  const isCommandV = "KeyV" === event.code;
  const isCommandSpace = " " === event.key;
  const keyIdx1 = keySet.first.indexOf(event.key);
  const keyIdx2 = keySet.second.indexOf(event.key?.toUpperCase());

  const isCommand123890 = keyIdx1 > -1;
  const isCommanQWEIOP = keyIdx2 > -1;
  const isCommandArrow = event.key.indexOf("Arrow") === 0;

  if (
    isCommandS ||
    isCommandA ||
    isCommandC ||
    isCommandV ||
    isCommandSpace ||
    isCommandArrow ||
    isCommand123890 ||
    isCommanQWEIOP
  ) {
    event.preventDefault();

    if (videoStore.value.videoElems.length === 0) {
      Notify.create("영상 추가해주세요!");
      return;
    }

    const videoName = videoStore.value.videoElems[0].videoName;
    const teamStore = await useTeamStore(videoName);
    const row1 = teamStore.value[0]?.players || [];
    const row2 = teamStore.value[1]?.players || [];

    const replaceSet = (key: string) =>
      ({
        Control: "Ctrl",
        ArrowLeft: "←",
        ArrowRight: "→",
      }[key] || key);

    if ((isCommandS || isCommandA) && pressedKeys.size === 1) {
    } else {
      const message =
        pressedKeys.size === 1
          ? replaceSet(event.key)
          : [...pressedKeys].map((key: string) => (key === " " ? "Space" : replaceSet(key))).join(" + ");
      Notify.create({
        timeout: 1000,
        position: "bottom-right",
        icon: "keyboard",
        message,
      });
    }

    if (isCommandC) return await addCutV2(0);
    if (isCommandV) return await addCutV2(1);

    if (isCommandA && isCommandSpace) return updateCutV2("subPlayer", "");
    if (isCommandS && isCommandSpace) return updateCutV2("skill", "");
    if (isCommandS && (isCommand123890 || isCommanQWEIOP)) {
      const skillName = (i: number) => defaultSkill[i].name || "득점&어시";
      if (isCommand123890) return updateCutV2("skill", skillName(keyIdx1));
      if (isCommanQWEIOP) return updateCutV2("skill", skillName(keyIdx2 + 10));
    }
    if (isCommand123890 || isCommanQWEIOP) {
      const type = isCommandA ? "subPlayer" : "mainPlayer";
      if (isCommand123890) {
        const set1 = row1[keyIdx1];
        if (!set1.name) return;
        return updateCutV2(type, set1.name);
      }

      if (isCommanQWEIOP) {
        const set2 = row2[keyIdx2];
        if (!set2.name) return;
        return updateCutV2(type, set2.name);
      }
    }
    if (isCommandSpace) return togglePlayers();
    if (isCommandArrow) return KeyPressArrow(event);
  }
}

const syncTime = (sec: number, type: "앞으로" | "뒤로") => {
  if (videoStore.value.videoElems.length !== 2) {
    Notify.create("두 개의 영상이 필요합니다!");
    return;
  }
  const video2 = videoStore.value.videoElems[1].video;
  const gapSec = (type === "앞으로" ? -1 : 1) * sec;
  videoStore.value.syncedTime = videoStore.value.syncedTime + gapSec;
  video2.currentTime = video2.currentTime + gapSec;
  video2.focus();
};

const _makeVideosByAllVideoElem = async () => {
  if (videoStore.value.videoElems.length !== 2) {
    Notify.create("두 개의 영상이 필요합니다!");
    return;
  }
  await makeVideosByAllVideoElem();
};
</script>
<template>
  <div
    style="display: flex; justify-content: center; background: #ddd; align-items: center; width: 100vw"
    :style="{ height: innerHeight }"
  >
    <div class="wrap" :style="{ height: innerHeight }">
      <div class="header bg-orange-5" elevated>
        <q-toolbar>
          <q-toolbar-title class="title"> cutin video editor 🏀 </q-toolbar-title>
          <q-btn color="dark" @click="_makeVideosByAllVideoElem()">일괄작업</q-btn>
        </q-toolbar>
      </div>
      <div class="row justify-center relative-position">
        <div class="absolute" style="z-index: 1">
          <q-btn color="pink" textColor="white" @click="syncTime(1, '앞으로')" clickable> - </q-btn>
          <q-btn color="pink" textColor="white"> {{ videoStore.syncedTime }}초 </q-btn>
          <q-btn color="pink" textColor="white" @click="syncTime(1, '뒤로')" clickable> + </q-btn>
        </div>
        <div class="col relative-position">
          <EditorPlayingVideo />
        </div>
        <div class="col relative-position">
          <EditorPlayingVideo />
        </div>
      </div>
      <div class="row col relative-position overflow-hidden">
        <div class="col full-height">
          <EditorRecTable :video-no="0" />
        </div>
        <div class="column full-height" style="width: 960px">
          <div class="col-1">
            <EditorGameQuaterTabArea />
          </div>
          <div class="col-7">
            <EditorPlayerZone />
          </div>
          <div class="col-4">
            <EditorSkillZone />
          </div>
        </div>
        <div class="col full-height">
          <EditorRecTable :video-no="1" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrap {
  max-width: 1920px;
  min-width: 1280px;
  max-height: 1080px;
  min-height: 720px;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 20px #888888;
  border-radius: 20px;
  overflow: hidden;
  .header {
    position: relative;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    color: white;

    .title {
      font-size: 24px;
      letter-spacing: -1px;
      font-weight: bold;
    }
  }
}
:focus-visible {
  outline: 0;
}
</style>
