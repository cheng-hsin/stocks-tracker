import { Investment } from '@/pages/index';
import styles from '@/styles/InvestmentList.module.css';
import homeStyles from '@/styles/Home.module.css';

interface InvestmentListProps {
  investments: Investment[];
  onDelete: (id: string) => Promise<{ success: boolean; message: string }>;
  filter: string;
  setFilter: (filter: string) => void;
  onAddClick: () => void;
}



export default function InvestmentList({ investments, onDelete, filter, setFilter, onAddClick }: InvestmentListProps) {
  const handleDelete = async (id: string) => {
    const result = await onDelete(id);
    if (result.success) {
      // 可以在这里显示成功消息
    }
  };



  if (investments.length === 0) {
    return (
      <div className={homeStyles.section}>
        <div className={homeStyles.sectionHeader}>
          <h2>📈 投資明細</h2>
          <button className={homeStyles.addButton} onClick={onAddClick}>
            ➕ 新增投資
          </button>
        </div>
        <div className={styles.emptyState}>
          <p>😊 目前還沒有投資記錄唷～</p>
        </div>
      </div>
    );
  }

  return (
    <div className={homeStyles.section}>
      <div className={homeStyles.sectionHeader}>
        <h2>📈 投資明細</h2>
        <button className={homeStyles.addButton} onClick={onAddClick}>
          ➕ 新增投資
        </button>
      </div>
      <div className={homeStyles.filterTabs}>
        <button
          className={`${homeStyles.tabBtn} ${filter === 'all' ? homeStyles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          🌟 全部
        </button>
        <button
          className={`${homeStyles.tabBtn} ${filter === 'us' ? homeStyles.active : ''}`}
          onClick={() => setFilter('us')}
        >
          🇺🇸 美股
        </button>
        <button
          className={`${homeStyles.tabBtn} ${filter === 'crypto' ? homeStyles.active : ''}`}
          onClick={() => setFilter('crypto')}
        >
          ₿ 加密貨幣
        </button>
      </div>
      <div className={styles.investmentsList}>
      <div className={styles.tableHeader}>
        <div className={styles.tableCell}>週次</div>
        <div className={styles.tableCell}>代碼/名稱</div>
        <div className={styles.tableCell}>日期</div>
        <div className={styles.tableCell}>買價</div>
        <div className={styles.tableCell}>股數</div>
        <div className={styles.tableCell}>總成本</div>
        <div className={styles.tableCell}>操作</div>
      </div>
      {investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inv) => {

        return (
          <div key={inv.id} className={styles.investmentRow}>
            <div className={styles.tableCell}>
              <span className={styles.week}>W{inv.week}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.symbol}>{inv.symbol}</span>
            </div>
            <div className={styles.tableCell}>{inv.date}</div>
            <div className={styles.tableCell}>${inv.buyPrice.toFixed(2)}</div>
            <div className={styles.tableCell}>{inv.shares}</div>
            <div className={styles.tableCell}>${inv.totalPrice.toFixed(2)}</div>
            <div className={styles.tableCell}>
              <button
                className={styles.btnDelete}
                onClick={() => handleDelete(inv.id)}
                title="刪除"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
