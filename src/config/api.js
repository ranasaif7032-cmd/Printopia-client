const candidateBases = [
  import.meta.env.VITE_API_URL,
  'http://localhost:5000/api',
  'http://localhost:8000/api',
].filter(Boolean)

let activeApiBase = candidateBases[0]

const getToken = () => localStorage.getItem('token')

const handleUnauthorized = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  if (window.location.pathname.startsWith('/dashboard')) {
    window.location.href = '/auth/login'
  }
}

const headers = (extra = {}) => {
  const h = { ...extra }
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

const fetchWithFallback = async (path, opts) => {
  try {
    const res = await fetch(`${activeApiBase}${path}`, opts)
    return res
  } catch {
    for (const altBase of candidateBases) {
      if (altBase === activeApiBase) continue
      try {
        const res = await fetch(`${altBase}${path}`, opts)
        activeApiBase = altBase
        return res
      } catch {
        // continue trying
      }
    }
    throw new Error('Cannot connect to the server (connection refused). Please make sure the backend server is running.')
  }
}

const handleResponse = async (res, path) => {
  let data = null
  try {
    const text = await res.text()
    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = { message: text }
      }
    }
  } catch {
    data = null
  }

  if (!res.ok) {
    const isAuthRoute = path.startsWith('/auth/login') || path.startsWith('/auth/register')
    if (res.status === 401) {
      if (!isAuthRoute) {
        handleUnauthorized()
        throw new Error(data?.error || data?.message || 'Session expired. Please login again.')
      }
      throw new Error(data?.error || data?.message || 'Invalid email or password.')
    }
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  get: async (path) => {
    const res = await fetchWithFallback(path, { headers: headers() })
    return handleResponse(res, path)
  },

  post: async (path, body, isFormData = false) => {
    const opts = { method: 'POST', headers: headers() }
    if (isFormData) {
      opts.body = body
    } else {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
    const res = await fetchWithFallback(path, opts)
    return handleResponse(res, path)
  },

  put: async (path, body, isFormData = false) => {
    const opts = { method: 'PUT', headers: headers() }
    if (isFormData) {
      opts.body = body
    } else if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
    const res = await fetchWithFallback(path, opts)
    return handleResponse(res, path)
  },

  delete: async (path, body = undefined) => {
    const opts = { method: 'DELETE', headers: headers() }
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
    const res = await fetchWithFallback(path, opts)
    return handleResponse(res, path)
  },
}
