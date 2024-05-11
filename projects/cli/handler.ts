import api from "./api";
import { loadFromCache, saveToCache } from "./cache";

export async function handleLogin(...args: any[]) {
  console.log('Logging in with email:', process.env.EMAIL)

  const res = await api.post('/user/login', {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  })
  console.log(res.data)
  if (res.data.error) {
    console.error('Login failed:', res.data.error)
    return
  }
  console.log('Login successful')
  saveToCache('token', res.data.accessToken)
}

export function handleTest(...args: any[]): void | Promise<void> {
  const token = loadFromCache('token')
  api.get('/user/test', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(res => {
    console.log(res.data)
  })
}

export function handlePost(options: any): void | Promise<void> {
  console.log('Post command:', options)
}
