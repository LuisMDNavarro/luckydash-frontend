import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import AccountsCards from '../../components/finances/AccountCards'
import '../../styles/Finance.css'
import '../../styles/Alert.css'

export default function AccountsList() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <AccountsCards />
          </div>
        </div>
      </div>
    </>
  )
}
