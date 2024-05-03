import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  categoriesData,
  happyHour,
  happyHourTreatment,
  therapist,
  treatmentCabang,
  treatmentData,
} from './data';

const prisma = new PrismaClient();

async function seedUser() {
  const passwordAdmin = await bcrypt.hash('AdminSuper123', 10);
  const password = await bcrypt.hash('Admin123', 10);
  const phoneNumber = '';
  await prisma.user.create({
    data: {
      email: 'admin@ystfamily.com',
      name: 'Super Admin YST',
      isConfirmed: true,
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
      isConfirmed: true,
      phoneNumber: phoneNumber,
      role: 'ADMIN',
    },
  });
  const ysthublife = await prisma.user.create({
    data: {
      email: 'ysthublife@ystfamily.com',
      name: 'YST Hublife Admin',
      password: password,
      isConfirmed: true,
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
      isConfirmed: true,
      role: 'ADMIN',
    },
  });
  const shencideng = await prisma.user.create({
    data: {
      email: 'shenkebayoran@ystfamily.com',
      name: 'Shen Kebayoran Admin',
      password: password,
      phoneNumber: phoneNumber,
      isConfirmed: true,
      role: 'ADMIN',
    },
  });
  const shendgt = await prisma.user.create({
    data: {
      email: 'shengrandtropic@ystfamily.com',
      name: 'YST GL Admin',
      password: password,
      phoneNumber: phoneNumber,
      isConfirmed: true,
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
          durasi: treatment.durasi,
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

async function seedCabangTreatment() {
  await prisma.$transaction(
    treatmentCabang.map((e) =>
      prisma.treatmentCabang.create({
        data: {
          price: e.price,
          cabang: {
            connect: {
              id: e.cabangId,
            },
          },
          treatment: {
            connect: {
              id: e.treatmentId,
            },
          },
        },
      }),
    ),
  );
}

async function seedHappyHour() {
  await prisma.$transaction(
    happyHour.map((e) =>
      prisma.happyHour.create({
        data: {
          cabangId: e.cabangId,
          publicHoliday: e.publicHoliday,
          Cabang: {
            connect: {
              id: e.cabangId,
            },
          },
          happyHourDetail: {
            createMany: {
              data: e.detail,
            },
          },
        },
      }),
    ),
  );
}

async function seedTherapistWithTreatment() {
  function treatmentId(treatment: number[]) {
    return treatment.map((e) => {
      return {
        treatmentId: e,
      };
    });
  }
  await prisma.$transaction(
    therapist.map((e) => {
      return prisma.therapist.create({
        data: {
          nama: e.name,
          gender: e.gender,
          TherapistTreatment: {
            createMany: {
              data: treatmentId(e.treatment),
              skipDuplicates: true,
            },
          },
        },
      });
    }),
  );
}

async function seedHappyHourTreatment() {
  const convert = happyHourTreatment
    .map((e) => {
      const tr = e.treatment.map((tr) => {
        return {
          cabangId: e.id,
          price: tr.price,
          treatmentId: tr.id,
        };
      });
      return tr;
    })
    .flat(1);

  await prisma.$transaction(
    convert.map((e) => {
      return prisma.happyHourTreatment.create({
        data: {
          price: e.price,

          cabang: {
            connect: {
              id: e.cabangId,
            },
          },
          treatment: {
            connect: {
              id: e.treatmentId,
            },
          },
        },
      });
    }),
  );
}

async function main() {
  console.log('Seeding Admin');
  const user = await seedUser();
  console.log('Seeding Cabang');
  await seedCabang(user);
  console.log('Seeding Category');
  const categ = await seedCategory();
  console.log('Seeding Treatment');
  await seedTreatment(categ);
  console.log('Seeding Cabang Treatment');
  await seedCabangTreatment();
  console.log('Seeding Happy Hour');
  await seedHappyHour();
  console.log('Seeding Therapist Treatment');
  seedTherapistWithTreatment();
  console.log('Seeding HappyHour Treatment');
  seedHappyHourTreatment();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
