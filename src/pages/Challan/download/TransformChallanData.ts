import { Challan, TransformedChallan } from "../../../types/challanTypes";
import {
  calculateChallanItemAmount,
  formatChallanDate,
  getChallanTotals,
  toChallanNumber,
} from "../challanUtils";

export function transformChallanData(data: Challan): TransformedChallan {
  const normalizedItems = (data.itemList || []).map((item) => ({
    ...item,
    pieces: toChallanNumber(item.pieces),
    quantity: toChallanNumber(item.quantity),
    rate: toChallanNumber(item.rate),
  }));

  const items = normalizedItems.map((item) => ({
    ...item,
    amount: calculateChallanItemAmount(item).toDecimalPlaces(2).toNumber(),
  }));

  const totals = getChallanTotals(normalizedItems);

  return {
    company: {
      name: data.companyName || "-",
      tagline: data.companyTagline || "",
      telephone: data.companyTelephone || "-",
      email: data.companyEmail || "-",
      address: data.companyAddress || "-",
      city: data.companyCity || "-",
      state: data.companyState || "-",
      postCode: data.companyPostCode || "-",
      country: data.companyCountry || "-",
      gstNumber: data.companyGSTNumber || "-",
    },
    client: {
      name: data.clientName || "-",
      telephone: data.clientTelephone || "-",
      email: data.clientEmail || "-",
      address: data.clientAddress || "-",
      city: data.clientCity || "-",
      state: data.clientState || "-",
      postCode: data.clientPostCode || "-",
      country: data.clientCountry || "-",
      gstNumber: data.clientGSTNumber || "-",
    },
    challan: {
      id: data.id || "-",
      number: data.challanNumber || "-",
      date: formatChallanDate(data.challanDate),
      orderDate: formatChallanDate(data.orderDate),
      poNumber: data.poNumber || "-",
    },
    items,
    totalPieces: totals.totalPieces,
    totalQuantity: totals.totalQuantity,
    amount: totals.amount,
  };
}
