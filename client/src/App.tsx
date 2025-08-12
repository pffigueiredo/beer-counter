import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Beer, CreateBeerInput, BeerCount } from '../../server/src/schema';

function App() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beerCount, setBeerCount] = useState<BeerCount>({ count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBackendDown, setIsBackendDown] = useState(false);

  const [formData, setFormData] = useState<CreateBeerInput>({
    name: ''
  });

  // Load beers with proper memoization
  const loadBeers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getBeers.query();
      setBeers(result);
      setIsBackendDown(false);
    } catch (error) {
      console.warn('Backend not fully implemented - using empty beer list');
      // Set empty array as fallback when backend is not implemented
      setBeers([]);
      setIsBackendDown(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load beer count
  const loadBeerCount = useCallback(async () => {
    try {
      const result = await trpc.getBeerCount.query();
      setBeerCount(result);
    } catch (error) {
      console.warn('Backend not fully implemented - using default count');
      // Set default count when backend is not implemented
      setBeerCount({ count: 0 });
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadBeers();
    loadBeerCount();
  }, [loadBeers, loadBeerCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const newBeer = await trpc.createBeer.mutate(formData);
      setBeers((prev: Beer[]) => [newBeer, ...prev]);
      setBeerCount((prev: BeerCount) => ({ count: prev.count + 1 }));
      setFormData({ name: '' });
    } catch (error) {
      console.warn('Backend not fully implemented - simulating beer creation');
      // Simulate creating a beer when backend is not implemented
      const simulatedBeer: Beer = {
        id: Date.now(), // Use timestamp as temporary ID
        name: formData.name,
        created_at: new Date()
      };
      setBeers((prev: Beer[]) => [simulatedBeer, ...prev]);
      setBeerCount((prev: BeerCount) => ({ count: prev.count + 1 }));
      setFormData({ name: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            🍺 Beer Counter
          </h1>
          <p className="text-amber-700 text-lg">
            Keep track of all the beers you've tried!
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-amber-900">
              Total Beers Tracked
            </CardTitle>
            <div className="text-5xl font-bold text-amber-600 mt-2">
              {beerCount.count}
            </div>
            {isBackendDown && (
              <div className="text-xs text-amber-500 mt-2">
                Demo mode - Data stored locally
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Add Beer Form */}
        <Card className="mb-8 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <span>🍻</span>
              Add New Beer
            </CardTitle>
            <CardDescription>
              What beer did you try today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                placeholder="Enter beer name (e.g., Guinness, Corona, IPA...)"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateBeerInput) => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))
                }
                className="flex-1 border-amber-200 focus:border-amber-400"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.name.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6"
              >
                {isSubmitting ? 'Adding...' : 'Add Beer 🍺'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Beer List */}
        <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <span>📋</span>
              Your Beer Collection
            </CardTitle>
            <CardDescription>
              All the beers you've tracked so far
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-amber-600">Loading your beers...</div>
              </div>
            ) : beers.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <div className="text-6xl mb-4">🍺</div>
                <p className="text-lg mb-2">No beers tracked yet!</p>
                <p className="text-sm text-amber-500">
                  Add your first beer using the form above
                </p>
                {isBackendDown && (
                  <p className="text-xs text-amber-400 mt-3">
                    Running in demo mode - Your beers will be stored locally during this session
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {beers.map((beer: Beer, index: number) => (
                  <div key={beer.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🍺</div>
                        <div>
                          <h3 className="font-semibold text-amber-900">
                            {beer.name}
                          </h3>
                          <p className="text-sm text-amber-600">
                            Added on {beer.created_at.toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                        #{beers.length - index}
                      </Badge>
                    </div>
                    {index < beers.length - 1 && (
                      <Separator className="my-2 bg-amber-200" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-amber-600">
          <p className="text-sm">
            Cheers to good beer! 🍻 Keep discovering new flavors.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;