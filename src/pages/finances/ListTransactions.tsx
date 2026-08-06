import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TransactionList from '../../components/finances/TransactionList'
import '../../styles/Finance.css'
import '../../styles/Alert.css'

export default function TransactionsList() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <TransactionList />
          </div>
        </div>
      </div>
    </>
  )
}