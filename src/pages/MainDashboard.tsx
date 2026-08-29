import Navbar from '../components/layout/Navbar'
import '../styles/MainDashboard.css'
import '../styles/Layout.css'
import Resume from '../components/dashboard/Resume'

export default function Main() {
  return (
    <>
      <div className="page-container-main-layoud">
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Resume />
          </div>
        </div>
      </div>
    </>
  )
}
