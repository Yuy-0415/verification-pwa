import { useState, useEffect } from 'react';
import { CodesList } from './components/CodesList';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import type { PageType } from './types';
import { getDarkMode } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('codes');
  const [darkMode, setDarkMode] = useState(false);

  // 初始化深色模式
  useEffect(() => {
    const isDark = getDarkMode();
    setDarkMode(isDark);
    applyDarkMode(isDark);
  }, []);

  // 应用深色模式
  const applyDarkMode = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 处理深色模式切换
  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    applyDarkMode(enabled);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'codes' && <CodesList />}
        {currentPage === 'settings' && (
          <Settings onDarkModeChange={handleDarkModeChange} />
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;

