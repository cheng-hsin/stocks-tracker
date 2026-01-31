import type { NextApiRequest, NextApiResponse } from 'next';
import { getInvestments, addInvestment } from '@/lib/github';
import { generateMockInvestments } from '@/lib/mockData';

// 檢查是否為開發模式或沒有GitHub配置
const isMockMode = () => {
  return !process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // 如果明確要求使用假數據，直接返回
      if (req.query.mock === 'true') {
        return res.status(200).json(generateMockInvestments());
      }
      
      // 如果沒有GitHub配置，返回假數據
      if (isMockMode()) {
        return res.status(200).json(generateMockInvestments());
      }
      
      // 嘗試從GitHub載入數據
      const investments = await getInvestments();
      
      // 如果沒有數據，返回假數據作為示例
      if (investments.length === 0) {
        return res.status(200).json(generateMockInvestments());
      }
      
      res.status(200).json(investments);
    } catch (error: any) {
      console.error('載入資料失敗:', error);
      // 如果出錯，返回假數據作為後備
      return res.status(200).json(generateMockInvestments());
    }
  } else if (req.method === 'POST') {
    try {
      const newInvestment = req.body;
      
      if (!newInvestment.symbol || !newInvestment.buyPrice || !newInvestment.shares || 
          !newInvestment.totalPrice || !newInvestment.date) {
        return res.status(400).json({ error: '請填寫所有必填欄位' });
      }

      // 如果是mock模式，只返回成功但不真正保存
      if (isMockMode() || req.query.mock === 'true') {
        newInvestment.id = Date.now().toString();
        return res.status(200).json({ success: true, investment: newInvestment });
      }

      const investment = await addInvestment(newInvestment);
      res.status(200).json({ success: true, investment });
    } catch (error: any) {
      console.error('儲存資料失敗:', error);
      // 在mock模式下，即使出錯也返回成功（用於演示）
      if (isMockMode() || req.query.mock === 'true') {
        const mockInvestment = { ...req.body, id: Date.now().toString() };
        return res.status(200).json({ success: true, investment: mockInvestment });
      }
      res.status(500).json({ error: '儲存資料失敗: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
