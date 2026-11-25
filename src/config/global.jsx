window.getRandomId = () => {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

window.isEmailValid = (email) => {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  return re.test(String(email).trim())
}

window.isEmailVaild = window.isEmailValid

window.toastify = (msg, type) => {
  if (window.__antdMessage) {
    window.__antdMessage[type](msg)
  }
}
