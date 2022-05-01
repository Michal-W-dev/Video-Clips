import VideoSnapshot from "video-snapshot";

export default class Utils {
  static resizeBase64Img(base64: string, quality = .95, size = 1) {
    return new Promise<string>(resolve => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = document.createElement("img");
      img.src = base64;

      img.onload = () => {
        canvas.width = img.width * size;
        canvas.height = img.height * size;
        context?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpg", quality));
      }
    });
  }
  static async snapshooter(file: File) {
    return new Promise<string[]>((resolve, reject) => {
      const snapshoter = new VideoSnapshot(file);
      const vid = document.createElement('video');
      vid.src = snapshoter.videoUrl

      // If file is not supported, no dimension can be found (which result with reject Promise).
      snapshoter.getDimensions().catch(e => reject(e))
      vid.onloadedmetadata = () => {
        const durations = [0.1, vid.duration / 4, vid.duration / 2.5, vid.duration / 1.8, vid.duration / 1.4, vid.duration - 1]
        const snapshootsArray: string[] = []
        durations.forEach((dur, i) => {
          snapshoter.takeSnapshot(dur).then(imgSrc => {
            Utils.resizeBase64Img(imgSrc, .8, .55).then(imgLowQuality => {
              snapshootsArray.push(imgLowQuality);
              if (durations.length - 1 === i) resolve(snapshootsArray)
            });
          })
        })
      }
    })
  }
}
