const API_URL = 'http://localhost:8000/api'

export const getTransactions = async () => {
  const res = await fetch(`${API_URL}/transactions`)
  return await res.json()
}

export const addTransaction = async (data) => {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await res.json()
}

export const deleteTransaction = async (id) => {
  await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' })
}

export const getSummary = async () => {
  const res = await fetch(`${API_URL}/summary`)
  return await res.json()
}
