
import React, { useState, useEffect } from 'react';
import { BrandAsset } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Download, Copy, FileText, ImageIcon, Video, Presentation as PresentationIcon, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/hooks/use-toast';
import UploadAssetModal from './UploadAssetModal';

const AssetCard = ({ asset }) => {
  const { toast } = useToast();

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copied!', description: 'Asset URL copied to clipboard.' });
  };

  const isImageAsset = ['logo', 'photo'].includes(asset.asset_type);
  const displayUrl = asset.thumbnail_url || (isImageAsset ? asset.file_url : null);

  const typeIcons = {
    brand_guidelines: <BookOpen className="w-10 h-10 text-brand-text-secondary" />,
    video: <Video className="w-10 h-10 text-brand-text-secondary" />,
    template: <FileText className="w-10 h-10 text-brand-text-secondary" />,
    presentation: <PresentationIcon className="w-10 h-10 text-brand-text-secondary" />,
    photo: <ImageIcon className="w-10 h-10 text-brand-text-secondary" />,
    logo: <ImageIcon className="w-10 h-10 text-brand-text-secondary" />,
  };
  
  return (
    <Card className="bg-brand-charcoal border-brand-border flex flex-col">
      <CardHeader className="p-0 border-b border-brand-border">
        <div className="aspect-video w-full flex items-center justify-center bg-brand-charcoal rounded-t-lg">
          {displayUrl ? (
            <img src={displayUrl} alt={asset.asset_name} className="w-full h-full object-contain rounded-t-lg" />
          ) : (
             typeIcons[asset.asset_type] || <FileText className="w-10 h-10 text-brand-text-secondary" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="font-semibold text-brand-text-primary break-words">{asset.asset_name}</p>
        <p className="text-sm text-brand-text-secondary capitalize">{asset.asset_type.replace(/_/g, ' ')}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={asset.file_url} download><Download className="w-4 h-4 mr-2" />Download</a>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleCopy(asset.file_url)}>
          <Copy className="w-4 h-4" />
          <span className="sr-only">Copy URL</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function BrandLibrary() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await BrandAsset.list();
      setAssets(data || []); // Ensure assets is always an array
      setFilteredAssets(data || []); // Ensure filteredAssets is always an array
    } catch (error) {
      console.error("Failed to load brand assets:", error);
      setAssets([]); // Set to empty array on error
      setFilteredAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
    loadAssets(); // Refresh the list after upload
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">Brand Asset Library</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
      {isModalOpen && <UploadAssetModal onSave={handleUploadSuccess} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
