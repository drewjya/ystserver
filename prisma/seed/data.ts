import { Gender } from '@prisma/client';

export const categoriesData = [
  'Massage',
  'Massage Kesehatan',
  'Massage Signature',
  'Massage Aromatherapy Oil',
  'Massage Pengobatan',
  'Reflexology',
  'Reflexology Signature',
  'Additional Treatment',
  'Treatment By Shinse',
];

export const happyHour = [
  {
    cabangId: 5,
    publicHoliday: false,
    detail: [
      { startDay: 1, endDay: 5, startHour: '09:00:00', endHour: '14:00:00' },
    ],
  },
  {
    cabangId: 4,
    publicHoliday: true,
    detail: [
      { startDay: 1, endDay: 5, startHour: '10:00:00', endHour: '15:00:00' },
      { startDay: 6, endDay: 7, startHour: '10:00:00', endHour: '12:00:00' },
    ],
  },
  {
    cabangId: 1,
    publicHoliday: false,
    detail: [
      { startDay: 1, endDay: 5, startHour: '10:00:00', endHour: '14:00:00' },
    ],
  },
  {
    cabangId: 2,
    publicHoliday: false,
    detail: [
      { startDay: 1, endDay: 5, startHour: '10:00:00', endHour: '14:00:00' },
    ],
  },
  {
    cabangId: 3,
    publicHoliday: false,
    detail: [
      { startDay: 1, endDay: 5, startHour: '09:00:00', endHour: '14:00:00' },
    ],
  },
];

export const treatmentData = [
  { durasi:90, treatment: 'Massge Balita', category: 'Massage Kesehatan' },
  { durasi:90, treatment: 'Massage Tuina', category: 'Massage Kesehatan' },
  { durasi:90, treatment: 'Massage Ibu Hamil', category: 'Massage Kesehatan' },
  { durasi:90, treatment: 'Massage Jepang', category: 'Massage Kesehatan' },
  { durasi:90, treatment: 'Massage Hot Stone', category: 'Massage Kesehatan' },
  { durasi:90, treatment: 'Massage Traditional 30', category: 'Massage Signature' },
  { durasi:90, treatment: 'Massage Traditional 90', category: 'Massage Signature' },
  { durasi:90, treatment: 'Massage Traditional 120', category: 'Massage Signature' },
  { durasi:90, treatment: 'Massage Traditional 30', category: 'Massage' },
  { durasi:90, treatment: 'Massage Traditional 90', category: 'Massage' },
  { durasi:90, treatment: 'Massage Traditional 120', category: 'Massage' },
  { durasi:90,
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
  },
  { durasi:90, treatment: 'Massage Turun Bero', category: 'Massage Pengobatan' },
  { durasi:90,
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
  },
  { durasi:90, treatment: 'Bekam', category: 'Massage Pengobatan' },
  { durasi:90, treatment: 'Reflexology 30', category: 'Reflexology Signature' },
  { durasi:90, treatment: 'Reflexology 90', category: 'Reflexology Signature' },
  { durasi:90, treatment: 'Reflexology 120', category: 'Reflexology Signature' },
  { durasi:90, treatment: 'Reflexology 30', category: 'Reflexology' },
  { durasi:90, treatment: 'Reflexology 90', category: 'Reflexology' },
  { durasi:90, treatment: 'Reflexology 120', category: 'Reflexology' },
  { durasi:90, treatment: 'Totok Wajah + Vitamin', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Ear Candle', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Kop/Kerik Badan (Tambahan)', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Kop Kaki (Tambahan)', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Lulur', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Kop Api', category: 'Additional Treatment' },
  { durasi:90, treatment: 'Shiatsu', category: 'Massage Kesehatan' },
  { durasi:90, treatment: '1X Konsultasi + Treatment', category: 'Treatment By Shinse' },
];

const shenGrandTropicTreatment = [
  {
    treatment: 'Massge Balita',
    category: 'Massage Kesehatan',
    treatmentId: 1,
    categoryId: 2,
    cabangId: 5,
    price: 170000,
  },
  {
    treatment: 'Massage Tuina',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 2,
    cabangId: 5,
    price: 170000,
  },
  {
    treatment: 'Massage Ibu Hamil',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 3,
    cabangId: 5,
    price: 170000,
  },
  {
    treatment: 'Massage Jepang',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 4,
    cabangId: 5,
    price: 170000,
  },
  {
    treatment: 'Massage Hot Stone',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 5,
    cabangId: 5,
    price: 170000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 5,
    treatmentId: 6,
    price: 110000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 5,
    treatmentId: 7,
    price: 160000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 5,
    treatmentId: 8,
    price: 210000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage',
    categoryId: 1,
    cabangId: 5,
    treatmentId: 9,
    price: 100000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage',
    categoryId: 1,
    cabangId: 5,
    treatmentId: 10,
    price: 145000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage',
    categoryId: 1,
    cabangId: 5,
    treatmentId: 11,
    price: 195000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
    categoryId: 4,
    cabangId: 5,
    treatmentId: 12,
    price: 170000,
  },
  {
    treatment: 'Massage Turun Bero',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 5,
    treatmentId: 13,
    price: 145000,
  },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 5,
    treatmentId: 14,
    price: 145000,
  },
  {
    treatment: 'Bekam',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 5,
    treatmentId: 15,
    price: 145000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 5,
    treatmentId: 16,
    price: 90000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 5,
    treatmentId: 17,
    price: 130000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 5,
    treatmentId: 18,
    price: 170000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 5,
    treatmentId: 19,
    price: 75000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 5,
    treatmentId: 20,
    price: 115000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 5,
    treatmentId: 21,
    price: 155000,
  },
  {
    treatment: 'Totok Wajah + Vitamin',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 22,
    price: 120000,
  },
  {
    treatment: 'Ear Candle',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 23,
    price: 120000,
  },
  {
    treatment: 'Kop/Kerik Badan (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 24,
    price: 55000,
  },
  {
    treatment: 'Kop Kaki (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 25,
    price: 55000,
  },
  {
    treatment: 'Lulur',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 26,
    price: 145000,
  },
  {
    treatment: 'Kop Api',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 5,
    treatmentId: 27,
    price: 100000,
  },
];

const shenKebayoranTreatment = [
  {
    treatment: 'Massage Tuina',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 2,
    cabangId: 4,
    price: 150000,
  },
  {
    treatment: 'Massage Ibu Hamil',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 3,
    cabangId: 4,
    price: 140000,
  },
  {
    treatment: 'Massage Jepang',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 4,
    cabangId: 4,
    price: 140000,
  },

  {
    treatment: 'Massage Traditional 30',
    category: 'Massage',
    categoryId: 1,
    cabangId: 4,
    treatmentId: 9,
    price: 70000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage',
    categoryId: 1,
    cabangId: 4,
    treatmentId: 10,
    price: 125000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage',
    categoryId: 1,
    cabangId: 4,
    treatmentId: 11,
    price: 180000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
    categoryId: 4,
    cabangId: 4,
    treatmentId: 12,
    price: 150000,
  },
  {
    treatment: 'Massage Turun Bero',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 4,
    treatmentId: 13,
    price: 140000,
  },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 4,
    treatmentId: 14,
    price: 140000,
  },
  {
    treatment: 'Bekam',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 4,
    treatmentId: 15,
    price: 125000,
  },

  {
    treatment: 'Reflexology 30',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 4,
    treatmentId: 19,
    price: 45000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 4,
    treatmentId: 20,
    price: 90000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 4,
    treatmentId: 21,
    price: 135000,
  },
  {
    treatment: 'Totok Wajah + Vitamin',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 4,
    treatmentId: 22,
    price: 115000,
  },
  {
    treatment: 'Ear Candle',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 4,
    treatmentId: 23,
    price: 115000,
  },
  {
    treatment: 'Kop/Kerik Badan (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 4,
    treatmentId: 24,
    price: 40000,
  },

  {
    treatment: 'Lulur',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 4,
    treatmentId: 26,
    price: 135000,
  },
];

const ystBsdTreatment = [
  {
    treatment: 'Massge Balita',
    category: 'Massage Kesehatan',
    treatmentId: 1,
    categoryId: 2,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Massage Tuina',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 2,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Massage Ibu Hamil',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 3,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Massage Jepang',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 4,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Massage Hot Stone',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 5,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Shiatsu',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 28,
    cabangId: 3,
    price: 215000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 3,
    treatmentId: 6,
    price: 130000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 3,
    treatmentId: 7,
    price: 195000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 3,
    treatmentId: 8,
    price: 260000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage',
    categoryId: 1,
    cabangId: 3,
    treatmentId: 9,
    price: 105000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage',
    categoryId: 1,
    cabangId: 3,
    treatmentId: 10,
    price: 175000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage',
    categoryId: 1,
    cabangId: 3,
    treatmentId: 11,
    price: 235000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
    categoryId: 4,
    cabangId: 3,
    treatmentId: 12,
    price: 210000,
  },
  {
    treatment: 'Massage Turun Bero',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 3,
    treatmentId: 13,
    price: 1850000,
  },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 3,
    treatmentId: 14,
    price: 1850000,
  },
  {
    treatment: 'Bekam',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 3,
    treatmentId: 15,
    price: 1850000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 3,
    treatmentId: 16,
    price: 105000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 3,
    treatmentId: 17,
    price: 160000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 3,
    treatmentId: 18,
    price: 210000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 3,
    treatmentId: 19,
    price: 80000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 3,
    treatmentId: 20,
    price: 135000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 3,
    treatmentId: 21,
    price: 185000,
  },
  {
    treatment: 'Totok Wajah + Vitamin',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 22,
    price: 150000,
  },
  {
    treatment: 'Ear Candle',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 23,
    price: 150000,
  },
  {
    treatment: 'Kop/Kerik Badan (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 24,
    price: 65000,
  },
  {
    treatment: 'Kop Kaki (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 25,
    price: 65000,
  },
  {
    treatment: 'Lulur',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 26,
    price: 150000,
  },
  {
    treatment: 'Kop Api',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 3,
    treatmentId: 27,
    price: 130000,
  },
];

const ystHublife = [
  {
    treatment: 'Massge Balita',
    category: 'Massage Kesehatan',
    treatmentId: 1,
    categoryId: 2,
    cabangId: 2,
    price: 225000,
  },
  {
    treatment: 'Massage Tuina',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 2,
    cabangId: 2,
    price: 225000,
  },
  {
    treatment: 'Massage Ibu Hamil',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 3,
    cabangId: 2,
    price: 225000,
  },
  {
    treatment: 'Massage Jepang',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 4,
    cabangId: 2,
    price: 225000,
  },
  {
    treatment: 'Massage Hot Stone',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 5,
    cabangId: 2,
    price: 225000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 2,
    treatmentId: 6,
    price: 140000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 2,
    treatmentId: 7,
    price: 205000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 2,
    treatmentId: 8,
    price: 270000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage',
    categoryId: 1,
    cabangId: 2,
    treatmentId: 9,
    price: 115000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage',
    categoryId: 1,
    cabangId: 2,
    treatmentId: 10,
    price: 185000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage',
    categoryId: 1,
    cabangId: 2,
    treatmentId: 11,
    price: 245000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
    categoryId: 4,
    cabangId: 2,
    treatmentId: 12,
    price: 220000,
  },
  {
    treatment: 'Massage Turun Bero',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 2,
    treatmentId: 13,
    price: 195000,
  },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 2,
    treatmentId: 14,
    price: 195000,
  },
  {
    treatment: 'Bekam',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 2,
    treatmentId: 15,
    price: 195000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 2,
    treatmentId: 16,
    price: 115000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 2,
    treatmentId: 17,
    price: 170000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 2,
    treatmentId: 18,
    price: 220000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 2,
    treatmentId: 19,
    price: 90000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 2,
    treatmentId: 20,
    price: 145000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 2,
    treatmentId: 21,
    price: 195000,
  },
  {
    treatment: 'Totok Wajah + Vitamin',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 22,
    price: 160000,
  },
  {
    treatment: 'Ear Candle',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 23,
    price: 160000,
  },
  {
    treatment: 'Kop/Kerik Badan (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 24,
    price: 75000,
  },
  {
    treatment: 'Kop Kaki (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 25,
    price: 75000,
  },
  {
    treatment: 'Lulur',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 26,
    price: 160000,
  },
  {
    treatment: 'Kop Api',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 2,
    treatmentId: 27,
    price: 140000,
  },
];
const ystCideng = [
  {
    treatment: 'Massge Balita',
    category: 'Massage Kesehatan',
    treatmentId: 1,
    categoryId: 2,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Massage Tuina',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 2,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Massage Ibu Hamil',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 3,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Massage Jepang',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 4,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Massage Hot Stone',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 5,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Shiatsu',
    category: 'Massage Kesehatan',
    categoryId: 2,
    treatmentId: 28,
    cabangId: 1,
    price: 170000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 1,
    treatmentId: 6,
    price: 110000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 1,
    treatmentId: 7,
    price: 160000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage Signature',
    categoryId: 3,
    cabangId: 1,
    treatmentId: 8,
    price: 210000,
  },
  {
    treatment: 'Massage Traditional 30',
    category: 'Massage',
    categoryId: 1,
    cabangId: 1,
    treatmentId: 9,
    price: 100000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage',
    categoryId: 1,
    cabangId: 1,
    treatmentId: 10,
    price: 145000,
  },
  {
    treatment: 'Massage Traditional 120',
    category: 'Massage',
    categoryId: 1,
    cabangId: 1,
    treatmentId: 11,
    price: 195000,
  },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
    categoryId: 4,
    cabangId: 1,
    treatmentId: 12,
    price: 170000,
  },
  {
    treatment: 'Massage Turun Bero',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 1,
    treatmentId: 13,
    price: 145000,
  },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 1,
    treatmentId: 14,
    price: 145000,
  },
  {
    treatment: 'Bekam',
    category: 'Massage Pengobatan',
    categoryId: 5,
    cabangId: 1,
    treatmentId: 15,
    price: 145000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 1,
    treatmentId: 16,
    price: 90000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 1,
    treatmentId: 17,
    price: 130000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology Signature',
    categoryId: 7,
    cabangId: 1,
    treatmentId: 18,
    price: 170000,
  },
  {
    treatment: 'Reflexology 30',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 1,
    treatmentId: 19,
    price: 75000,
  },
  {
    treatment: 'Reflexology 90',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 1,
    treatmentId: 20,
    price: 115000,
  },
  {
    treatment: 'Reflexology 120',
    category: 'Reflexology',
    categoryId: 6,
    cabangId: 1,
    treatmentId: 21,
    price: 155000,
  },
  {
    treatment: 'Totok Wajah + Vitamin',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 22,
    price: 120000,
  },
  {
    treatment: 'Ear Candle',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 23,
    price: 120000,
  },
  {
    treatment: 'Kop/Kerik Badan (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 24,
    price: 55000,
  },
  {
    treatment: 'Kop Kaki (Tambahan)',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 25,
    price: 55000,
  },
  {
    treatment: 'Lulur',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 26,
    price: 145000,
  },
  {
    treatment: 'Kop Api',
    category: 'Additional Treatment',
    categoryId: 8,
    cabangId: 1,
    treatmentId: 27,
    price: 100000,
  },
  {
    treatment: '1X Konsultasi + Treatment',
    category: 'Treatment By Shinse',
    categoryId: 9,
    treatmentId: 29,
    cabangId: 1,
    price: 250000,
  },
];

export const treatmentCabang = [
  ...shenGrandTropicTreatment,
  ...shenKebayoranTreatment,
  ...ystBsdTreatment,
  ...ystHublife,
  ...ystCideng,
];

export const therapist: {
  name: string;
  gender: Gender;
  treatment: number[];
}[] = [
  {
    name: 'Tria',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 22, 26, 24, 24],
  },
  {
    name: 'Awan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 24, 24],
  },
  {
    name: 'Ridwan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 22, 24, 24],
  },
  {
    name: 'Darto',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 5, 14, 15, 22, 23, 26, 24, 24],
  },
  {
    name: 'Lusi',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 28, 15, 26, 24, 24,
    ],
  },
  {
    name: 'Isan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Suhedi',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 4, 1, 5, 14, 15, 24,
      24, 25, 27,
    ],
  },
  {
    name: 'Siska',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 1, 3, 28, 5, 13, 14,
      22, 23, 26, 24, 24, 25, 27,
    ],
  },
  {
    name: 'Retno',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 2, 12, 4, 1, 3, 13, 14, 22, 23, 26, 24,
      24,
    ],
  },
  {
    name: 'Imas',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Amang',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 14, 24, 24, 25, 27,
    ],
  },
  {
    name: 'Andrian',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 24, 24],
  },
  {
    name: 'Siran',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 16, 17, 18, 24, 24],
  },
  {
    name: 'Rere',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 12, 22, 26, 24],
  },
  {
    name: 'Yulius',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 22, 23, 24, 24],
  },
  {
    name: 'Nia',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 15, 22, 23, 26, 24, 24,
    ],
  },
  {
    name: 'Santi',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 26, 24, 24, 25, 27,
    ],
  },
  {
    name: 'Lisna',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Anwar',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Joni',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 14, 15, 24, 24,
    ],
  },
  {
    name: 'Azis',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8],
  },
  {
    name: 'Yoga',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Dopar',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'May',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 4, 3, 24, 24],
  },
  {
    name: 'July',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Khosim',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 14, 24, 24],
  },
  {
    name: 'Maruf',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Rani',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 2, 12, 4, 1, 3, 13, 14, 22, 23, 26, 24, 24],
  },
  {
    name: 'Yuli',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Tri',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Puja',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 3, 26, 24, 24],
  },
  {
    name: 'Aden',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 24, 24],
  },
  {
    name: 'Rika',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Ningsih',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 12, 26, 24, 24],
  },
  {
    name: 'Alisa',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Desi',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 12, 22, 26, 24, 24],
  },
  {
    name: 'Manah',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Ani',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24, 25],
  },
  {
    name: 'Anggi',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 2, 12, 4, 1, 3, 13, 14, 23, 26, 24, 24],
  },
  {
    name: 'Nina',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 12, 22, 26, 24],
  },
  {
    name: 'Tika',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 12, 24, 24],
  },
  {
    name: 'Amir',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 14, 24, 24],
  },
  {
    name: 'Syarif',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 14, 15],
  },
  {
    name: 'Ati',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Dadang',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 2, 12, 15, 24, 24],
  },
  {
    name: 'Dian',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 4, 1, 3, 28, 5, 14, 22,
      23, 26, 24, 24,
    ],
  },
  {
    name: 'Riska',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 3, 22, 26, 24, 24],
  },
  {
    name: 'Nita',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Heni',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Wadi',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 24, 24],
  },
  {
    name: 'Deja',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 24, 24],
  },
  {
    name: 'Wildan',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 15, 22, 23, 26, 24, 24,
    ],
  },
  {
    name: 'Tia',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Fajar',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Sindi',
    gender: Gender.MALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Oji',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 24, 24, 25, 27,
    ],
  },
  {
    name: 'Iyan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 24],
  },
  {
    name: 'Siti',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 7, 6, 8, 12],
  },
  {
    name: 'Tuti',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Diana',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 24, 24],
  },
  {
    name: 'Awalia',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 3, 15, 22, 26, 24, 24,
    ],
  },
  {
    name: 'Tado',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 24, 24],
  },
  {
    name: 'Novi',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9],
  },
  {
    name: 'Bagol',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 5, 24, 24],
  },
  {
    name: 'Dede',
    gender: Gender.MALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Topan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 24, 24],
  },
  {
    name: 'Ocid',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Udin',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 14, 15, 22, 23, 26, 24,
      24,
    ],
  },
  {
    name: 'Abdul',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 15, 22, 23, 26, 24, 24,
      25, 27,
    ],
  },
  {
    name: 'Rahma',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 24, 24],
  },
  {
    name: 'Wati',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 12, 1, 3, 13, 14, 22, 23, 26, 24, 24],
  },
  {
    name: 'Aliyanti',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 22, 26, 24, 24],
  },
  {
    name: 'Oyok',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Aji ',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24],
  },
  {
    name: 'Mela',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Hana',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 12, 4, 1, 3, 24, 24],
  },
  {
    name: 'Ucik',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 13, 14, 15, 22, 24, 24,
    ],
  },
  {
    name: 'Ade',
    gender: Gender.MALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 12, 13, 14, 15, 24, 24,
    ],
  },
  {
    name: 'Ikbal',
    gender: Gender.MALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Nano',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 24, 24],
  },
  {
    name: 'Agus',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 12, 24, 24],
  },
  {
    name: 'Hani',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 2, 12, 1, 13, 14, 22, 24, 24],
  },
  {
    name: 'Sopi',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 22, 23, 26, 24, 24],
  },
  {
    name: 'Anton',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 22, 23, 24, 24],
  },
  {
    name: 'Aini',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 7, 6, 8, 12, 1, 28, 22, 23, 26, 24, 24],
  },
  {
    name: 'Iman',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 24, 24],
  },
  {
    name: 'Sinta',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Indah',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Aang',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 26, 24, 24],
  },
  {
    name: 'Tisna',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9],
  },
  {
    name: 'Dewi',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 3, 13, 14, 26, 24],
  },
  {
    name: 'Wulan',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 22, 24, 24],
  },
  {
    name: 'Mamas',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 14, 26, 24, 24],
  },
  {
    name: 'Melly',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Novi',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9],
  },
  {
    name: 'Yanti',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 13, 15, 22, 23, 26, 24, 24],
  },
  {
    name: 'Rehan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 22, 23, 26, 24, 24],
  },
  {
    name: 'Repan',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 22, 23, 26, 24, 24],
  },
  {
    name: 'Rini',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 1, 3, 5, 15, 22, 26, 24, 24, 25],
  },
  {
    name: 'Ikeu',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 2, 22, 26, 24, 24, 25],
  },
  {
    name: 'Erni',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 24],
  },
  {
    name: 'Lina',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 26, 24, 24],
  },
  {
    name: 'Niki',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 16, 17, 18, 11, 10, 9, 7, 6, 8, 2, 14, 22, 26, 24, 24, 25, 27,
    ],
  },
  {
    name: 'Meri',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 22],
  },
  {
    name: 'Ocha',
    gender: Gender.FEMALE,
    treatment: [11, 10, 9, 26, 24, 24],
  },
  {
    name: 'Sansan',
    gender: Gender.MALE,
    treatment: [19, 20, 21],
  },
  {
    name: 'Ririn',
    gender: Gender.FEMALE,
    treatment: [19, 20, 21, 11, 10, 9, 12, 1, 3, 5, 22, 23, 26, 24, 24, 25],
  },
  {
    name: 'Reva',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 24],
  },
  {
    name: 'Jejen',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9, 15, 22, 23, 24, 24],
  },
  {
    name: 'Badru',
    gender: Gender.MALE,
    treatment: [19, 20, 21, 11, 10, 9],
  },
  {
    name: 'Lita',
    gender: Gender.FEMALE,
    treatment: [
      19, 20, 21, 11, 10, 9, 7, 6, 8, 2, 12, 1, 3, 5, 13, 14, 15, 22, 26, 24,
      24, 25,
    ],
  },
];

export const happyHourTreatment = [
  {
    id: 5,
    treatment: [
      {
        id: 19,
        price: 75000,
      },
      {
        id: 20,
        price: 95000,
      },
      {
        id: 21,
        price: 120000,
      },
      {
        id: 9,
        price: 100000,
      },
      {
        id: 10,
        price: 120000,
      },
      {
        id: 11,
        price: 155000,
      },
    ],
  },
  {
    id: 4,
    treatment: [
      {
        id: 19,
        price: 45000,
      },
      {
        id: 20,
        price: 70000,
      },
      {
        id: 21,
        price: 95000,
      },
      {
        id: 9,
        price: 70000,
      },
      {
        id: 10,
        price: 110000,
      },
      {
        id: 11,
        price: 140000,
      },
    ],
  },
  {
    id: 1,
    treatment: [
      {
        id: 19,
        price: 75000,
      },
      {
        id: 20,
        price: 95000,
      },
      {
        id: 21,
        price: 120000,
      },
      {
        id: 9,
        price: 100000,
      },
      {
        id: 10,
        price: 120000,
      },
      {
        id: 11,
        price: 155000,
      },
    ],
  },
  {
    id: 2,
    treatment: [
      {
        id: 19,
        price: 90000,
      },
      {
        id: 20,
        price: 120000,
      },
      {
        id: 21,
        price: 140000,
      },
      {
        id: 9,
        price: 115000,
      },
      {
        id: 10,
        price: 155000,
      },
      {
        id: 11,
        price: 195000,
      },
    ],
  },
  {
    id: 3,
    treatment: [
      {
        id: 19,
        price: 80000,
      },
      {
        id: 20,
        price: 110000,
      },
      {
        id: 21,
        price: 130000,
      },
      {
        id: 9,
        price: 105000,
      },
      {
        id: 10,
        price: 145000,
      },
      {
        id: 11,
        price: 185000,
      },
    ],
  },
];