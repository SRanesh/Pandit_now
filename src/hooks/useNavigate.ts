import { usePandits } from './usePandits';

export function useNavigate() {
  const { searchPandits } = usePandits();

  const scrollToSearch = (searchTerm?: string) => {
    const searchSection = document.querySelector('#search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });

    if (searchTerm) {
      // Add a small delay to ensure the scroll completes first
      setTimeout(() => {
        searchPandits(searchTerm);
      }, 100);
    }
  };

  return { scrollToSearch };
}