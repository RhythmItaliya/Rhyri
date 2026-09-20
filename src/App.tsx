import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { InvoiceLayout } from "./pages/Invoice/InvoiceLayout";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/Home";
import { SignInPage } from "./pages/SignIn";
import { ClientLayout } from "./pages/Client/ClientLayout";
import { CompanyLayout } from "./pages/Company/CompanyLayout";
import NotFoundPage from "./components/NotFoundPage";
import { BankLayout } from "./pages/Bank/BankLayout";
import AdminRoute from "./components/AdminRoute";

// Pages
const DashboardPage = React.lazy(() =>
  import("./pages/Dashboard").then((module) => ({
    default: module.DashboardPage,
  })),
);

const InvoicesPage = React.lazy(() =>
  import("./pages/Invoices").then((module) => ({
    default: module.InvoicesPage,
  })),
);

const PurchaseBillsPage = React.lazy(() =>
  import("./pages/PurchaseBills").then((module) => ({
    default: module.PurchaseBillsPage,
  })),
);

const ChallansPage = React.lazy(() =>
  import("./pages/Challans").then((module) => ({
    default: module.ChallansPage,
  })),
);

const ClientsPage = React.lazy(() =>
  import("./pages/Clientes").then((module) => ({
    default: module.ClientsPage,
  })),
);

const CompaniesPage = React.lazy(() =>
  import("./pages/Companies").then((module) => ({
    default: module.CompaniesPage,
  })),
);

const BanksPage = React.lazy(() =>
  import("./pages/Banks").then((module) => ({ default: module.BanksPage })),
);

const AdminPage = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminPage })),
);

const BackupPage = React.lazy(() =>
  import("./pages/Backup").then((module) => ({ default: module.BackupPage })),
);

// Create Page
const CreateInvoicePage = React.lazy(() =>
  import("./pages/Invoice/new").then((module) => ({
    default: module.CreateInvoicePage,
  })),
);

const CreatePurchaseBillPage = React.lazy(() =>
  import("./pages/PurchaseBill/new").then((module) => ({
    default: module.CreatePurchaseBillPage,
  })),
);

const CreateChallanPage = React.lazy(() =>
  import("./pages/Challan/new").then((module) => ({
    default: module.CreateChallanPage,
  })),
);

const CreateClientPage = React.lazy(() =>
  import("./pages/Client/new").then((module) => ({
    default: module.CreateClientPage,
  })),
);

const CreateCompanyPage = React.lazy(() =>
  import("./pages/Company/new").then((module) => ({
    default: module.CreateCompanyPage,
  })),
);

const CreateBankPage = React.lazy(() =>
  import("./pages/Bank/new").then((module) => ({
    default: module.CreateBankPage,
  })),
);

// Page
const InvoicePage = React.lazy(() =>
  import("./pages/Invoice").then((module) => ({ default: module.InvoicePage })),
);

const PurchaseBillPage = React.lazy(() =>
  import("./pages/PurchaseBill").then((module) => ({
    default: module.PurchaseBillPage,
  })),
);

const ChallanPage = React.lazy(() =>
  import("./pages/Challan").then((module) => ({
    default: module.ChallanPage,
  })),
);

const ClientPage = React.lazy(() =>
  import("./pages/Client").then((module) => ({ default: module.ClientPage })),
);

const CompanyPage = React.lazy(() =>
  import("./pages/Company").then((module) => ({ default: module.CompanyPage })),
);

const BankPage = React.lazy(() =>
  import("./pages/Bank").then((module) => ({ default: module.BankPage })),
);

// Edit Page
const EditInvoicePage = React.lazy(() =>
  import("./pages/Invoice/edit").then((module) => ({
    default: module.EditInvoicePage,
  })),
);

const EditPurchaseBillPage = React.lazy(() =>
  import("./pages/PurchaseBill/edit").then((module) => ({
    default: module.EditPurchaseBillPage,
  })),
);

const EditChallanPage = React.lazy(() =>
  import("./pages/Challan/edit").then((module) => ({
    default: module.EditChallanPage,
  })),
);

const EditClientPage = React.lazy(() =>
  import("./pages/Client/edit").then((module) => ({
    default: module.EditClientPage,
  })),
);

const EditCompanyPage = React.lazy(() =>
  import("./pages/Company/edit").then((module) => ({
    default: module.EditCompanyPage,
  })),
);

const EditBankPage = React.lazy(() =>
  import("./pages/Bank/edit").then((module) => ({
    default: module.EditBankPage,
  })),
);

// Other
const ClientAllInvoice = React.lazy(() =>
  import("./pages/Client/all/index").then((module) => ({
    default: module.ClientAllInvoice,
  })),
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />

      <Route element={<RootLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/purchase-bills" element={<PurchaseBillsPage />} />
        <Route path="/challans" element={<ChallansPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/banks" element={<BanksPage />} />
        <Route path="/backup" element={<BackupPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route element={<InvoiceLayout />}>
        <Route path="/invoice/new" element={<CreateInvoicePage />} />
        <Route path="/invoice/edit/:id" element={<EditInvoicePage />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
        <Route path="/purchase-bill/new" element={<CreatePurchaseBillPage />} />
        <Route
          path="/purchase-bill/edit/:id"
          element={<EditPurchaseBillPage />}
        />
        <Route path="/purchase-bill/:id" element={<PurchaseBillPage />} />
        <Route path="/challan/new" element={<CreateChallanPage />} />
        <Route path="/challan/edit/:id" element={<EditChallanPage />} />
        <Route path="/challan/:id" element={<ChallanPage />} />
      </Route>

      <Route element={<ClientLayout />}>
        <Route path="/client/new" element={<CreateClientPage />} />
        <Route path="/client/edit/:id" element={<EditClientPage />} />
        <Route path="/client/invoice/:id" element={<ClientAllInvoice />} />
        <Route path="/client/:id" element={<ClientPage />} />
      </Route>

      <Route element={<CompanyLayout />}>
        <Route path="/company/new" element={<CreateCompanyPage />} />
        <Route path="/company/edit/:id" element={<EditCompanyPage />} />
        <Route path="/company/:id" element={<CompanyPage />} />
      </Route>

      <Route element={<BankLayout />}>
        <Route path="/bank/new" element={<CreateBankPage />} />
        <Route path="/bank/edit/:id" element={<EditBankPage />} />
        <Route path="/bank/:id" element={<BankPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
