import { Investment } from '@/pages/index';
import styles from '@/styles/InvestmentList.module.css';
import homeStyles from '@/styles/Home.module.css';
import { useState } from 'react';

interface StockTableProps {
  investments: Investment[];
}

export default function StockTable({ investments }: StockTableProps) {
  const [activeWeek, setActiveWeek] = useState<number | 'all'>('all');
  
  const weeklyData = investments.reduce((acc, inv) => {
    if (!acc[inv.week]) {
      acc[inv.week] = [];
    }
    acc[inv.week].push(inv);
    return acc;
  }, {} as Record<number, Investment[]>);

  const weeks = Object.keys(weeklyData).map(Number).sort((a, b) => a - b);
  const displayInvestments = activeWeek === 'all' ? investments : weeklyData[activeWeek] || [];

  if (investments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>😊 目前還沒有資料唷～</p>
      </div>
    );
  }

  const renderTable = (invs: Investment[]) => {
    if (invs.length === 0) return (
      <div className={styles.emptyState}>
        <p>😊 目前還沒有資料唷～</p>
      </div>
    );
    
    return (
      <div className={styles.stockTable}>
        <div className={styles.stockHeader}>
          <div className={styles.stockCell}>📊 週次</div>
          <div className={styles.stockCell}>💹 股票代號</div>
          <div className={styles.stockCell}>📅 日期</div>
          <div className={styles.stockCell}>💰 買價</div>
          <div className={styles.stockCell}>📈 股數</div>
          <div className={styles.stockCell}>💵 總額</div>
        </div>
        {invs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inv) => (
          <div key={inv.id} className={styles.stockRow}>
            <div className={styles.stockCell}>
              <span className={styles.week}>W{inv.week}</span>
            </div>
            <div className={styles.stockCell}>
              <span className={styles.symbol}>{inv.symbol}</span>
            </div>
            <div className={styles.stockCell}>{inv.date}</div>
            <div className={styles.stockCell}>${inv.buyPrice.toFixed(2)}</div>
            <div className={styles.stockCell}>{inv.shares}</div>
            <div className={styles.stockCell}>
              <span className={styles.profit}>${inv.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={homeStyles.section}>
      <div className={homeStyles.sectionHeader}>
        <h2>📈 投資明細</h2>
      </div>
      <div className={homeStyles.filterTabs}>
        <button 
          className={`${homeStyles.tabBtn} ${activeWeek === 'all' ? homeStyles.active : ''}`}
          onClick={() => setActiveWeek('all')}
        >
          🌏 全部
        </button>
        {weeks.map(week => (
          <button 
            key={week}
            className={`${homeStyles.tabBtn} ${activeWeek === week ? homeStyles.active : ''}`}
            onClick={() => setActiveWeek(week)}
          >
            📅 第{week}週
          </button>
        ))}
      </div>
      <div className={styles.tableWrapper}>
        {renderTable(displayInvestments)}
      </div>
    </div>
  );
}