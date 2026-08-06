import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function WalletSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const [openGroups, setOpenGroups] = useState({
    accounts: true,
    categories: true,
    tickets: true,
    transactions: true,
  })

  type GroupKey = keyof typeof openGroups
  type WalletSections = 'accounts' | 'categories' | 'tickets' | 'transactions'
  type WalletActions = 'list' | 'create'
  type Paths = `/wallet/${WalletSections}/${WalletActions}`
  const isActive = (path: Paths) => location.pathname === path
  const toggleGroup = (group: GroupKey) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  return (
    <>
      <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
        <div
          className="toggle-arrow"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <svg
            viewBox="0 0 320 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            className={`chevron-right ${collapsed ? 'collapsed' : ''}`}
          >
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
          </svg>
        </div>
        <div className="sidebar">
          <div className="link-group">
            <div
              className="link-group-title"
              onClick={() => toggleGroup('accounts')}
            >
              <span className="famicons--card sidebar-icon"></span>
              {!collapsed && <span>Cuentas</span>}
              {!collapsed && (
                <div className="expansion-arrow">
                  <span
                    className={`material-symbols--arrow-drop-down-rounded chevron-right ${openGroups.accounts ? 'open' : ''}`}
                  ></span>
                </div>
              )}
            </div>
            <div
              className={`link-group-items ${openGroups.accounts && !collapsed ? 'open' : ''}`}
            >
              <Link to="/wallet/accounts/create">
                <div
                  className={`link-item ${isActive('/wallet/accounts/create') ? 'active' : ''}`}
                >
                  <span className="icon-park-outline--add"></span>
                  {!collapsed && 'Agregar'}
                </div>
              </Link>
              <Link to="/wallet/accounts/list">
                <div
                  className={`link-item ${isActive('/wallet/accounts/list') ? 'active' : ''}`}
                >
                  <span className="gg--list"></span>
                  {!collapsed && 'Listar'}
                </div>
              </Link>
            </div>
          </div>
          <div className="link-group">
            <div
              className="link-group-title"
              onClick={() => toggleGroup('categories')}
            >
              <span className="ic--outline-category sidebar-icon"></span>
              {!collapsed && <span>Categorias</span>}
              {!collapsed && (
                <div className="expansion-arrow">
                  <span
                    className={`material-symbols--arrow-drop-down-rounded chevron-right ${openGroups.categories ? 'open' : ''}`}
                  ></span>
                </div>
              )}
            </div>
            <div
              className={`link-group-items ${openGroups.categories && !collapsed ? 'open' : ''}`}
            >
              <Link to="/wallet/categories/create">
                <div
                  className={`link-item ${isActive('/wallet/categories/create') ? 'active' : ''}`}
                >
                  <span className="icon-park-outline--add"></span>
                  {!collapsed && 'Agregar'}
                </div>
              </Link>
              <Link to="/wallet/categories/list">
                <div
                  className={`link-item ${isActive('/wallet/categories/list') ? 'active' : ''}`}
                >
                  <span className="gg--list"></span>
                  {!collapsed && 'Listar'}
                </div>
              </Link>
            </div>
          </div>
          <div className="link-group">
            <div
              className="link-group-title"
              onClick={() => toggleGroup('tickets')}
            >
              <span className="tabler--receipt-filled sidebar-icon"></span>
              {!collapsed && <span>Tickets</span>}
              {!collapsed && (
                <div className="expansion-arrow">
                  <span
                    className={`material-symbols--arrow-drop-down-rounded chevron-right ${openGroups.tickets ? 'open' : ''}`}
                  ></span>
                </div>
              )}
            </div>
            <div
              className={`link-group-items ${openGroups.tickets && !collapsed ? 'open' : ''}`}
            >
              <Link to="/wallet/tickets/create">
                <div
                  className={`link-item ${isActive('/wallet/tickets/create') ? 'active' : ''}`}
                >
                  <span className="icon-park-outline--add"></span>
                  {!collapsed && 'Agregar'}
                </div>
              </Link>
              <Link to="/wallet/tickets/list">
                <div
                  className={`link-item ${isActive('/wallet/tickets/list') ? 'active' : ''}`}
                >
                  <span className="gg--list"></span>
                  {!collapsed && 'Listar'}
                </div>
              </Link>
            </div>
          </div>
          <div className="link-group">
            <div
              className="link-group-title"
              onClick={() => toggleGroup('transactions')}
            >
              <span className="hugeicons--transaction sidebar-icon"></span>
              {!collapsed && <span>Transacciones</span>}
              {!collapsed && (
                <div className="expansion-arrow">
                  <span
                    className={`material-symbols--arrow-drop-down-rounded chevron-right ${openGroups.transactions ? 'open' : ''}`}
                  ></span>
                </div>
              )}
            </div>
            <div
              className={`link-group-items ${openGroups.transactions && !collapsed ? 'open' : ''}`}
            >
              <Link to="/wallet/transactions/create">
                <div
                  className={`link-item ${isActive('/wallet/transactions/create') ? 'active' : ''}`}
                >
                  <span className="icon-park-outline--add"></span>
                  {!collapsed && 'Agregar'}
                </div>
              </Link>
              <Link to="/wallet/transactions/list">
                <div
                  className={`link-item ${isActive('/wallet/transactions/list') ? 'active' : ''}`}
                >
                  <span className="gg--list"></span>
                  {!collapsed && 'Listar'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function UsersSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const [openGroups, setOpenGroups] = useState({
    profile: true,
  })

  type GroupKey = keyof typeof openGroups
  type UsersSections = 'profile'
  type UsersActions = 'view'
  type Paths = `/users/${UsersSections}/${UsersActions}`
  const isActive = (path: Paths) => location.pathname === path
  const toggleGroup = (group: GroupKey) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  return (
    <>
      <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
        <div
          className="toggle-arrow"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <svg
            viewBox="0 0 320 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            className={`chevron-right ${collapsed ? 'collapsed' : ''}`}
          >
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
          </svg>
        </div>
        <div className="sidebar">
          <div className="link-group">
            <div
              className="link-group-title"
              onClick={() => toggleGroup('profile')}
            >
              <span className="iconamoon--profile-fill sidebar-icon"></span>
              {!collapsed && <span>Perfil</span>}
              {!collapsed && (
                <div className="expansion-arrow">
                  <span
                    className={`material-symbols--arrow-drop-down-rounded chevron-right ${openGroups.profile ? 'open' : ''}`}
                  ></span>
                </div>
              )}
            </div>
            <div
              className={`link-group-items ${openGroups.profile && !collapsed ? 'open' : ''}`}
            >
              <Link to="/users/profile/view">
                <div
                  className={`link-item ${isActive('/users/profile/view') ? 'active' : ''}`}
                >
                  <span className="gg--list"></span>
                  {!collapsed && 'Ver Perfil'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const path = location.pathname
  if (path.startsWith('/wallet')) return <WalletSidebar />

  if (path.startsWith('/users')) return <UsersSidebar />

  return null
}
