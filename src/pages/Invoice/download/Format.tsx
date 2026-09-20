import React from "react";
import { FormatTestProps } from "../../../types/invoiceTypes";
import { formatCurrency } from "../../../lib/utils";

const buildAddress = (parts: Array<string | undefined>) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part !== "" && part !== "-")
    .join(", ");

// Compact the product rows as the item count grows so the full list always fits
// the page without overflowing. Existing sizes (<=20 items) are unchanged.
const invoiceItemFontSize = (count: number) =>
  count > 45
    ? "7px"
    : count > 30
      ? "8px"
      : count > 20
        ? "9px"
        : count > 13
          ? "10px"
          : "12px";

const invoiceItemPadding = (count: number) =>
  count > 45
    ? "1px 3px"
    : count > 30
      ? "1px 4px"
      : count > 20
        ? "2px 4px"
        : count > 13
          ? "3px 4px"
          : "4px";

const FormatTest: React.FC<FormatTestProps> = ({ data, fieldNames }) => {
  const {
    company,
    invoice,
    customer,
    items,
    totals,
    bankDetails,
    totalInWords,
    termsAndConditions,
  } = data;

  const itemFontSize = invoiceItemFontSize(items.length);
  const itemPadding = invoiceItemPadding(items.length);
  const customerAddress =
    buildAddress([
      customer.clientAddress,
      customer.clientCity,
      customer.clientPostCode,
      customer.clientCountry,
    ]) || " - ";

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
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            padding: "8px 0",
            fontWeight: "900",
            textTransform: "uppercase",
            color: "blue",
            textAlign: "center",
            margin: 0,
            width: "100%",
            borderBottom: "1px solid black",
          }}
        >
          {company.companyName}
        </h1>
      </div>

      {/* Sub Title */}
      <h2
        style={{
          fontSize: "14px",
          padding: "8px",
          fontWeight: "700",
          textTransform: "uppercase",
          color: "#1f2937",
          borderBottom: "1px solid black",
          textAlign: "center",
          margin: 0,
        }}
      >
        {company.companyTagline}
      </h2>

      <div style={{ display: "flex" }}>
        {/* Address Section */}
        <div
          style={{
            width: "50%",
            display: "flex",
            textAlign: "left",
            paddingLeft: "8px",
            borderRight: "1px solid black",
            padding: "4px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              lineHeight: "1.25",
              margin: 0,
            }}
          >
            <span style={{ display: "block", marginBottom: "4px" }}>
              {company.companyAddress}
            </span>
            <span style={{ display: "block", marginBottom: "4px" }}>
              {company.companyCity}, {company.companyPostCode}
            </span>
            <span style={{ display: "block" }}>
              {company.companyState}, {company.companyCountry}
            </span>
          </p>
        </div>

        {/* Contact Info Section */}
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            textAlign: "right",
            paddingRight: "8px",
            padding: "4px",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#4b5563" }}>{fieldNames.contactName}</span>
              <span style={{ fontWeight: "600" }}>
                {company.companyPersonName}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#4b5563" }}>{fieldNames.contactTel}</span>
              <span style={{ fontWeight: "600" }}>
                {company.companyTelephone}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#4b5563" }}>
                {fieldNames.contactEmail}
              </span>
              <span style={{ fontWeight: "600", textTransform: "lowercase" }}>
                {company.companyEmail}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GST Section */}
      <div style={{ borderTop: "1px solid black" }}>
        <div style={{ display: "flex", borderBottom: "1px solid black" }}>
          <div
            style={{
              flex: 1,
              borderRight: "1px solid black",
              padding: "8px",
            }}
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
              <span style={{ textAlign: "left" }}>{fieldNames.gstin}</span>
              <span
                style={{
                  fontWeight: "600",
                  color: "black",
                  textAlign: "right",
                }}
              >
                {company.companyGSTNumber}
              </span>
            </p>
          </div>
          <div
            style={{
              flex: 1,
              borderRight: "1px solid black",
              padding: "8px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "blue",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {fieldNames.invoiceTax}
            </p>
          </div>
          <div style={{ flex: 1, padding: "8px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {fieldNames.originalForReceipt}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Customer Details Section */}
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
                  {fieldNames.customerDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    padding: "4px",
                    textAlign: "left",
                    paddingLeft: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.customerName}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {customer.clientName}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    padding: "4px",
                    textAlign: "left",
                    paddingLeft: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.customerAddress}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {customerAddress}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    paddingLeft: "8px",
                    padding: "4px",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.gstin}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {customer.clientGSTNumber}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    paddingLeft: "8px",
                    padding: "4px",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.customerTel}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {customer.clientTelephone}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    paddingLeft: "8px",
                    padding: "4px",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.customerEmail}
                </td>
                <td
                  style={{
                    textTransform: "lowercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {customer.clientEmail}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Details Section */}
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
                  {fieldNames.invoiceDetails}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    padding: "4px",
                    textTransform: "uppercase",
                    textAlign: "left",
                    paddingLeft: "8px",
                  }}
                >
                  {fieldNames.invoiceNo}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {invoice.invoiceCustomNumber}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    padding: "4px",
                    textTransform: "uppercase",
                    textAlign: "left",
                    paddingLeft: "8px",
                  }}
                >
                  {fieldNames.invoiceCreateDate}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {invoice.creationDate}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "#4b5563",
                    padding: "4px",
                    textTransform: "uppercase",
                    textAlign: "left",
                    paddingLeft: "8px",
                  }}
                >
                  {fieldNames.dueDate}
                </td>
                <td
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    textAlign: "right",
                    paddingRight: "8px",
                  }}
                >
                  {invoice.dueDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Section */}
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

      {/* Data Section */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              <th
                style={{ textAlign: "center", padding: "8px 0", width: "5%" }}
              >
                {fieldNames.srNo}
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 4px",
                  width: "45%",
                  borderLeft: "1px solid black",
                }}
              >
                {fieldNames.productName}
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  width: "10%",
                  borderLeft: "1px solid black",
                }}
              >
                {fieldNames.challanNo}
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  width: "13%",
                  borderLeft: "1px solid black",
                }}
              >
                {fieldNames.qty}
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  width: "13%",
                  borderLeft: "1px solid black",
                }}
              >
                {fieldNames.rate}
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  width: "14%",
                  borderLeft: "1px solid black",
                }}
              >
                {fieldNames.total}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ height: "1px" }}>
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
                  }}
                >
                  {(item.name || "").toUpperCase()}
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
                  {(item.challanNumber || "-").toUpperCase()}
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
                  {item.qty}
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
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
            {/* Filler Row for Full-Page Vertical Lines */}
            <tr>
              <td style={{ height: "100%" }}></td>
              <td style={{ borderLeft: "1px solid black" }}></td>
              <td style={{ borderLeft: "1px solid black" }}></td>
              <td style={{ borderLeft: "1px solid black" }}></td>
              <td style={{ borderLeft: "1px solid black" }}></td>
              <td style={{ borderLeft: "1px solid black" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div
        style={{
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
          display: "flex",
          width: "100%",
          fontSize: "12px",
          color: "blue",
        }}
      >
        <div
          style={{
            width: "86%",
            padding: "8px",
            textAlign: "center",
            fontWeight: "700",
            textTransform: "uppercase",
            boxSizing: "border-box",
          }}
        >
          {fieldNames.total}
        </div>
        <div
          style={{
            width: "14%",
            padding: "8px 16px 8px 8px",
            textAlign: "right",
            fontWeight: "700",
            borderLeft: "1px solid black",
            boxSizing: "border-box",
          }}
        >
          {formatCurrency(totals.totalAmount)}
        </div>
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
              {fieldNames.totalInWords}
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#1f2937",
                minHeight: "3rem",
                padding: "8px",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {totalInWords}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#4b5563" }}>{fieldNames.bankName}</span>
                <span style={{ fontWeight: "600" }}>
                  {bankDetails.bankName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#4b5563" }}>
                  {fieldNames.accountNumber}
                </span>
                <span style={{ fontWeight: "600" }}>
                  {bankDetails.bankAccountNumber}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#4b5563" }}>{fieldNames.ifscCode}</span>
                <span style={{ fontWeight: "600" }}>
                  {bankDetails.bankIfscCode}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#4b5563" }}>
                  {fieldNames.branchName}
                </span>
                <span style={{ fontWeight: "600" }}>
                  {bankDetails.bankBranchName}
                </span>
              </div>
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
                {fieldNames.termsAndConditions}
              </p>
            </div>
            <ul
              style={{
                listStyleType: "disc",
                listStylePosition: "inside",
                fontSize: "12px",
                color: "#1f2937",
                padding: "8px",
                margin: 0,
              }}
            >
              {termsAndConditions.map((term, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Count Section */}
        <div style={{ flex: 1, borderLeft: "1px solid black" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    width: "72%",
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.discount} ({totals.discountPercent}
                  {totals.discountType === "percentage" ? "%" : "₹"})
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(totals.discountApplied)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.totalBeforeTax}
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(totals.totalBeforeTax)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.gst} ({totals.gstPercent}%)
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {totals.gstAmount}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.sgst} ({totals.sgstPercent}%)
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {totals.sgstAmount}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.otherTax} ({totals.otherTaxPercent}
                  {totals.otherTaxType === "percentage" ? "%" : "₹"})
                </td>
                <td
                  style={{
                    padding: "4px 16px",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(totals.otherTaxAmount)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    padding: "0 16px",
                    borderRight: "1px solid black",
                    fontWeight: "600",
                    textAlign: "left",
                    textTransform: "uppercase",
                  }}
                ></td>
                <td
                  style={{
                    padding: "0 16px",
                    borderTop: "1px solid black",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(totals.finalAmount)}
                </td>
              </tr>
              <tr style={{ fontSize: "18px", borderTop: "1px solid black" }}>
                <td
                  style={{
                    padding: "4px 16px",
                    borderRight: "1px solid black",
                    fontWeight: "700",
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
                    fontWeight: "700",
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
                  fontWeight: "700",
                  color: "#1f2937",
                  textTransform: "uppercase",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {company.companyName}
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
                  padding: "4px 0 12px 0",
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

export default FormatTest;
