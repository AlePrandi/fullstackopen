const Notification = ({ message, type }) => {
  if (!message) return null

  return (
    <div className={type}>
      <h1>{message}</h1>
    </div>
  )
}

export default Notification