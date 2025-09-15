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

  return (
   <div
  className={`inline-block ${sizeClasses[size]} ${className}`}
  role="status"
>
  <div
    className={`
      w-full h-full 
      border-4
      border-gray-300 dark:border-gray-700
      border-t-primary-500 dark:border-t-primary-400
      rounded-full
      animate-spin
    `}
  ></div>
</div>
  );
};

export default LoadingSpinner;
