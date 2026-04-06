import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'

export default function AccountsList() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <p>Wallet Content</p>
          </div>
        </div>
      </div>
    </>
  )
}
