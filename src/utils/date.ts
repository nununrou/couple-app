import dayjs from 'dayjs';

// 计算恋爱天数
export function getLoveDays(startDate: string): number {
  return dayjs().diff(dayjs(startDate), 'day');
}

// 格式化日期
export function formatDate(date: string, format: string = 'YYYY年MM月DD日'): string {
  return dayjs(date).format(format);
}

// 格式化相对时间
export function formatRelative(date: string): string {
  const d = dayjs(date);
  const now = dayjs();
  const diffDays = now.diff(d, 'day');

  if (diffDays === 0) {
    const diffHours = now.diff(d, 'hour');
    if (diffHours === 0) {
      const diffMinutes = now.diff(d, 'minute');
      return diffMinutes <= 1 ? '刚刚' : `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  return d.format('YYYY/MM/DD');
}

// 甜蜜语录
const loveQuotes = [
  '遇见你，是我这辈子最美丽的意外。',
  '世界很大，但我的心很小，只装得下你一个人。',
  '和你在一起的每一天，都是情人节。',
  '你是我所有温柔的来源和归宿。',
  '有你的地方，就是我想去的远方。',
  '我喜欢你，像风走了八千里，不问归期。',
  '余生很长，但我只想和你一起度过。',
  '你是我的今天，也是我所有的明天。',
  '最好的爱情，是两个人一起变得更好。',
  '从前车马很慢，一生只够爱一个人。',
];

export function getRandomQuote(): string {
  return loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
}