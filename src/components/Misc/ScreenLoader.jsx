import PageLoader from './PageLoader'

/**
 * ScreenLoader – Backward compatible alias wrapping the new PageLoader
 */
const ScreenLoader = ({ isLoading = true, onComplete }) => {
  return <PageLoader isLoading={isLoading} onComplete={onComplete} />
}

export default ScreenLoader
