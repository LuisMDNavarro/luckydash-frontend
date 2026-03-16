import '../../styles/loader.css'

type LoaderProps = {
  loading: boolean
}

export default function Loader({ loading }: LoaderProps) {
  if (!loading) return null
  return (
    <div className="loader-overlay">
      <div className="newtons-cradle">
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
      </div>
    </div>
  )
}
