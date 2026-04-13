import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import Profile from '../../components/users/Profile'
import '../../styles/Form.css'

export default function ViewProfile() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Profile />
          </div>
        </div>
      </div>
    </>
  )
}
