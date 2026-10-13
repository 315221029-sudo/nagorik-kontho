/* eslint-disable */
import http from 'k6/http'; 
import { sleep, check } from 'k6';

// টেস্ট কনফিগারেশন: ৩০ সেকেন্ডের মধ্যে কৃত্রিম ইউজার ১০০ থেকে ১,০০০ এ পৌঁছাবে
export const options = {
  stages: [
    { duration: '10s', target: 100 },  // প্রথম ১০ সেকেন্ডে ১০০ ভার্চুয়াল ইউজার
    { duration: '15s', target: 1000 }, // পরের ১৫ সেকেন্ডে ১০০০ ভার্চুয়াল ইউজার (পিক লোড)
    { duration: '5s', target: 0 },     // শেষ ৫ সেকেন্ডে ট্রাফিক শূন্যে নেমে আসবে
  ],
};

export default function () {
  // আপনার লোকালহোস্টের ট্রান্সপারেন্সি বা হোমপেজটি টেস্ট করার জন্য নিচের ইউআরএলটি সেট করা হয়েছে
  const url = 'http://localhost:3000/home-assets'; 
  
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.get(url, params);
  
  // চেক করা রেসপন্স স্ট্যাটাস ২০০ (OK) আসছে কিনা এবং রেসপন্স টাইম ৫০০ms এর কম কিনা
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(0.1); // প্রতি ভার্চুয়াল ইউজারের অ্যাকশনের মাঝে ছোট বিরতি (স্প্যামিং ট্রাফিক সিমুলেশন)
}
