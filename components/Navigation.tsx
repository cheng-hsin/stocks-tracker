import styles from '@/styles/Navigation.module.css';

interface NavigationProps {
  filter: string;
  setFilter: (filter: string) => void;
  onAddClick: () => void;
}

export default function Navigation({ filter, setFilter, onAddClick }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        📈 股票投資追蹤系統
      </div>
    </nav>
  );
}