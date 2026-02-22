import LoginForm from '../components/auth/LoginForm'
import './Auth.css'

export default function Login() {
  return (
    <div className="page-container-login">
      <div className="card">
        <LoginForm />
      </div>
    </div>
  )
}
