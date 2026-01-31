import { Investment } from '@/pages/index';
import styles from '@/styles/PieChart.module.css';
import { useEffect, useRef, useState } from 'react';

interface PieChartProps {
  investments: Investment[];
  mode: 'simple' | 'detailed';
}

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

export default function PieChart({ investments, mode }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  
  const data = getWeeklyData();
  
  function getWeeklyData() {
    const weeklyData: Record<number, number> = {};
    
    investments.forEach((inv) => {
      if (!weeklyData[inv.week]) weeklyData[inv.week] = 0;
      weeklyData[inv.week] += inv.totalPrice;
    });
    
    return Object.entries(weeklyData)
      .map(([week, value]) => ({ label: `第${week}週`, value }))
      .sort((a, b) => parseInt(a.label.replace(/[^0-9]/g, '')) - parseInt(b.label.replace(/[^0-9]/g, '')));
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 80;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    let currentAngle = -Math.PI / 2;
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = colors[index % colors.length];
      const isHovered = hoveredIndex === index;
      const sliceRadius = isHovered ? radius + 10 : radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, sliceRadius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = isHovered ? color : color + 'CC';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      const midAngle = currentAngle + sliceAngle / 2;
      const lineStartX = centerX + Math.cos(midAngle) * (sliceRadius + 10);
      const lineStartY = centerY + Math.sin(midAngle) * (sliceRadius + 10);
      const lineEndX = centerX + Math.cos(midAngle) * (sliceRadius + 40);
      const lineEndY = centerY + Math.sin(midAngle) * (sliceRadius + 40);
      
      ctx.beginPath();
      ctx.moveTo(lineStartX, lineStartY);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const percentage = ((item.value / total) * 100).toFixed(1);
      const labelText = `${item.label} (${percentage}%)`;
      ctx.font = isHovered ? 'bold 13px -apple-system' : '12px -apple-system';
      const textWidth = ctx.measureText(labelText).width;
      
      const labelX = lineEndX + (Math.cos(midAngle) > 0 ? 5 : -textWidth - 5);
      const labelY = lineEndY;
      
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(labelX - 4, labelY - 16, textWidth + 8, 20);
      ctx.strokeStyle = color;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.strokeRect(labelX - 4, labelY - 16, textWidth + 8, 20);
      
      ctx.fillStyle = '#333';
      ctx.fillText(labelText, labelX, labelY - 2);
      
      currentAngle += sliceAngle;
    });
    
    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      
      if (distance <= radius + 20) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;
        
        let currentAngle = 0;
        let foundIndex = -1;
        
        for (let i = 0; i < data.length; i++) {
          const sliceAngle = (data[i].value / total) * 2 * Math.PI;
          if (angle >= currentAngle && angle <= currentAngle + sliceAngle) {
            foundIndex = i;
            break;
          }
          currentAngle += sliceAngle;
        }
        
        setHoveredIndex(foundIndex);
      } else {
        setHoveredIndex(-1);
      }
    }
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => setHoveredIndex(-1));
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', () => setHoveredIndex(-1));
    };
  }, [data, hoveredIndex]);
  
  if (data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>😊 目前還沒有資料唷～</p>
      </div>
    );
  }
  
  return (
    <div className={styles.chartContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}