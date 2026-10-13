// src/utils/video.ts

/**
 * YouTube URL থেকে ভিডিও আইডি এক্সট্রাক্ট করার ফাংশন
 */
export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}
