import ffmpeg from "fluent-ffmpeg";
import ffmpegI from "@ffmpeg-installer/ffmpeg";
import ffprobeI from "@ffprobe-installer/ffprobe";
ffmpeg.setFfmpegPath(ffmpegI.path);
ffmpeg.setFfprobePath(ffprobeI.path);
console.log({ ffmpeg: ffmpegI.path, ffprobe: ffprobeI.path });

export const ffmpegPromise = ({ inputPath, outputPath }) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoFilters("setpts=2.5*PTS")
      .fps(24)
      .videoCodec("libx264") //압축 낮고 속도 높음
      // .videoCodec("libx265") //압축 높이고 속도 낮음
      // .outputOptions(["-c:v h264_nvenc", "-preset fast"]) // NVENC 설정
      .output(outputPath)
      .on("start", function (commandLine) {
        // console.log("FFmpeg process started with command: " + commandLine);
      })
      .on("data", function (data) {
        // console.log("stdout: " + data);
      })
      .on("end", () => {
        // console.log("ffmpegPromise end");
        resolve();
      })
      .on("error", (x, y, z) => {
        console.log("uuu", x, y, z);
        reject();
      })
      .run();
  });
};

export const convertLocal = ({ inputPath, outputPath, speed = 1 }) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoFilters(`setpts=${speed}*PTS`)
      .fps(24)
      .videoCodec("libx264") //압축 낮고 속도 높음
      // .videoCodec("libx265") //압축 높이고 속도 낮음
      .outputOptions(["-c:v h264_nvenc", "-preset fast"]) // NVENC 설정
      .output(outputPath)
      .on("start", function (commandLine) {
        // console.log("FFmpeg process started with command: " + commandLine);
      })
      .on("data", function (data) {
        // console.log("stdout: " + data);
      })
      .on("end", () => {
        // console.log("ffmpegPromise end");
        resolve();
      })
      .on("error", (x, y, z) => {
        console.log("uuu", x, y, z);
        reject();
      })
      .run();
  });
};

export const ffprobePromise = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject();
      } else {
        resolve(metadata);
      }
    });
  });
};

export const cutFunc =
  ({ time, duration, speed, func = (v) => v }) =>
  (ff) =>
    func(
      ff
        .seekInput(time)
        .duration(`00:00:${duration / speed}`)
        .audioFilter(`atempo=${speed}`)
        .videoFilter([`setpts=${1 / speed}*PTS`])
        .size("1280x720")
    );

export const chunkArray = (array, chunkSize) => {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
};

export const ffmpegPromise2 = ({ inputPath, outputPath }) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoFilters(`setpts=${speed}*PTS`)
      .fps(24)
      .videoCodec("libx264")
      .output(outputPath)
      .on("end", () => {
        resolve();
      })
      .on("error", (x, y, z) => {
        console.log("uuu", x, y, z);
        reject();
      })
      .run();
  });
};
