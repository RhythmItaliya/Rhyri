import { Timestamp } from "firebase/firestore";

export type ChallanStatus = "pending" | "paid" | "drafted";

export interface ChallanItem {
  description: string;
  size?: string;
  designNumber?: string;
  pieces: number;
  quantity: number;
  rate: number;
}

export interface Challan {
  id: string;
  uid: string;
  challanStatus: ChallanStatus;

  companyName: string;
  companyTagline?: string;
  companyTelephone?: string;
  companyEmail?: string;
  companyAddress: string;
  companyCity?: string;
  companyState?: string;
  companyPostCode?: string;
  companyCountry?: string;
  companyGSTNumber?: string;

  clientName: string;
  clientTelephone?: string;
  clientEmail?: string;
  clientAddress?: string;
  clientCity?: string;
  clientState?: string;
  clientPostCode?: string;
  clientCountry?: string;
  clientGSTNumber?: string;

  challanNumber: string;
  challanDate: Timestamp;
  orderDate?: Timestamp;
  poNumber?: string;

  itemList: ChallanItem[];
  totalPieces: number;
  amount: number;
}

export interface TransformedChallanItem extends ChallanItem {
  amount: number;
}

export interface TransformedChallan {
  company: {
    name: string;
    tagline: string;
    telephone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    gstNumber: string;
  };
  client: {
    name: string;
    telephone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    gstNumber: string;
  };
  challan: {
    id: string;
    number: string;
    date: string;
    orderDate: string;
    poNumber: string;
  };
  items: TransformedChallanItem[];
  totalPieces: number;
  totalQuantity: number;
  amount: number;
}
