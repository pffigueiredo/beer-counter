import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import { BeerForm } from './components/BeerForm';
import { ThemeToggle } from './components/ThemeToggle';
import type { Beer, CreateBeerInput, BeerCount } from '../../server/src/schema';

function App() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beerCount, setBeerCount] = useState<BeerCount>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or default to false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const loadBeers = useCallback(async () => {
    try {
      const result = await trpc.getBeers.query();
      setBeers(result);
    } catch (error) {
      console.error('Failed to load beers:', error);
    }
  }, []);

  const loadBeerCount = useCallback(async () => {
    try {
      const result = await trpc.getBeerCount.query();
      setBeerCount(result);
    } catch (error) {
      console.error('Failed to load beer count:', error);
    }
  }, []);

  useEffect(() => {
    loadBeers();
    loadBeerCount();
  }, [loadBeers, loadBeerCount]);

  const handleAddBeer = async (input: CreateBeerInput) => {
    setIsLoading(true);
    try {
      const newBeer = await trpc.createBeer.mutate(input);
      setBeers((prev: Beer[]) => [newBeer, ...prev]);
      setBeerCount((prev: BeerCount) => ({ count: prev.count + 1 }));
    } catch (error) {
      console.error('Failed to create beer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ThemeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-800 dark:text-amber-200">
            🍺 Beer Counter 🍺
          </h1>
          <p className="text-amber-600 dark:text-amber-300">
            Track all your favorite brews!
          </p>
        </div>

        {/* Beer Count Badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="secondary" className="text-xl px-6 py-2 bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">
            Total Beers: {beerCount.count} 🍻
          </Badge>
        </div>

        {/* Add Beer Form */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-200 text-center">
              Add a New Beer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BeerForm onSubmit={handleAddBeer} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Beer List */}
        {beers.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-gray-600">
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No beers yet! Add your first one above. 🍺
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold text-amber-800 dark:text-amber-200 text-center">
              Your Beer Collection ({beers.length})
            </h2>
            {beers.map((beer: Beer) => (
              <Card 
                key={beer.id} 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🍺</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {beer.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Added: {beer.created_at.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-amber-400 text-amber-700 dark:border-amber-500 dark:text-amber-300">
                    #{beer.id}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;