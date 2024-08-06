import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTimestampToMMSS(totalSeconds: number): string {
  // Round down the total seconds
  const roundedSeconds = Math.floor(totalSeconds);

  // Calculate the number of minutes
  const minutes = Math.floor(roundedSeconds / 60);

  // Calculate the remaining seconds
  const seconds = roundedSeconds % 60;

  // Format the minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // Return the formatted string
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function getYouTubeVideoId(url: string): string | undefined | null {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})(?:\S+)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
