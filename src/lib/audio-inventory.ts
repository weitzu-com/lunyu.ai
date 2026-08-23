import fs from "node:fs";
import path from "node:path";

export const listenVoiceSlug = "ruby-female";
export const listenAudioLanguage = "zh-CN";
export const listenAudioFormat = "audio/mpeg";

type AudioFileMetadata = {
  durationSeconds?: number;
};

const audioRoot = path.join(process.cwd(), "public", "audio", "analects");
const mpeg1Layer3Bitrates = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320,
];
const mpeg2Layer3Bitrates = [
  0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160,
];
const mpegSampleRates: Record<number, number[]> = {
  0: [11025, 12000, 8000],
  2: [22050, 24000, 16000],
  3: [44100, 48000, 32000],
};

export function listenAudioRelativePath(bookSlug: string, sentenceNumber: number) {
  return `${bookSlug}/${listenVoiceSlug}/${bookSlug}-${String(sentenceNumber).padStart(3, "0")}-${listenVoiceSlug}.mp3`;
}

/** Read a real CBR MP3 duration without requiring ffprobe in production builds. */
function readMp3DurationSeconds(filePath: string) {
  try {
    const stat = fs.statSync(filePath);
    const fd = fs.openSync(filePath, "r");
    try {
      const header = Buffer.alloc(Math.min(stat.size, 64 * 1024));
      fs.readSync(fd, header, 0, header.length, 0);

      let audioStart = 0;
      if (header.subarray(0, 3).toString("ascii") === "ID3" && header.length >= 10) {
        const tagSize =
          ((header[6] & 0x7f) << 21) |
          ((header[7] & 0x7f) << 14) |
          ((header[8] & 0x7f) << 7) |
          (header[9] & 0x7f);
        audioStart = 10 + tagSize + (header[5] & 0x10 ? 10 : 0);
      }

      let bitrateKbps: number | undefined;
      for (let offset = audioStart; offset <= header.length - 4; offset += 1) {
        if (header[offset] !== 0xff || (header[offset + 1] & 0xe0) !== 0xe0) continue;
        const versionBits = (header[offset + 1] >> 3) & 0x03;
        const layerBits = (header[offset + 1] >> 1) & 0x03;
        const bitrateIndex = (header[offset + 2] >> 4) & 0x0f;
        const sampleRateIndex = (header[offset + 2] >> 2) & 0x03;
        if (versionBits === 1 || layerBits !== 1 || bitrateIndex === 0 || bitrateIndex === 15) {
          continue;
        }
        const sampleRate = mpegSampleRates[versionBits]?.[sampleRateIndex];
        if (!sampleRate) continue;
        const bitrateTable = versionBits === 3 ? mpeg1Layer3Bitrates : mpeg2Layer3Bitrates;
        bitrateKbps = bitrateTable[bitrateIndex];
        audioStart = offset;

        const padding = (header[offset + 2] >> 1) & 0x01;
        const coefficient = versionBits === 3 ? 144 : 72;
        const frameLength = Math.floor(
          (coefficient * bitrateKbps * 1000) / sampleRate + padding
        );
        const firstFrame = header.subarray(offset, Math.min(header.length, offset + frameLength));
        if (firstFrame.includes("Xing") || firstFrame.includes("Info")) {
          audioStart += frameLength;
        }
        break;
      }

      if (!bitrateKbps) return undefined;

      let audioEnd = stat.size;
      if (stat.size >= 128) {
        const id3v1 = Buffer.alloc(3);
        fs.readSync(fd, id3v1, 0, id3v1.length, stat.size - 128);
        if (id3v1.toString("ascii") === "TAG") audioEnd -= 128;
      }

      const duration = ((audioEnd - audioStart) * 8) / (bitrateKbps * 1000);
      return Number.isFinite(duration) && duration > 0 ? Number(duration.toFixed(3)) : undefined;
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return undefined;
  }
}

function collectAudioFiles() {
  const files = new Map<string, AudioFileMetadata>();
  if (!fs.existsSync(audioRoot)) return files;

  const stack = [audioRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".mp3")) {
        files.set(path.relative(audioRoot, fullPath).replaceAll(path.sep, "/"), {
          durationSeconds: readMp3DurationSeconds(fullPath),
        });
      }
    }
  }
  return files;
}

const audioFiles = collectAudioFiles();

export function listenAudioSrc(bookSlug: string, sentenceNumber: number) {
  return `/audio/analects/${listenAudioRelativePath(bookSlug, sentenceNumber)}`;
}

export function getListenAudioMetadata(bookSlug: string, sentenceNumber: number) {
  return audioFiles.get(listenAudioRelativePath(bookSlug, sentenceNumber));
}

export function listCurrentVoiceAudioFiles() {
  return [...audioFiles.keys()].filter((file) => file.includes(`/${listenVoiceSlug}/`));
}
