import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import InvestmentForm from '@/components/InvestmentForm';
import InvestmentList from '@/components/InvestmentList';
import PieChart from '@/components/PieChart';
import StockTable from '@/components/StockTable';
import Modal from '@/components/Modal';
import styles from '@/styles/Home.module.css';

export interface Investment {
  id: string;
  symbol: string;
  buyPrice: number;
  shares: number;
  totalPrice: number;
  date: string;
  week: number;
}

export default function Home() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [chartMode, setChartMode] = useState<'simple' | 'detailed'>('simple');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      const response = await fetch('/api/investments');
      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error('載入資料失敗:', error);
      // 如果載入失敗，嘗試使用假數據
      try {
        const mockResponse = await fetch('/api/investments?mock=true');
        const mockData = await mockResponse.json();
        setInvestments(mockData);
      } catch (mockError) {
        console.error('載入假數據也失敗:', mockError);
      }
    }
  };

  const handleAddInvestment = async (investment: Omit<Investment, 'id'>) => {
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investment),
      });

      const result = await response.json();
      if (response.ok) {
        await loadInvestments();
        setIsModalOpen(false);
        return { success: true, message: '✨ 投資記錄已成功提交到 GitHub 囉！' };
      } else {
        return { success: false, message: '❌ 提交失敗: ' + result.error };
      }
    } catch (error) {
      return { success: false, message: '❌ 提交失敗，請檢查網路連線和 GitHub 設定' };
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm('確定要刪除這筆投資記錄嗎？')) {
      return { success: false, message: '取消刪除' };
    }

    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadInvestments();
        return { success: true, message: '✨ 投資記錄已刪除' };
      } else {
        const result = await response.json();
        return { success: false, message: '❌ 刪除失敗: ' + result.error };
      }
    } catch (error) {
      return { success: false, message: '❌ 刪除失敗，請檢查網路連線' };
    }
  };

  const filteredInvestments = investments;

  // 計算統計資訊
  const totalInvestments = investments.length;
  const totalCost = investments.reduce((sum, inv) => sum + inv.totalPrice, 0);

  // 統計各類型數量

  return (
    <>
      <Head>
        <title>📈 股票投資追蹤系統</title>
        <meta name="description" content="使用 GitHub 作為資料庫的股票投資追蹤系統" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation 
        filter={filter} 
        setFilter={setFilter} 
        onAddClick={() => setIsModalOpen(true)} 
      />
      <div className={styles.container} style={{ paddingTop: '100px' }}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3>📊 快速統計</h3>
            <div className={styles.sidebarStats}>
              <div className={styles.statItem}>
                <span>📝 總投資數</span>
                <span className={styles.statValue}>{totalInvestments}</span>
              </div>
              <div className={styles.statItem}>
                <span>💰 總成本</span>
                <span className={styles.statValue}>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3>🧭 導航</h3>
            <div className={styles.sidebarStats}>
              <div className={styles.statItem} style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span>⬆️ 回到頂部</span>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <StockTable investments={investments} />
          
          <InvestmentList
            investments={filteredInvestments}
            onDelete={handleDeleteInvestment}
            filter={filter}
            setFilter={setFilter}
            onAddClick={() => setIsModalOpen(true)}
          />
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="✨ 新增投資記錄"
        >
          <InvestmentForm 
            onSubmit={handleAddInvestment}
          />
        </Modal>
      </div>
    </>
  );
}
