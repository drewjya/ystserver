import { Gender, OrderStatus, Role } from '@prisma/client';

export type VCabang = {
  id: number;
  nama: string;
  phoneNumber: string;
  openHour: string;
  closeHour: string;
  alamat: string;
  picture: {
    path: string;
  } | null;

  happyHour?: {
    publicHoliday: boolean;
    happyHourDetail: {
      endDay: number;
      endHour: string;
      startDay: number;
      startHour: string;
    }[];
  };
};

export type VTreatment = {
  id: number;
  nama: string;
  durasi: number;
  category: VCategory;
  tags: VTags | null;
};

export type VTherapist = {
  id: number;
  gender: Gender;
  nama: string;
  no: string | null;
  attendance?: {
    id: number;
    checkIn: Date | null;
    checkOut: Date | null;
  };
  cabang: {
    id: number;
    nama: string;
  } | null;
};

export type VOrder = {
  id: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  guestGender: Gender;
  orderId: string;
  confirmationTime: Date | null;
  orderTime: Date | null;
  cabang: {
    nama: string;
    id: number;
  };
  guestPhoneNumber: string;
  picture: {
    path: string;
  } | null;
  therapist: {
    nama: string;
    no: string | null;
    id: number;
  } | null;
};

export type VOrderDetail = VOrder & {
  orderDetails: {
    nama: string;
    price: number;
    duration: number;
    treatment: {
      nama: string;
      category: {
        nama: string;
      };
      tags: {
        name: string;
      } | null;
    };
  }[];
  therapistGender: Gender;
  user: {
    name: string;
    email: string;
    phoneNumber: string;
    gender: Gender | null;
    id: number;
  };
  createdAt: Date;
};

export type State<T> = {
  data: T | undefined;
  loading: boolean;
};

export type VTags = {
  id: number;
  name: string;
};

export type VCategory = {
  id: number;
  nama: string;
  optional: boolean;
  happyHourPrice: boolean;
};

export type VBanner = {
  id: number;
  path: string;
};
export type VAdmin = {
  name: string;
  email: string;
  id: number;
  role: Role;
  adminCabang: {
    id: number;
    picture: {
      path: string;
    };
    nama: string;
  };
};

export type CurrUser = {
  role: string;
  id: string;
};

export type VTherapistDetail = {
  gender: Gender;
  no?: string;
  cabang?: VCabang;
  nama: string;
  TherapistSkillTag: {
    tags: {
      id: number;
      name: string;
    };
  }[];
};

export type VCabangTreatment = {
  price: number;
  happyHourPrice: number;
  treatment: VTreatment;
};
