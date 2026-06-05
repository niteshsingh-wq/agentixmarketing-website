'use client'

const BASE = '/api'

async function authHeader(): Promise<HeadersInit> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cms-token') : null
  return token ? { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.token) {
    localStorage.setItem('cms-token', data.token)
    localStorage.setItem('cms-user', JSON.stringify(data.user))
  }
  return data
}

export function logout() {
  localStorage.removeItem('cms-token')
  localStorage.removeItem('cms-user')
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('cms-user') || 'null') } catch { return null }
}

export function isAuthenticated() {
  return !!localStorage.getItem('cms-token')
}

export async function fetchCollection(collection: string, params: Record<string, string | number> = {}) {
  const headers = await authHeader()
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
  const res = await fetch(`${BASE}/${collection}${qs ? '?' + qs : ''}`, { headers })
  return res.json()
}

export async function fetchDoc(collection: string, id: string | number) {
  const headers = await authHeader()
  const res = await fetch(`${BASE}/${collection}/${id}`, { headers })
  return res.json()
}

export async function updateDoc(collection: string, id: string | number, data: Record<string, unknown>) {
  const headers = await authHeader()
  const res = await fetch(`${BASE}/${collection}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteDoc(collection: string, id: string | number) {
  const headers = await authHeader()
  const res = await fetch(`${BASE}/${collection}/${id}`, { method: 'DELETE', headers })
  return res.json()
}

export async function createDoc(collection: string, data: Record<string, unknown>) {
  const headers = await authHeader()
  const res = await fetch(`${BASE}/${collection}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  return res.json()
}
