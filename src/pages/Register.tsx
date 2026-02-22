import RegisterForm from '../components/auth/RegisterForm'
import './Auth.css'

export default function Register() {
  return (
    <div className="page-container-register">
      <div className="card">
        <RegisterForm />
      </div>
    </div>
  )
}
