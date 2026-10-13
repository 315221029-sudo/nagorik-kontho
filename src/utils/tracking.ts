// src/utils/tracking.ts

export function generateTrackingNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // ৪ ডিজিটের একটি র্যান্ডম নম্বর
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `NK-${year}${month}${day}-${randomNum}`;
}
