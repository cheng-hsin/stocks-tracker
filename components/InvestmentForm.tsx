import { useState, FormEvent } from 'react';
import { Investment } from '@/pages/index';
import { calculateWeek } from '@/lib/weekUtils';
import styles from '@/styles/InvestmentForm.module.css';

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id'>) => Promise<{ success: boolean; message: string }>;
}

export default function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    buyPrice: '',
    shares: '',
    totalPrice: '',
    date: new Date().toISOString().split('T')[0],
    week: calculateWeek(new Date().toISOString().split('T')[0]),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const calculateTotalPrice = () => {
    const buyPrice = parseFloat(formData.buyPrice) || 0;
    const shares = parseFloat(formData.shares) || 0;
    return (buyPrice * shares).toFixed(2);
  };

  const handleBuyPriceChange = (value: string) => {
    setFormData({ ...formData, buyPrice: value });
    if (value && formData.shares) {
      const totalPrice = (parseFloat(value) * parseFloat(formData.shares)).toFixed(2);
      setFormData(prev => ({ ...prev, buyPrice: value, totalPrice }));
    }
  };

  const handleSharesChange = (value: string) => {
    setFormData({ ...formData, shares: value });
    if (value && formData.buyPrice) {
      const totalPrice = (parseFloat(formData.buyPrice) * parseFloat(value)).toFixed(2);
      setFormData(prev => ({ ...prev, shares: value, totalPrice }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const investment: Omit<Investment, 'id'> = {
      symbol: formData.symbol,
      buyPrice: parseFloat(formData.buyPrice),
      shares: parseFloat(formData.shares),
      totalPrice: parseFloat(formData.totalPrice),
      date: formData.date,
      week: formData.week,
    };

    const result = await onSubmit(investment);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    if (result.success) {
      setFormData({
        symbol: '',
        buyPrice: '',
        shares: '',
        totalPrice: '',
        date: new Date().toISOString().split('T')[0],
        week: calculateWeek(new Date().toISOString().split('T')[0]),
      });
    }

    setLoading(false);
  };

  return (
    <>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="symbol">📌 股票代碼/名稱 *</label>
          <select
            id="symbol"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            required
          >
            <option value="">請選擇股票</option>
            <optgroup label="🇺🇸 熱門美股">
              <option value="AAPL">AAPL - Apple Inc.</option>
              <option value="MSFT">MSFT - Microsoft Corporation</option>
              <option value="GOOGL">GOOGL - Alphabet Inc.</option>
              <option value="AMZN">AMZN - Amazon.com Inc.</option>
              <option value="TSLA">TSLA - Tesla Inc.</option>
              <option value="NVDA">NVDA - NVIDIA Corporation</option>
              <option value="META">META - Meta Platforms Inc.</option>
              <option value="NFLX">NFLX - Netflix Inc.</option>
              <option value="AMD">AMD - Advanced Micro Devices</option>
              <option value="CRM">CRM - Salesforce Inc.</option>
              <option value="JPM">JPM - JPMorgan Chase & Co.</option>
            </optgroup>
            <optgroup label="📊 熱門ETF">
              <option value="SPY">SPY - SPDR S&P 500 ETF</option>
              <option value="QQQ">QQQ - Invesco QQQ Trust</option>
              <option value="VTI">VTI - Vanguard Total Stock Market</option>
              <option value="VOO">VOO - Vanguard S&P 500 ETF</option>
              <option value="IVV">IVV - iShares Core S&P 500 ETF</option>
              <option value="VEA">VEA - Vanguard FTSE Developed Markets</option>
              <option value="VWO">VWO - Vanguard FTSE Emerging Markets</option>
              <option value="BND">BND - Vanguard Total Bond Market</option>
              <option value="IWM">IWM - iShares Russell 2000 ETF</option>
            </optgroup>
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="buyPrice">💰 買價 *</label>
            <input
              type="number"
              id="buyPrice"
              value={formData.buyPrice}
              onChange={(e) => handleBuyPriceChange(e.target.value)}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shares">📈 股數 *</label>
            <input
              type="number"
              id="shares"
              value={formData.shares}
              onChange={(e) => handleSharesChange(e.target.value)}
              step="0.01"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="totalPrice">💵 總價 *</label>
            <input
              type="number"
              id="totalPrice"
              value={formData.totalPrice}
              readOnly
              className={styles.readOnly}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="date">📅 投資日期 *</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, week: calculateWeek(e.target.value) })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="week">📊 週次</label>
            <input
              type="number"
              id="week"
              value={formData.week}
              readOnly
              className={styles.readOnly}
            />
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? '⏳ 提交中...' : '✨ 提交投資記錄'}
        </button>
      </form>
    </>
  );
}
