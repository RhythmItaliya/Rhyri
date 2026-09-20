import { Timestamp } from "@firebase/firestore";
import {
  InvoiceData,
  TransformedData,
  Item,
} from "../../../types/invoiceTypes";
import Decimal from "decimal.js";
import { toWords } from "number-to-words";

const transformItems = (itemList?: Item[]): Item[] => {
  if (!itemList) return [];
  return itemList.map((item) => {
    const name = item.item?.trim() || "No Name Provided";
    const qty = new Decimal(item.quantity || "0");
    const rate = new Decimal(item.price || "0");
    const challanNumber = item.challanNumber?.trim() || "";

    return {
      name,
      qty: qty.toNumber(),
      rate: rate.toNumber(),
      total: qty.times(rate).toNumber(),
      challanNumber,
    };
  });
};

const formatDate = (date: string | Date | Timestamp | undefined): string => {
  if (!date) return " - ";

  let d: Date;

  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === "string" || date instanceof Date) {
    d = new Date(date);
  } else {
    return " - ";
  }

  if (isNaN(d.getTime())) return " - ";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const transformInvoiceData = (data: InvoiceData): TransformedData => {
  const transformedItems = transformItems(data.itemList as Item[] | undefined);

  const totalQty = transformedItems.reduce(
    (total, item) => total.plus(new Decimal(item.qty)),
    new Decimal(0),
  );
  const totalRate = transformedItems.reduce(
    (total, item) => total.plus(new Decimal(item.rate)),
    new Decimal(0),
  );

  const amount = new Decimal(data.amount || 0);
  const discountPercentage = new Decimal(data.discountPercentage || "0");
  const discountAmount = new Decimal(data.discountAmount || 0);
  const gst = new Decimal(data.gst || "0");
  const sgst = new Decimal(data.sgst || "0");
  const otherTaxPercentage = new Decimal(data.otherTaxPercentage || "0");
  const otherTaxAmount = new Decimal(data.otherTaxAmount || "0");

  const discountType = data.discountType
    ? String(data.discountType).toLowerCase()
    : "percentage";
  const otherTaxType = data.otherTaxType
    ? String(data.otherTaxType).toLowerCase()
    : "percentage";

  const discountApplied =
    discountType === "percentage"
      ? amount.times(discountPercentage).div(100)
      : discountAmount;

  const totalAfterDiscount = amount.minus(discountApplied);

  const gstAmount = totalAfterDiscount.times(gst).div(100);
  const sgstAmount = totalAfterDiscount.times(sgst).div(100);

  const otherTaxFinal =
    otherTaxType === "percentage"
      ? totalAfterDiscount.times(otherTaxPercentage).div(100)
      : otherTaxAmount;

  const finalAmount = totalAfterDiscount
    .plus(gstAmount)
    .plus(sgstAmount)
    .plus(otherTaxFinal);
  const roundedAmount = finalAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  const amountInWords = toWords(roundedAmount.toNumber())
    .replace(/,/g, "")
    .replace(/\s+/g, " ");

  const transformedData: TransformedData = {
    company: {
      companyName: data.companyName || " - ",
      companyEmail: data.companyEmail || " - ",
      companyTelephone: data.companyTelephone || " - ",
      companyAddress: data.companyAddress || " - ",
      companyCity: data.companyCity || " - ",
      companyPostCode: data.companyPostCode || " - ",
      companyCountry: data.companyCountry || " - ",
      companyTagline: data.companyTagline || " - ",
      companyState: data.companyState || " - ",
      companyGSTNumber: data.companyGSTNumber || " - ",
      companyPersonName: data.companyPersonName || " - ",
    },
    invoice: {
      invoiceNumber: data.id || " - ",
      creationDate: formatDate(data.invoiceDate),
      dueDate: formatDate(data.dueDate),
      invoiceCustomNumber: data.invoiceCustomNumber || " - ",
    },
    customer: {
      clientName: data.clientName || " - ",
      clientGSTNumber: data.clientGSTNumber || " - ",
      clientTelephone: data.clientTelephone || " - ",
      clientEmail: data.clientEmail || " - ",
      clientAddress: data.clientAddress || "",
      clientCity: data.clientCity || "",
      clientPostCode: data.clientPostCode || "",
      clientCountry: data.clientCountry || "",
    },
    items: transformedItems,
    totals: {
      totalQty: totalQty.toNumber(),
      totalItems: totalRate.toNumber(),
      totalAmount: amount.toNumber(),
      discountPercent: discountPercentage.toNumber(),
      discountAmount: discountAmount.toNumber(),
      discountApplied: discountApplied.toNumber(),
      totalBeforeTax: totalAfterDiscount.toNumber(),
      gstPercent: gst.toNumber(),
      gstAmount: gstAmount.toNumber(),
      sgstPercent: sgst.toNumber(),
      sgstAmount: sgstAmount.toNumber(),
      otherTaxPercent: otherTaxPercentage.toNumber(),
      otherTaxAmount: otherTaxAmount.toNumber(),
      finalAmount: finalAmount.toNumber(),
      roundedAmount: roundedAmount.toNumber(),
      discountType: discountType,
      otherTaxType: otherTaxType,
    },
    bankDetails: {
      bankName: data.bankName || " - ",
      bankAccountNumber: data.bankAccountNumber || " - ",
      bankBranchName: data.bankBranchName || " - ",
      bankIfscCode: data.bankIfscCode || " - ",
    },
    totalInWords: amountInWords,
    termsAndConditions: [
      "Payment due in 7 days; late payment may result in rejection and 30% annual interest.",
      "Disputes will be settled in Surat Court only.",
      "Goods and items personally selected will not be taken back.",
    ],
  };

  return transformedData;
};
