const Notification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  return (
    <div className={errorMessage.error ? `error` : `success`}>
      {errorMessage.message}
    </div>
  )
}

export default Notification