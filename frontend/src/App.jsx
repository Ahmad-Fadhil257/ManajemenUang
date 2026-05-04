import { useState, useEffect } from 'react'
import { getTransactions, addTransaction, deleteTransaction, getSummary } from './api'
import './styles/global.css'
import './styles/dashboard.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 })
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense' })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [tData, sData] = await Promise.all([getTransactions(), getSummary()])
      setTransactions(tData)
      setSummary(sData)
    } catch (err) {
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount) return
    await addTransaction({ ...form, amount: parseFloat(form.amount) })
    setForm({ title: '', amount: '', type: 'expense' })
    fetchData()
  }

  const handleDelete = async (id) => {
    await deleteTransaction(id)
    fetchData()
  }

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
  }

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>CashFlow</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Kelola keuanganmu dengan cerdas.</p>
      </header>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Total Saldo</div>
          <div className="summary-value">{formatIDR(summary.balance)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Pemasukan</div>
          <div className="summary-value text-success">+{formatIDR(summary.income)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Pengeluaran</div>
          <div className="summary-value text-danger">-{formatIDR(summary.expense)}</div>
        </div>
      </div>

      <div className="main-content">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Transaksi Terakhir</h2>
          <div className="transaction-list">
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Belum ada transaksi.</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                      {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                    </span>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Tambah Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Judul</label>
              <input 
                className="form-input" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="Misal: Gaji, Makan Siang"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Jumlah (IDR)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipe</label>
              <select 
                className="form-input" 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Simpan Transaksi</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
