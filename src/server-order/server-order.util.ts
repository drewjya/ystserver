import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { ApiException } from 'src/utils/exception/api.exception';

export const selectOrderList = {
  id: true,
  orderId: true,
  orderStatus: true,
  cabang: {
    select: {
      nama: true,
      id: true,
    },
  },
  therapist: {
    select: {
      nama: true,
      id: true,
      no: true,
    },
  },
  guestGender: true,
  guestPhoneNumber: true,
  totalPrice: true,
  confirmationTime: true,
  orderTime: true,
  picture: {
    select: {
      path: true,
    },
  },
};

export const selectOrderDetail = {
  id: true,
  totalPrice: true,
  orderId: true,
  orderStatus: true,
  guestGender: true,
  confirmationTime: true,
  orderTime: true,
  cabang: {
    select: {
      nama: true,
      id: true,
    },
  },
  guestPhoneNumber: true,
  picture: {
    select: {
      path: true,
    },
  },
  therapist: {
    select: {
      nama: true,
      no: true,
      id: true,
    },
  },
  orderDetails: {
    select: {
      nama: true,
      duration: true,
      price: true,
      treatment: {
        select: {
          nama: true,
          category: {
            select: {
              nama: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },

  therapistGender: true,
  user: {
    select: {
      name: true,
      email: true,
      phoneNumber: true,
      gender: true,
      id: true,
    },
  },
  createdAt: true,
};

export type OrderSelectList = {
  cabangId?: number;
  cursor?: number;
  therapist?: string;
  no?: string;
  name?: string;
  email?: string;
  gender?: string;
  phone?: string;
  start?: string;
  end?: string;
  status: string;
  currLim?: number;
};

export const getUserFromReq = (req: Request) => {
  const user = req.user;

  return {
    role: `${user['role']}`,
    id: `${user['sub']}`,
  };
};

export const checkUserAdmin = async ({
  prisma,
  userId,
  role,
}: {
  userId: number;
  prisma: PrismaClient;
  role: 'ADMIN' | 'SUPERADMIN' | ['ADMIN', 'SUPERADMIN'];
}) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      adminCabang: {
        select: {
          id: true,
        },
      },
      role: true,
    },
  });
  if (user) {
    if (user.role === 'USER') {
      throw new ApiException({
        data: 'unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    if ((role === 'ADMIN' || role === 'SUPERADMIN') && user.role === role) {
      return user;
    }
    if (role.includes(user.role)) {
      return user;
    }
  }
  throw new ApiException({
    data: 'unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  });
};

export const bad_request = new ApiException({
  data: 'bad_request',
  status: HttpStatus.BAD_REQUEST,
});

export const not_found = new ApiException({
  data: 'not_found',
  status: HttpStatus.NOT_FOUND,
});

export const duplicate = new ApiException({
  data: 'duplicate',
  status: HttpStatus.CONFLICT,
});


export const unauthorized = new ApiException({
  data: 'unauthorized',
  status: HttpStatus.UNAUTHORIZED,
});
