import { BoltIcon } from '@heroicons/react/24/solid';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  size?: Size;
  className?: string;
}

const LoadingSpinner: React.FC<Props> = ({ size = 'md', className = '' }) => {
  const sizeClasses: Record<Size, string> = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const iconSizeClasses: Record<Size, string> = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`} role="status">
      <div className="w-full h-full border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin dark:border-gray-600 dark:border-t-primary-400"></div>

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: '50% 50%' }}
      >
        <BoltIcon className={`${iconSizeClasses[size]} text-yellow-500`} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
