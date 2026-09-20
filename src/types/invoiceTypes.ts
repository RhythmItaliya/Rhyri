import { Timestamp } from "firebase/firestore";

export interface InvoiceItem {
  name?: string;
  quantity?: number;
  rate?: number;
  challanNumber?: string;
}

export interface InvoiceData {
  id?: string;
  sellerStreetAddress?: string;
  sellerCity?: string;
  sellerCountry?: string;
  sellerPostCode?: string;
  invoiceDate?: string | Date | Timestamp;
  dueDate?: string | Date | Timestamp;

  challanNumber: string;
  invoiceCustomNumber: string;

  clientName?: string;
  clientGSTNumber?: string;
  clientTelephone?: string;
  clientEmail?: string;
  clientAddress?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;

  itemList?: InvoiceItem[];
  amount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  gst?: number;
  sgst?: number;
  otherTaxPercentage?: number;
  otherTaxAmount?: number;

  bankName: string;
  bankAccountNumber: string;
  bankBranchName: string;
  bankIfscCode: string;

  companyName: string;
  companyEmail: string;
  companyTelephone: string;
  companyAddress: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  companyTagline?: string;
  companyState?: string;
  companyGSTNumber?: string;
  companyPersonName?: string;

  discountType?: "percentage" | "fixed";
  otherTaxType?: "percentage" | "fixed";
}

export interface Company {
  companyName: string;
  companyEmail: string;
  companyTelephone: string;
  companyAddress: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  companyTagline?: string;
  companyState?: string;
  companyGSTNumber?: string;
  companyPersonName?: string;
}

export interface Customer {
  clientName: string;
  clientGSTNumber?: string;
  clientTelephone: string;
  clientEmail: string;
  clientAddress?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
}

export interface Invoice {
  invoiceNumber: string;
  challanNumber?: string;
  creationDate: string;
  dueDate: string;
  invoiceCustomNumber: string;
}

export interface Item {
  item?: string;
  product?: string;
  price?: string;
  quantity?: string;
  challanNumber?: string;
  name: string;
  qty: number;
  rate: number;
  total: number;
}

export interface Totals {
  totalQty: number;
  totalItems: number;
  totalAmount: number;
  discountPercent: number;
  discountAmount: number;
  totalBeforeTax: number;
  gstPercent: number;
  gstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  otherTaxPercent: number;
  otherTaxAmount: number;
  finalAmount: number;
  discountType: string;
  discountApplied: number;
  otherTaxType: string;
  roundedAmount: number;
}

export interface TransformedData {
  company: Company;
  invoice: Invoice;
  customer: Customer;
  items: Item[];
  totals: Totals;
  bankDetails: BankDetails;
  totalInWords: string;
  termsAndConditions: string[];
}

export interface BankDetails {
  bankName: string;
  bankAccountNumber: string;
  bankBranchName: string;
  bankIfscCode: string;
}

export interface FieldNames {
  contactName: string;
  contactTel: string;
  contactEmail: string;
  gstin: string;
  invoiceTax: string;
  originalForReceipt: string;
  customerDetails: string;
  customerName: string;
  customerAddress: string;
  customerTel: string;
  customerEmail: string;
  invoiceDetails: string;
  invoiceNo: string;
  challanNo: string;
  invoiceCreateDate: string;
  dueDate: string;
  productDetails: string;
  srNo: string;
  productName: string;
  qty: string;
  rate: string;
  total: string;
  totalInWords: string;
  bankDetails: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  ifscCode: string;
  discount: string;
  totalBeforeTax: string;
  gst: string;
  sgst: string;
  otherTax: string;
  termsAndConditions: string;
  candidateStatement: string;
  authorisedSignature: string;
}

export interface FormatTestProps {
  data: TransformedData;
  fieldNames: FieldNames;
}
