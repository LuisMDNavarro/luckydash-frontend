import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TicketList from '../../components/finances/TicketList'
import '../../styles/Finance.css'
import '../../styles/Alert.css'

export default function TicketsList() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <TicketList />
          </div>
        </div>
      </div>
    </>
  )
}
