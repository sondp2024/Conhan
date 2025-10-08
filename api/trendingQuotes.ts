import type { QuoteItem } from '../types';

const MOCK_QUOTES: QuoteItem[] = [
  {
    id: "q1",
    text: "Sống chậm lại, nghĩ khác đi, yêu sâu hơn.",
    category: "triet-ly",
    source: "twitter",
    likes: 5420,
    shares: 1200,
    hashtags: ["#life", "#mindful"],
  },
  {
    id: "q2",
    text: "Làm ít lại, đúng nhiều hơn.",
    category: "ngan-gon",
    source: "reddit",
    likes: 3210,
    shares: 760,
  },
  {
    id: "q3",
    text: "Đời ngắn đừng ngủ dài.",
    category: "hai-huoc",
    source: "tiktok",
    likes: 8000,
    shares: 2100,
    hashtags: ["#funny", "#quote"],
  },
  {
    id: "q4",
    text: "Kỷ luật là cầu nối giữa mục tiêu và thành tựu.",
    category: "triet-ly",
    source: "fb",
    likes: 6100,
    shares: 1700,
  },
  {
    id: "q5",
    text: "Hạnh phúc là có việc để làm, người để yêu và điều để hy vọng.",
    category: "triet-ly",
    source: "twitter",
    likes: 4700,
    shares: 980,
  },
  {
    id: "q6",
    text: "Đừng nghiêm trọng hóa mọi thứ – vài năm nữa nhìn lại, bạn sẽ cười thôi.",
    category: "hai-huoc",
    source: "reddit",
    likes: 3550,
    shares: 640,
  },
  {
    id: "q7",
    text: "Hôm nay làm tốt, ngày mai đỡ lo.",
    category: "ngan-gon",
    source: "tiktok",
    likes: 2900,
    shares: 520,
  },
];

export async function fetchTrendingQuotes(params: { category?: QuoteItem["category"]; query?: string } = {}): Promise<(QuoteItem & { score: number })[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 350));
  let data = [...MOCK_QUOTES];
  if (params.category) data = data.filter((q) => q.category === params.category);
  if (params.query) {
    const q = params.query.trim().toLowerCase();
    data = data.filter((x) => x.text.toLowerCase().includes(q));
  }
  // Ranking score = likes*0.7 + shares*0.3
  return data
    .map((q) => ({ ...q, score: Math.round(q.likes * 0.7 + q.shares * 0.3) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
