import { BrowserRouter as Router , Routes , Route ,Navigate  } from 'react-router-dom'
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/sharred/Layout'
import Dashboard from './components/DashboardComponents/Dashboard'
import Products from './components/ProductComponents/Products'
import Customers from './components/CustomerComponents/Customers'
import Supliers from './components/SupplierComponents/Supliers'
import Profile from './components/ProfilePageComponents/Profile'
import Transactions from './components/TransactionsComponents/Transactions'
import Payments from './components/PaymentComponents/Payments'
import LoginRegister from './components/LoginRegister'
import SupplierDetail from './components/SupplierComponents/SupplierDetail'
import CustomerDetail from './components/CustomerComponents/CustomerDetail'
import ProductDetail from './components/ProductComponents/ProductDetail';
import IncomeTransactionDetail from './components/TransactionsComponents/IncomeTransactionDetail';
import ExpenseTransactionDetail from './components/TransactionsComponents/ExpenseTransactionDetail';
import IncomePaymentDetail from './components/PaymentComponents/IncomePaymentDetail';
import ExpensePaymentDetail from './components/PaymentComponents/ExpensePaymentDetail';
import ChancePassword from './components/ChancePassword';
function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <ProfileProvider>
          <Routes>

            <Route path="/" element={<LoginRegister />} />
                {isAuthenticated ? (
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<ChancePassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customer/:id" element={<CustomerDetail />} />
                    <Route path="/supliers" element={<Supliers />} />
                    <Route path="/supplier/:id" element={<SupplierDetail />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/incometransaction/:id" element={<IncomeTransactionDetail />} />
                    <Route path="/expensetransaction/:id" element={<ExpenseTransactionDetail />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/incomepayment/:id" element={<IncomePaymentDetail />} />
                    <Route path="/expensepayment/:id" element={<ExpensePaymentDetail />} />
                  </Route>
                ) : (

              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
      </ProfileProvider>
    </Router>
  );
}

export default App;