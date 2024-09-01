import { Gender, OrderStatus } from "@prisma/client";

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
  };
  
  export type VTreatment = {
    id: number;
    nama: string;
    durasi: number;
    category: {
      nama: string;
      id: number;
    };
    tags: {
      name: string;
      id: number;
    } | null;
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
    guestPhoneNumber: string,
    picture: {
      path: string;
    } | null;
    therapist: {
      nama: string;
      no: string | null;
      id: number,
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
    id: number,
    name: string
  }
  
  export type VCategory = {
    id: number,
    nama:string
  }
  
  export type VBanner = {
    id: number;
    path: string;
  }