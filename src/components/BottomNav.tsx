import { MessageSquare, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PageType } from '../types';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex pb-safe">
        <button
          onClick={() => onPageChange('codes')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'codes'
              ? 'text-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('nav.codes')}</span>
        </button>

        <button
          onClick={() => onPageChange('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'settings'
              ? 'text-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('nav.settings')}</span>
        </button>
      </div>
    </nav>
  );
}

