import RegisterForm from '../../components/auth/RegisterForm'
import '../../styles/Auth.css'

export default function Register() {
  return (
    <div className="page-container-register">
      <div className="auth-card">
        <RegisterForm />
      </div>
    </div>
  )
}
