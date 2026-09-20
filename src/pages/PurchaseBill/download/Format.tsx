import React from "react";

import { formatCurrency } from "../../../lib/utils";
import { TransformedPurchaseBill } from "../../../types/purchaseBillTypes";
import fieldNames from "./fieldNames.json";
import { toPurchaseBillNumber } from "../purchaseBillUtils";

interface PurchaseBillFormatProps {
  data: TransformedPurchaseBill;
}

const labelCell = {
  color: "#4b5563",
  padding: "4px",
  paddingLeft: "8px",
  textAlign: "left",
  textTransform: "uppercase",
} as const;

const valueCell = {
  fontWeight: 600,
  padding: "4px",
  paddingRight: "8px",
  textAlign: "right",
  textTransform: "uppercase",
} as const;

// Compact the product rows as the item count grows so the full list always fits
// the page without overflowing. Existing sizes (<=20 items) are unchanged.
const tableFontSize = (itemsLength: number) =>
  itemsLength > 45
    ? "7px"
    : itemsLength > 30
      ? "8px"
      : itemsLength > 20
        ? "9px"
        : itemsLength > 13
          ? "10px"
          : "12px";

const tablePadding = (itemsLength: number) =>
  itemsLength > 45
    ? "1px 3px"
    : itemsLength > 30
      ? "1px 4px"
      : itemsLength > 20
        ? "2px 4px"
        : itemsLength > 13
          ? "3px 4px"
          : "4px";

const buildAddress = (parts: Array<string | undefined>) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part !== "" && part !== "-")
    .join(", ");

const formatNumber = (value: number | string | undefined, digits = 2) =>
  toPurchaseBillNumber(value).toFixed(digits);

const PurchaseBillFormat: React.FC<PurchaseBillFormatProps> = ({ data }) => {
  const {
    supplier,
    buyer,
    bill,
    items,
    totals,
    bankDetails,
    billAmountInWords,
    termsAndConditions,
  } = data;
  const itemFontSize = tableFontSize(items.length);
  const itemPadding = tablePadding(items.length);
  const documentCompany = buyer;
  const counterparty = supplier;
  const counterpartyAddress =
    buildAddress([
      counterparty.address,
      counterparty.city,
      counterparty.state,
      counterparty.postCode,
      counterparty.country,
    ]) || "-";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "283mm",
        width: "196mm",
        border: "1px solid black",
        background: "white",
        boxSizing: "border-box",
        overflow: "hidden",
        color: "black",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          padding: "8px 0",
          fontWeight: 900,
          textTransform: "uppercase",
          color: "blue",
          textAlign: "center",
          margin: 0,
          width: "100%",
          borderBottom: "1px solid black",
        }}
      >
        {documentCompany.name}
      </h1>

      {fieldNames.companyTagline ? (
        <h2
          style={{
            fontSize: "14px",
            padding: "8px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#1f2937",
            borderBottom: "1px solid black",
            textAlign: "center",
            margin: 0,
          }}
        >
          {fieldNames.companyTagline}
        </h2>
      ) : null}

      <h2
        style={{
          fontSize: "14px",
          padding: "8px",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#1f2937",
          borderBottom: "1px solid black",
          textAlign: "center",
          margin: 0,
        }}
      >
        {documentCompany.address}, {documentCompany.city},{" "}
        {documentCompany.state}
      </h2>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "50%",
            display: "flex",
            textAlign: "left",
            borderRight: "1px solid black",
            padding: "4px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            <span style={{ display: "block", marginBottom: "4px" }}>
              {documentCompany.address}
            </span>
            <span style={{ display: "block", marginBottom: "4px" }}>
              {documentCompany.city}, {documentCompany.postCode}
            </span>
            <span style={{ display: "block" }}>
              {documentCompany.state}, {documentCompany.country}
            </span>
          </p>
        </div>

        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            textAlign: "right",
            padding: "4px",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#4b5563" }}>{fieldNames.contactTel}</span>
              <span style={{ fontWeight: 600 }}>
                {documentCompany.telephone}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#4b5563" }}>
                {fieldNames.contactEmail}
              </span>
              <span style={{ fontWeight: 600, textTransform: "lowercase" }}>
                {documentCompany.email}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#4b5563" }}>{fieldNames.place}</span>
              <span style={{ fontWeight: 600 }}>{bill.placeOfSupply}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid black" }}>
        <div style={{ display: "flex", borderBottom: "1px solid black" }}>
          <div
            style={{ flex: 1, borderRight: "1px solid black", padding: "8px" }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                textTransform: "uppercase",
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "8px",
                paddingRight: "8px",
                margin: 0,
              }}
            >
              <span>{fieldNames.gstin}</span>
              <span style={{ fontWeight: 600, color: "black" }}>
                {documentCompany.gstNumber}
              </span>
            </p>
          </div>
          <div
            style={{ flex: 1, borderRight: "1px solid black", padding: "8px" }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "blue",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {fieldNames.purchaseBill}
            </p>
          </div>
          <div style={{ flex: 1, padding: "8px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "black",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {bill.copyType}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", borderBottom: "1px solid black" }}>
          <table style={{ width: "100%", fontSize: "12px" }}>
            <thead>
              <tr>
                <th
                  colSpan={2}
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    color: "#4b5563",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                >
                  {fieldNames.supplierDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={labelCell}>{fieldNames.customerName}</td>
                <td style={valueCell}>{counterparty.name}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.customerAddress}</td>
                <td style={valueCell}>{counterpartyAddress}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.gstin}</td>
                <td style={valueCell}>{counterparty.gstNumber}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.customerTel}</td>
                <td style={valueCell}>{counterparty.telephone}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.customerEmail}</td>
                <td style={{ ...valueCell, textTransform: "lowercase" }}>
                  {counterparty.email}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            width: "50%",
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
          }}
        >
          <table style={{ width: "100%", fontSize: "12px" }}>
            <thead>
              <tr>
                <th
                  colSpan={2}
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    color: "#4b5563",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                >
                  {fieldNames.purchaseBillDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={labelCell}>{fieldNames.billNo}</td>
                <td style={valueCell}>{bill.number}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.billDate}</td>
                <td style={valueCell}>{bill.date}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.dueDate}</td>
                <td style={valueCell}>{bill.dueDate}</td>
              </tr>
              <tr>
                <td style={labelCell}>{fieldNames.vehicleNo}</td>
                <td style={valueCell}>{bill.vehicleNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: "12px", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  fontSize: "14px",
                  textAlign: "center",
                  borderBottom: "1px solid black",
                  color: "#4b5563",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              >
                {fieldNames.productDetails}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <table
          style={{
            width: "100%",
            height: "100%",
            fontSize: itemFontSize,
            color: "black",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid black",
                backgroundColor: "#f9fafb",
              }}
            >
              {[
                [fieldNames.srNo, "5%", "center"],
                [fieldNames.productName, "45%", "left"],
                [fieldNames.hsnSac, "10%", "center"],
                [fieldNames.qty, "13%", "center"],
                [fieldNames.rate, "13%", "center"],
                [fieldNames.total, "14%", "center"],
              ].map(([heading, width, align], index) => (
                <th
                  key={heading}
                  style={{
                    width,
                    textAlign: align as "left" | "center",
                    padding: "8px 4px",
                    borderLeft: index === 0 ? undefined : "1px solid black",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.productName}-${index}`}
                style={{ height: "1px" }}
              >
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "center",
                    fontSize: itemFontSize,
                    verticalAlign: "top",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "left",
                    fontSize: itemFontSize,
                    borderLeft: "1px solid black",
                    verticalAlign: "top",
                    textTransform: "uppercase",
                  }}
                >
                  {item.productName}
                </td>
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "center",
                    fontSize: itemFontSize,
                    borderLeft: "1px solid black",
                    verticalAlign: "top",
                  }}
                >
                  {item.hsnSac}
                </td>
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "center",
                    fontSize: itemFontSize,
                    borderLeft: "1px solid black",
                    verticalAlign: "top",
                  }}
                >
                  {formatNumber(item.quantity, 3)}
                </td>
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "center",
                    fontSize: itemFontSize,
                    borderLeft: "1px solid black",
                    verticalAlign: "top",
                  }}
                >
                  {formatCurrency(item.rate)}
                </td>
                <td
                  style={{
                    padding: itemPadding,
                    textAlign: "center",
                    fontSize: itemFontSize,
                    borderLeft: "1px solid black",
                    verticalAlign: "top",
                  }}
                >
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ height: "100%" }}></td>
              {Array.from({ length: 5 }).map((_, index) => (
                <td key={index} style={{ borderLeft: "1px solid black" }}></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
        }}
      >
        <table
          style={{
            width: "100%",
            fontSize: "12px",
            color: "blue",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "45%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td
                colSpan={5}
                style={{
                  padding: "8px",
                  fontWeight: 700,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {fieldNames.total}
              </td>
              <td
                style={{
                  width: "14%",
                  padding: "8px",
                  textAlign: "right",
                  fontWeight: 700,
                  borderLeft: "1px solid black",
                  paddingRight: "16px",
                }}
              >
                {formatCurrency(totals.subtotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", minHeight: "300px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
          }}
        >
          <div style={{ borderBottom: "1px solid black", flex: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#4b5563",
                marginBottom: "4px",
                textAlign: "center",
                borderBottom: "1px solid black",
                margin: 0,
              }}
            >
              {fieldNames.billAmountInWords}
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1f2937",
                minHeight: "3rem",
                padding: "8px",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {billAmountInWords}
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#4b5563",
                textAlign: "center",
                borderBottom: "1px solid black",
                margin: 0,
              }}
            >
              {fieldNames.bankDetails}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 16px",
                fontSize: "12px",
                color: "#1f2937",
                textTransform: "uppercase",
              }}
            >
              {[
                [fieldNames.bankName, bankDetails.bankName],
                [fieldNames.accountNumber, bankDetails.bankAccountNumber],
                [fieldNames.branchName, bankDetails.bankBranchName],
                [fieldNames.ifscCode, bankDetails.bankIfscCode],
              ].map(([name, value]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ color: "#4b5563" }}>{name}</span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, borderTop: "1px solid black", width: "100%" }}>
            <div style={{ borderBottom: "1px solid black" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#4b5563",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {fieldNames.termsAndCondition}
              </p>
            </div>
            <ol
              style={{
                listStyleType: "decimal",
                listStylePosition: "inside",
                fontSize: "12px",
                color: "#1f2937",
                padding: "8px",
                margin: 0,
              }}
            >
              {termsAndConditions.map((term) => (
                <li key={term} style={{ marginBottom: "4px" }}>
                  {term}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div style={{ flex: 1, borderLeft: "1px solid black" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                [fieldNames.subTotal, totals.subtotal],
                [fieldNames.taxableAmount, totals.taxableAmount],
                [
                  `${fieldNames.gst} (${formatNumber(totals.cgstRate)}%)`,
                  totals.cgstAmount,
                ],
                [
                  `${fieldNames.sgst} (${formatNumber(totals.sgstRate)}%)`,
                  totals.sgstAmount,
                ],
                [fieldNames.totalGst, totals.totalGstAmount],
              ].map(([name, value]) => (
                <tr key={name as string} style={{ fontSize: "12px" }}>
                  <td
                    style={{
                      width: "72%",
                      padding: "4px 16px",
                      borderRight: "1px solid black",
                      fontWeight: 600,
                      textAlign: "left",
                      textTransform: "uppercase",
                    }}
                  >
                    {name}
                  </td>
                  <td
                    style={{
                      padding: "4px 16px",
                      fontWeight: 700,
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(Number(value))}
                  </td>
                </tr>
              ))}
              <tr style={{ fontSize: "18px", borderTop: "1px solid black" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: 700,
                    textAlign: "center",
                    textTransform: "uppercase",
                    color: "blue",
                  }}
                >
                  {fieldNames.total}
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: 700,
                    textAlign: "right",
                    color: "blue",
                  }}
                >
                  {formatCurrency(totals.roundedAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ borderTop: "1px solid black" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#4b5563",
                  padding: "4px 0",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {fieldNames.candidateStatement}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1f2937",
                  textTransform: "uppercase",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {documentCompany.name}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                minHeight: "60px",
                flexGrow: 1,
              }}
            >
              <div
                style={{ borderTop: "1px solid black", width: "100%" }}
              ></div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#4b5563",
                  padding: "4px 0 12px",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {fieldNames.authorisedSignature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBillFormat;
