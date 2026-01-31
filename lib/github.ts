import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const DATA_FILE = 'investments.json';

export async function getInvestments() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_FILE
    });

    if (Array.isArray(data) || !('content' in data)) {
      return [];
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function addInvestment(investment: any) {
  let investments = [];
  let sha = null;
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_FILE
    });
    
    if (!Array.isArray(data) && 'content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      investments = JSON.parse(content);
      sha = data.sha;
    }
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }

  investment.id = Date.now().toString();
  investments.push(investment);

  const content = Buffer.from(JSON.stringify(investments, null, 2)).toString('base64');
  
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: DATA_FILE,
    message: `📈 新增投資記錄: ${investment.symbol} - W${investment.week} (${investment.date})`,
    content: content,
    sha: sha || undefined
  });

  return investment;
}

export async function deleteInvestment(id: string) {
  const { data } = await octokit.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: DATA_FILE
  });
  
  if (Array.isArray(data) || !('content' in data)) {
    throw new Error('File not found or invalid format');
  }
  
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  let investments = JSON.parse(content);
  
  const deletedInvestment = investments.find((inv: any) => inv.id === id);
  investments = investments.filter((inv: any) => inv.id !== id);
  
  const newContent = Buffer.from(JSON.stringify(investments, null, 2)).toString('base64');
  
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: DATA_FILE,
    message: `🗑️ 刪除投資記錄: ${deletedInvestment?.symbol || id} - W${deletedInvestment?.week || '?'}`,
    content: newContent,
    sha: data.sha
  });
}
