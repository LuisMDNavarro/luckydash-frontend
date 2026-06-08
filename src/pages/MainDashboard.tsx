import Navbar from '../components/layout/Navbar'
import '../styles/MainDashboard.css'
import '../styles/Layout.css'

export default function Main() {
  return (
    <>
      <div className="page-container-main-layoud">
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <p>Dashboard</p>
          </div>
        </div>
      </div>
    </>
  )
}
