import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import CategoryList from '../../components/finances/CategoryList'
import '../../styles/Finance.css'
import '../../styles/Alert.css'

export default function CategoriesList() {
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <CategoryList />
          </div>
        </div>
      </div>
    </>
  )
}
