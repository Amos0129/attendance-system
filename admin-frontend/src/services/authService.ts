export async function login(username: string, password: string): Promise<string> {
  const response = await fetch('http://localhost:8000/auth/json-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || '登入失敗')
  }

  if (data.access_token) {
    localStorage.setItem('token', data.access_token)
  }

  return data.message || '登入成功'
}