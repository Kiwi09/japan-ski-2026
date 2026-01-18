import { DaySchedule, HotelInfo, FlightInfo } from './types';
import { CloudSnow, Sun, Cloud, CloudRain } from 'lucide-react';
import React from 'react';

// Helpers to render icons
export const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'snow': return <CloudSnow className="w-5 h-5 text-blue-400" />;
    case 'sunny': return <Sun className="w-5 h-5 text-orange-400" />;
    case 'rain': return <CloudRain className="w-5 h-5 text-blue-600" />;
    default: return <Cloud className="w-5 h-5 text-gray-400" />;
  }
};

export const HOTELS: HotelInfo[] = [
  {
    name: "Hotel Metropolitan Takasaki (高崎大都會飯店)",
    checkIn: "15:00",
    checkOut: "11:00",
    address: "Yashimacho 222, Takasaki",
    bookingRef: "8QA66WFU / PIN: 9562",
    notes: ["直通 JR 車站", "不含早餐 (第1天)"]
  },
  {
    name: "Palcall Tsumagoi Resort (帕爾科嬬戀度假村)",
    checkIn: "15:00",
    checkOut: "10:00",
    address: "Tsumagoi, Gunma",
    bookingRef: "ChiTeelai746JpAC",
    notes: ["需購買日出纜車票", "含自助早餐/晚餐"]
  },
  {
    name: "Kusatsu Onsen Hotel Konoha (草津溫泉 木葉飯店)",
    checkIn: "15:00",
    checkOut: "11:00",
    address: "Kusatsu 464-214",
    bookingRef: "2025091388101433",
    notes: ["有免費接駁車至湯畑", "有包場露天風呂"]
  },
  {
    name: "Toyoko Inn Tokyo Monzen-nakacho Eitaibashi (東横INN 東京門前仲町永代橋)",
    checkIn: "16:00",
    checkOut: "10:00",
    address: "1-11-9 Eitai, Koto-ku, Tokyo",
    bookingRef: "David Family",
    notes: ["近豐洲市場", "交通方便至 T-CAT"]
  }
];

export const FLIGHTS: FlightInfo[] = [
  { flight: "Jetstar GK104", route: "TPE -> NRT", time: "2/5, 12:50 - 16:55", passenger: "Rina" },
  { flight: "Peach MM628", route: "TPE -> NRT", time: "2/6, 15:30 - 19:45", passenger: "Kiwi Family" },
  { flight: "Cathay CX451", route: "NRT -> TPE", time: "2/13, 15:20 - 18:40", passenger: "Rina" },
  { flight: "Peach MM859", route: "HND -> TPE", time: "2/14, 05:45 - 08:55", passenger: "Kiwi/David" }
];

export const ITINERARY: DaySchedule[] = [
  {
    date: "2026-02-05",
    dayLabel: "2/5 (四)",
    locationLabel: "成田 -> 高崎",
    weatherForecast: { temp: "5°C", condition: "cloudy" },
    items: [
      { id: "1-1", time: "16:55", category: "flight", title: "抵達 NRT", description: "Jetstar GK104 (T1 -> T3)", location: { name: "成田機場" }, participants: ["Rina"] },
      { id: "1-2", time: "17:43", category: "train", title: "Skyliner", description: "前往京成上野 (18:24 抵達)", price: "2580 JPY", highlight: true, participants: ["Rina"] },
      { id: "1-3", time: "18:38", category: "train", title: "新幹線", description: "上野 -> 高崎 (19:28 抵達)", tags: ["指定席"], participants: ["Rina"] },
      { id: "1-4", time: "20:00", category: "food", title: "晚餐: 天婦羅烏龍麵", description: "Motres 5F (水澤烏龍麵)", location: { name: "高崎大都會飯店" }, tags: ["必吃"], participants: ["Rina"] },
      { id: "1-5", time: "21:00", category: "hotel", title: "辦理入住", description: "高崎大都會飯店", tags: ["PIN: 9562"], participants: ["Rina"] }
    ]
  },
  {
    date: "2026-02-06",
    dayLabel: "2/6 (五)",
    locationLabel: "高崎 / 榛名",
    weatherForecast: { temp: "3°C", condition: "sunny" },
    items: [
      { id: "2-1", time: "09:24", category: "bus", title: "巴士往榛名神社", description: "西口巴士站 (10:40 抵達)", location: { name: "Takasaki Station West Exit" }, participants: ["Rina"] },
      { id: "2-2", time: "11:00", category: "activity", title: "榛名神社", description: "能量景點觀光", location: { name: "Haruna Shrine" }, participants: ["Rina"] },
      { id: "2-3", time: "13:40", category: "bus", title: "回程巴士", description: "往高崎 (15:01 抵達)", participants: ["Rina"] },
      { id: "2-4", time: "16:00", category: "shopping", title: "購物 & 準備", description: "買藥妝 & 明天的新幹線車票", tags: ["重要"], participants: ["Rina"] },
      { id: "2-5", time: "18:00", category: "food", title: "晚餐: Harappa 義大利麵", description: "當地特色高崎義大利麵", location: { name: "Harappa Takasaki Station East" }, tags: ["必吃"], participants: ["Rina"] },
      { id: "2-6", time: "19:45", category: "flight", title: "Kiwi/David 抵達", description: "NRT T1. 搭巴士前往東橫 Inn.", location: { name: "Narita Airport" }, participants: ["Kiwi", "David"] }
    ]
  },
  {
    date: "2026-02-07",
    dayLabel: "2/7 (六)",
    locationLabel: "高崎 -> 輕井澤",
    weatherForecast: { temp: "-2°C", condition: "snow" },
    items: [
      { id: "3-1", time: "11:25", category: "bus", title: "巴士往達磨寺", description: "少林山達磨寺", participants: ["Rina"] },
      { id: "3-2", time: "12:30", category: "food", title: "午餐: 登利平", description: "鳥めし (Motres 5F)", tags: ["必吃"], participants: ["Rina"] },
      { id: "3-3", time: "15:00", category: "shopping", title: "電器購物", description: "山田電機 / E'site", participants: ["Rina"] },
      { id: "3-4", time: "17:20", category: "train", title: "新幹線往輕井澤", description: "17:35 抵達. Kiwi/David 從上野會合 (Hakutaka 557)" },
      { id: "3-5", time: "18:10", category: "bus", title: "接駁車往度假村", description: "末班車！預約號: ChiTeelai746JpAC", tags: ["需預約"] },
      { id: "3-6", time: "19:30", category: "hotel", title: "入住 Palcall", description: "含晚餐 & 早餐" }
    ]
  },
  {
    date: "2026-02-08",
    dayLabel: "2/8 - 2/9",
    locationLabel: "帕爾科滑雪場",
    weatherForecast: { temp: "-6°C", condition: "snow" },
    items: [
      { id: "4-1", time: "06:30", category: "activity", title: "日出纜車", description: "需另外購票. 在 2000m 高空看日出.", tags: ["亮點"] },
      { id: "4-2", time: "09:00", category: "activity", title: "全日滑雪", description: "有魔毯、雪地公園.", tags: ["滑雪"] },
      { id: "4-3", time: "18:00", category: "food", title: "自助晚餐", description: "飯店內" }
    ]
  },
  {
    date: "2026-02-10",
    dayLabel: "2/10 (二)",
    locationLabel: "帕爾科 -> 草津",
    weatherForecast: { temp: "-3°C", condition: "cloudy" },
    items: [
      { id: "5-1", time: "07:30", category: "bus", title: "巴士往草津", description: "50 分鐘車程. 在轉運站寄放行李." },
      { id: "5-2", time: "10:00", category: "activity", title: "湯揉秀", description: "傳統表演", location: { name: "熱乃湯" }, tags: ["表演"] },
      { id: "5-3", time: "12:00", category: "food", title: "午餐: 松本烏龍麵", description: "舞菇天婦羅烏龍麵", tags: ["必吃"] },
      { id: "5-4", time: "14:00", category: "hotel", title: "入住 木葉", description: "轉運站接駁. 含晚餐.", location: { name: "Kusatsu Onsen Hotel Konoha" } },
      { id: "5-5", time: "16:00", category: "activity", title: "西之河原露天風呂", description: "大型露天溫泉. 記得帶毛巾!", tags: ["帶毛巾"] }
    ]
  },
  {
    date: "2026-02-11",
    dayLabel: "2/11 (三)",
    locationLabel: "草津",
    weatherForecast: { temp: "-4°C", condition: "snow" },
    items: [
      { id: "6-1", time: "09:00", category: "activity", title: "滑雪 或 觀光", description: "草津滑雪場 或 西之河原公園散步." },
      { id: "6-2", time: "14:00", category: "food", title: "咖啡廳 月之貌", description: "下午茶休息", location: { name: "Cafe Tsuki no Kao" } },
      { id: "6-3", time: "18:00", category: "activity", title: "湯畑點燈", description: "夜間散步." }
    ]
  },
  {
    date: "2026-02-12",
    dayLabel: "2/12 (四)",
    locationLabel: "草津 -> 東京",
    weatherForecast: { temp: "4°C", condition: "sunny" },
    items: [
      { id: "7-1", time: "11:00", category: "bus", title: "接駁車往輕井澤", description: "從飯店出發 (70 分鐘)." },
      { id: "7-2", time: "12:30", category: "shopping", title: "輕井澤王子 Outlet", description: "購物時間！午餐在美食街解決。" },
      { id: "7-3", time: "17:41", category: "train", title: "分頭行動", description: "Rina -> 高崎. Kiwi/David -> 東京." },
      { id: "7-4", time: "18:00", category: "food", title: "晚餐: Ponchiken", description: "米其林炸豬排 (高崎東口)", tags: ["必吃"], participants: ["Rina"] },
      { id: "7-5", time: "19:00", category: "train", title: "新幹線往東京", description: "前往東橫 Inn 豐洲", participants: ["Kiwi", "David"] }
    ]
  },
  {
    date: "2026-02-13",
    dayLabel: "2/13 (五)",
    locationLabel: "回程 / 豐洲",
    weatherForecast: { temp: "8°C", condition: "rain" },
    items: [
      { id: "8-1", time: "10:20", category: "train", title: "前往機場", description: "高崎 -> 上野 -> Skyliner", participants: ["Rina"] },
      { id: "8-2", time: "15:20", category: "flight", title: "飛回家", description: "國泰 CX451 (NRT -> TPE)", location: { name: "Narita Airport" }, participants: ["Rina"] },
      { id: "8-3", time: "16:00", category: "shopping", title: "豐洲市場", description: "壽司午餐 & 觀光", participants: ["Kiwi", "David"] },
      { id: "8-4", time: "19:00", category: "activity", title: "TeamLab Planets", description: "互動數位藝術展", participants: ["Kiwi", "David"] }
    ]
  },
  {
    date: "2026-02-14",
    dayLabel: "2/14 (六)",
    locationLabel: "東京 -> 回家",
    weatherForecast: { temp: "6°C", condition: "sunny" },
    items: [
      { id: "9-1", time: "05:45", category: "flight", title: "飛回家", description: "樂桃 MM859 (HND -> TPE)", location: { name: "Haneda Airport" }, participants: ["Kiwi", "David"] }
    ]
  }
];