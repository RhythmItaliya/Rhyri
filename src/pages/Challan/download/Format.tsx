import React from "react";

import { formatCurrency } from "../../../lib/utils";
import { TransformedChallan } from "../../../types/challanTypes";
import challanFieldNames from "./fieldNames.json";
import { toChallanNumber } from "../challanUtils";

interface ChallanFormatProps {
  data: TransformedChallan;
}

type ChallanCopyPosition = "top" | "bottom";

const muted = "#4b5563";
const challanCopyHeight = "138.5mm";
const cropLineHeight = "6mm";

const defaultFieldNames = {
  companyTagline: "ALL TYPES OF COMPUTERIZED EMBROIDERY JOB WORK",
  contactTel: "Telephone",
  contactEmail: "Email",
  gstin: "GSTIN",
  customerDetails: "Customer Details",
  customerName: "M/s",
  customerAddress: "Address",
  customerTel: "Telephone",
  customerEmail: "Email",
  challanNo: "Challan No",
  date: "Date",
  productDetails: "Product Details",
  srNo: "Sr.",
  productName: "Product Name",
  designNumber: "Design No",
  size: "Size",
  pieces: "Pcs",
  qty: "Qty",
  rate: "Rate",
  amount: "Amount",
  total: "Total",
  authorisedSignature: "Authorised Signature",
  deliveryChallan: "Delivery Challan",
  officeCopy: "Office Copy",
  challanDetails: "Challan Details",
  poNo: "P.O. No",
  orderDate: "Order Date",
  receivedBy: "Received By",
  totalPcs: "Total Pcs",
  totalQty: "Total Qty",
  for: "For",
  challanCondition:
    "If any difference is found in Quantity and Rate etc., It should be notified in writing within 24 hours. No Claim will be entertained thereafter.",
};

const fieldNames = Object.assign({}, defaultFieldNames, challanFieldNames);

const compactText = {
  margin: 0,
  fontSize: "8px",
  lineHeight: 1.35,
} as const;

const labelCell = {
  color: muted,
  padding: "1mm 2mm",
  textAlign: "left",
  textTransform: "uppercase",
} as const;

const valueCell = {
  fontWeight: 700,
  padding: "1mm 2mm",
  textAlign: "right",
  textTransform: "uppercase",
} as const;

const tableCell = {
  padding: "1mm 1.5mm",
  verticalAlign: "top",
  fontSize: "8px",
} as const;

const borderedCell = {
  ...tableCell,
  borderLeft: "1px solid black",
} as const;

const formatNumber = (value: number | string | undefined, digits = 2) =>
  toChallanNumber(value).toFixed(digits);

const buildAddress = (parts: Array<string | undefined>) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part !== "" && part !== "-")
    .join(", ");

// Compact the product rows as the item count grows so the full list always fits
// inside the fixed-height challan copy without overflowing (or being truncated).
const getItemRowLayout = (count: number) => {
  if (count <= 6)
    return { fontSize: "8px", padding: "1mm 1.5mm", lineHeight: 1.35 };
  if (count <= 9)
    return { fontSize: "7px", padding: "0.6mm 1.2mm", lineHeight: 1.2 };
  if (count <= 12)
    return { fontSize: "6.5px", padding: "0.5mm 1mm", lineHeight: 1.15 };
  if (count <= 16)
    return { fontSize: "6px", padding: "0.4mm 0.9mm", lineHeight: 1.1 };
  if (count <= 22)
    return { fontSize: "5.5px", padding: "0.3mm 0.8mm", lineHeight: 1.05 };
  if (count <= 30)
    return { fontSize: "5px", padding: "0.25mm 0.7mm", lineHeight: 1 };
  return { fontSize: "4.5px", padding: "0.2mm 0.6mm", lineHeight: 1 };
};

function InfoTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <table
      style={{ width: "100%", fontSize: "8px", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th
            colSpan={2}
            style={{
              color: muted,
              padding: "1.5mm",
              borderBottom: "1px solid black",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, value]) => (
          <tr key={name}>
            <td style={labelCell}>{name}</td>
            <td style={valueCell}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChallanCopy({
  data,
  position,
}: ChallanFormatProps & { position: ChallanCopyPosition }) {
  const {
    company,
    client,
    challan,
    items,
    totalPieces,
    totalQuantity,
    amount,
  } = data;
  const itemLayout = getItemRowLayout(items.length);
  const clientAddress =
    buildAddress([
      client.address,
      client.city,
      client.state,
      client.postCode,
      client.country,
    ]) || "-";
  const itemCell = {
    ...tableCell,
    padding: itemLayout.padding,
    fontSize: itemLayout.fontSize,
    lineHeight: itemLayout.lineHeight,
  } as const;
  const itemBorderedCell = {
    ...borderedCell,
    padding: itemLayout.padding,
    fontSize: itemLayout.fontSize,
    lineHeight: itemLayout.lineHeight,
  } as const;

  return (
    <section
      style={{
        height: challanCopyHeight,
        color: "black",
        background: "#ffffff",
        border: "1px solid black",
        borderBottom: position === "top" ? 0 : "1px solid black",
        borderTop: position === "bottom" ? 0 : "1px solid black",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pageBreakInside: "avoid",
      }}
    >
      <h1
        style={{
          fontSize: "16px",
          padding: "2mm 0",
          fontWeight: 900,
          textTransform: "uppercase",
          color: "blue",
          textAlign: "center",
          margin: 0,
          borderBottom: "1px solid black",
        }}
      >
        {company.name}
      </h1>

      {company.tagline || fieldNames.companyTagline ? (
        <h2
          style={{
            fontSize: "9px",
            padding: "1mm 2mm",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#1f2937",
            borderBottom: "1px solid black",
            textAlign: "center",
            margin: 0,
          }}
        >
          {company.tagline || fieldNames.companyTagline}
        </h2>
      ) : null}

      <div style={{ display: "flex", borderBottom: "1px solid black" }}>
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            padding: "1.5mm 2mm",
            textTransform: "uppercase",
          }}
        >
          <p style={{ ...compactText, fontWeight: 700 }}>{company.address}</p>
          <p style={compactText}>
            {company.city}, {company.postCode}
          </p>
          <p style={compactText}>
            {company.state}, {company.country}
          </p>
        </div>
        <div style={{ width: "50%", padding: "1.5mm 2mm" }}>
          {[
            [fieldNames.contactTel, company.telephone],
            [fieldNames.contactEmail, company.email],
          ].map(([name, value]) => (
            <p
              key={name}
              style={{
                ...compactText,
                display: "flex",
                justifyContent: "space-between",
                textTransform:
                  name === fieldNames.contactEmail ? undefined : "uppercase",
              }}
            >
              <span style={{ color: muted, textTransform: "uppercase" }}>
                {name}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  textAlign: "right",
                  textTransform:
                    name === fieldNames.contactEmail
                      ? "lowercase"
                      : "uppercase",
                }}
              >
                {value}
              </span>
            </p>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid black" }}>
        <div
          style={{ flex: 1, borderRight: "1px solid black", padding: "1.5mm" }}
        >
          <p
            style={{
              ...compactText,
              display: "flex",
              justifyContent: "space-between",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: muted }}>{fieldNames.gstin}</span>
            <span style={{ fontWeight: 700 }}>{company.gstNumber}</span>
          </p>
        </div>
        <div
          style={{ flex: 1, borderRight: "1px solid black", padding: "1.5mm" }}
        >
          <p
            style={{
              ...compactText,
              fontWeight: 900,
              textAlign: "center",
              textTransform: "uppercase",
              color: "blue",
            }}
          >
            {fieldNames.deliveryChallan}
          </p>
        </div>
        <div style={{ flex: 1, padding: "1.5mm" }}>
          <p
            style={{
              ...compactText,
              fontWeight: 700,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {fieldNames.officeCopy}
          </p>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, borderBottom: "1px solid black" }}>
          <InfoTable
            title={fieldNames.customerDetails}
            rows={[
              [fieldNames.customerName, client.name],
              [fieldNames.gstin, client.gstNumber],
              [fieldNames.customerTel, client.telephone],
              [fieldNames.customerEmail, client.email],
            ]}
          />
        </div>
        <div
          style={{
            flex: 1,
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
          }}
        >
          <table
            style={{
              width: "100%",
              fontSize: "8px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    color: muted,
                    padding: "1.5mm",
                    borderBottom: "1px solid black",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {fieldNames.customerAddress}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    ...tableCell,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {clientAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style={{
            flex: 1,
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
          }}
        >
          <InfoTable
            title={fieldNames.challanDetails}
            rows={[
              [fieldNames.challanNo, challan.number],
              [fieldNames.date, challan.date],
              [fieldNames.poNo, challan.poNumber],
              [fieldNames.orderDate, challan.orderDate],
            ]}
          />
        </div>
      </div>

      <p
        style={{
          ...compactText,
          color: muted,
          padding: "1.5mm",
          textAlign: "center",
          borderBottom: "1px solid black",
          fontWeight: 700,
        }}
      >
        {fieldNames.productDetails}
      </p>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <table
          style={{
            width: "100%",
            height: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            textTransform: "uppercase",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid black",
              }}
            >
              {[
                [fieldNames.srNo, "6%", "center"],
                [fieldNames.productName, "34%", "left"],
                [fieldNames.designNumber, "13%", "center"],
                [fieldNames.size, "10%", "center"],
                [fieldNames.pieces, "8%", "center"],
                [fieldNames.qty, "10%", "center"],
                [fieldNames.rate, "9%", "center"],
                [fieldNames.amount, "10%", "center"],
              ].map(([heading, width, align], index) => (
                <th
                  key={heading}
                  style={{
                    ...tableCell,
                    width,
                    padding: itemLayout.padding,
                    fontSize: itemLayout.fontSize,
                    lineHeight: itemLayout.lineHeight,
                    fontWeight: 800,
                    textAlign: align as "left" | "center",
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
                key={`${item.description}-${index}`}
                style={{ height: "1px" }}
              >
                <td style={{ ...itemCell, textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={itemBorderedCell}>{item.description}</td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {item.designNumber || "-"}
                </td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {item.size || "-"}
                </td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {formatNumber(item.pieces, 0)}
                </td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {formatNumber(item.quantity, 2)}
                </td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {formatCurrency(item.rate)}
                </td>
                <td style={{ ...itemBorderedCell, textAlign: "center" }}>
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ height: "100%" }}></td>
              {Array.from({ length: 7 }).map((_, index) => (
                <td key={index} style={{ borderLeft: "1px solid black" }}></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: "1px solid black" }}>
        <table
          style={{
            width: "100%",
            fontSize: "8px",
            color: "blue",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: "1.5mm",
                  textAlign: "center",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {fieldNames.total}
              </td>
              <td
                style={{
                  width: "10%",
                  padding: "1.5mm",
                  textAlign: "center",
                  fontWeight: 700,
                  borderLeft: "1px solid black",
                }}
              >
                {formatCurrency(amount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          minHeight: "20mm",
          borderTop: "1px solid black",
        }}
      >
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            padding: "2mm",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              ...compactText,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {fieldNames.receivedBy} : ____________________
          </p>
          <p style={{ ...compactText, marginTop: "2mm" }}>
            {fieldNames.challanCondition}
          </p>
          <p
            style={{
              ...compactText,
              marginTop: "2mm",
              display: "flex",
              gap: "6mm",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            <span>
              {fieldNames.totalPcs}: {formatNumber(totalPieces, 0)}
            </span>
            <span>
              {fieldNames.totalQty}: {formatNumber(totalQuantity, 2)}
            </span>
          </p>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2mm 2mm 1.5mm",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              ...compactText,
              fontWeight: 800,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {fieldNames.for}, {company.name}
          </p>
          <div style={{ width: "100%" }}>
            <div style={{ borderTop: "1px solid black", width: "100%" }}></div>
            <p style={{ ...compactText, textAlign: "center" }}>
              {fieldNames.authorisedSignature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CropLine() {
  return (
    <div
      style={{
        height: cropLineHeight,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundImage:
            "repeating-linear-gradient(to right, black 0, black 4px, transparent 4px, transparent 8px)",
        }}
      />
    </div>
  );
}

const ChallanFormat: React.FC<ChallanFormatProps> = ({ data }) => (
  <div
    style={{
      width: "196mm",
      height: "283mm",
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      color: "black",
      boxSizing: "border-box",
      overflow: "hidden",
    }}
  >
    <ChallanCopy data={data} position="top" />
    <CropLine />
    <ChallanCopy data={data} position="bottom" />
  </div>
);

export default ChallanFormat;
