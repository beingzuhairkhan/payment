
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  size: Size;
  className?: string;
}


const LoadingSpinner = ({ size = 'md', className = '' }:Props) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-primary-500 dark:border-gray-600 dark:border-t-primary-400 h-full w-full"></div>
    </div>
  )
}

export default LoadingSpinner