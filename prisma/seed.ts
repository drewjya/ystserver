import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const categoriesData = [
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

const treatmentData = [
  { treatment: 'Massge Balita', category: 'Massage Kesehatan' },
  { treatment: 'Massage Tuina', category: 'Massage Kesehatan' },
  { treatment: 'Massage Ibu Hamil', category: 'Massage Kesehatan' },
  { treatment: 'Massage Jepang', category: 'Massage Kesehatan' },
  { treatment: 'Massage Hot Stone', category: 'Massage Kesehatan' },
  { treatment: 'Massage Traditional 30', category: 'Massage Signature' },
  { treatment: 'Massage Traditional 90', category: 'Massage Signature' },
  { treatment: 'Massage Traditional 120', category: 'Massage Signature' },
  { treatment: 'Massage Traditional 30', category: 'Massage' },
  { treatment: 'Massage Traditional 90', category: 'Massage' },
  { treatment: 'Massage Traditional 120', category: 'Massage' },
  {
    treatment: 'Massage Traditional 90',
    category: 'Massage Aromatherapy Oil',
  },
  { treatment: 'Massage Turun Bero', category: 'Massage Pengobatan' },
  {
    treatment: 'Massage Keseleo (Sport Injury)',
    category: 'Massage Pengobatan',
  },
  { treatment: 'Bekam', category: 'Massage Pengobatan' },
  { treatment: 'Reflexology 30', category: 'Reflexology Signature' },
  { treatment: 'Reflexology 90', category: 'Reflexology Signature' },
  { treatment: 'Reflexology 120', category: 'Reflexology Signature' },
  { treatment: 'Reflexology 30', category: 'Reflexology' },
  { treatment: 'Reflexology 90', category: 'Reflexology' },
  { treatment: 'Reflexology 120', category: 'Reflexology' },
  { treatment: 'Totok Wajah + Vitamin', category: 'Additional Treatment' },
  { treatment: 'Ear Candle', category: 'Additional Treatment' },
  { treatment: 'Kop/Kerik Badan (Tambahan)', category: 'Additional Treatment' },
  { treatment: 'Kop Kaki (Tambahan)', category: 'Additional Treatment' },
  { treatment: 'Lulur', category: 'Additional Treatment' },
  { treatment: 'Kop Api', category: 'Additional Treatment' },
  { treatment: 'Shiatsu', category: 'Massage Kesehatan' },
  { treatment: '1X Konsultasi + Treatment', category: 'Treatment By Shinse' },
];

async function seedUser() {
  const passwordAdmin = await bcrypt.hash('AdminSuper123', 10);
  const password = await bcrypt.hash('Admin123', 10);
  const phoneNumber = '';
  await prisma.user.create({
    data: {
      email: 'admin@ystfamily.com',
      name: 'Super Admin YST',
      password: passwordAdmin,
      phoneNumber: phoneNumber,
      role: 'SUPERADMIN',
    },
  });
  const ystcideng = await prisma.user.create({
    data: {
      email: 'ystcideng@ystfamily.com',
      name: 'YST Cideng Admin',
      password: password,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  const ysthublife = await prisma.user.create({
    data: {
      email: 'ysthublife@ystfamily.com',
      name: 'YST Hublife Admin',
      password: password,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  const ystbsd = await prisma.user.create({
    data: {
      email: 'ystbsd@ystfamily.com',
      name: 'YST BSD Admin',
      password: password,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  const shencideng = await prisma.user.create({
    data: {
      email: 'shenkebayoran@ystfamily.com',
      name: 'Shen Kebayoran Admin',
      password: password,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  const shendgt = await prisma.user.create({
    data: {
      email: 'shengrandtropic@ystfamily.com',
      name: 'YST GL Admin',
      password: password,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  return {
    ystcideng: ystcideng.id,
    ysthublife: ysthublife.id,
    ystbsd: ystbsd.id,
    shencideng: shencideng.id,
    shendgt: shendgt.id,
  };
}

async function seedCabang(params: {
  ystcideng: number;
  ysthublife: number;
  ystbsd: number;
  shencideng: number;
  shendgt: number;
}) {
  const { ystcideng, ysthublife, ystbsd, shendgt, shencideng } = params;
  await prisma.cabang.createMany({
    data: [
      {
        nama: 'YST Cideng',
        adminId: ystcideng,
        openHour: '10:00:00',
        closeHour: '22:00:00',
        phoneNumber: '+6281385976653',
        alamat: 'Jl. Cideng Barat No 8, Jakarta Pusat',
      },

      {
        nama: 'YST Hublife',
        adminId: ysthublife,
        openHour: '10:00:00',
        closeHour: '22:00:00',
        phoneNumber: '+6281188810505',
        alamat: 'Hublife LG Floor, Jl. Tanjung Duren Timur No 2, Jakarta Barat',
      },
      {
        nama: 'YST BSD',
        adminId: ystbsd,
        openHour: '09:00:00',
        closeHour: '21:00:00',
        phoneNumber: '+628114888853',
        alamat: 'Ruko Tabespot BSD, Kabupaten Tangerang',
      },
      {
        nama: 'Shen Kebayoran',
        adminId: shencideng,
        openHour: '10:00:00',
        closeHour: '22:00:00',
        alamat: 'Jl. Ciputat Raya No 5, Jakarta Selatan',
        phoneNumber: '+628111108268',
      },
      {
        nama: 'Shen Grand Tropic',
        adminId: shendgt,
        openHour: '09:00:00',
        closeHour: '21:00:00',
        phoneNumber: '+6281196208928',
        alamat:
          'Grand Tropic Suites Hotel 1st Floor, Letjen S. Parman No 3, Jakarta Barat',
      },
    ],
  });
}

async function seedCategory() {
  const categories = await prisma.$transaction(
    categoriesData.map((category) =>
      prisma.category.create({
        data: {
          nama: category,
        },
      }),
    ),
  );
  return categories;
}



async function seedTreatment(
  categ: {
    id: number;
    nama: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }[],
) {
  function treatmentDa(treatment: { treatment: string; category: string }) {
    const data = categ.find((e) => e.nama === treatment.category)?.id;
    return data;
  }
  const treatments = await prisma.$transaction(
    treatmentData.map((treatment) =>
      prisma.treatment.create({
        data: {
          nama: treatment.treatment,
          category: {
            connect: {
              id: treatmentDa(treatment),
            },
          },
        },
      }),
    ),
  );
  return treatments;
}

async function main() {
  const user = await seedUser();
  await seedCabang(user);
  const categ = await seedCategory();
  await seedTreatment(categ);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
