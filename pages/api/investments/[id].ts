import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteInvestment } from '@/lib/github';

// 檢查是否為開發模式或沒有GitHub配置
const isMockMode = () => {
  return !process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      // 如果是mock模式，只返回成功但不真正刪除
      if (isMockMode() || req.query.mock === 'true') {
        return res.status(200).json({ success: true });
      }
      
      await deleteInvestment(id as string);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('刪除資料失敗:', error);
      // 在mock模式下，即使出錯也返回成功（用於演示）
      if (isMockMode() || req.query.mock === 'true') {
        return res.status(200).json({ success: true });
      }
      res.status(500).json({ error: '刪除資料失敗: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
