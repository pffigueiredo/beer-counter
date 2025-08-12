import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { CreateBeerInput } from '../../../server/src/schema';

interface BeerFormProps {
  onSubmit: (data: CreateBeerInput) => Promise<void>;
  isLoading?: boolean;
}

export function BeerForm({ onSubmit, isLoading = false }: BeerFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await onSubmit({ name: name.trim() });
    setName(''); // Reset form after successful submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        placeholder="Enter beer name 🍺"
        required
        className="text-lg"
      />
      <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
        {isLoading ? 'Adding Beer...' : 'Add Beer 🍻'}
      </Button>
    </form>
  );
}