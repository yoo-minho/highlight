export const formatTime = (time: number) => {
  if (isNaN(+time)) return "0:00:00";
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return [String(hours), String(minutes).padStart(2, "0"), String(seconds).padStart(2, "0")].join(":");
};

export const time2sec = (time: string) => {
  const times = time.split(":", 3);
  if (times.length === 2) {
    return +times[0] * 60 + +times[1];
  }
  return +times[0] * 3600 + +times[1] * 60 + +times[2];
};

export const prettyElapsedTime = (startDate: any, endDate: any) => {
  const elapsedMilliseconds = endDate - startDate;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const hours = String(elapsedHours).padStart(2, "0");
  const minutes = String(elapsedMinutes % 60).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formatVideoDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return formattedDuration;
};

export const delay = (seconds: number) => {
  return new Promise((res) => setTimeout(res, seconds * 1000));
};

export const readFileAsJSON = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as any;
        const jsonObject = JSON.parse(fileContent);
        resolve(jsonObject);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsText(file);
  });
};

export function formatDate(inputDate: string) {
  const year = inputDate.slice(0, 4);
  const month = inputDate.slice(4, 6);
  const day = inputDate.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(date);
  return `${year}-${month}-${day}(${dayOfWeek})`;
}

export function findPlusElements(previousArray: any[], currentArray: any[]) {
  const changedElements = [];
  for (let i = 0; i < currentArray.length; i++) {
    if (!previousArray.includes(currentArray[i])) {
      changedElements.push(currentArray[i]);
    }
  }
  return changedElements;
}

export function json2Form(json: Record<string, any>): FormData {
  const formData = new FormData();
  Object.keys(json).forEach((key) => {
    formData.append(key, json[key]);
  });
  return formData;
}
