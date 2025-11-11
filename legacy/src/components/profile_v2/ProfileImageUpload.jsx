import React, { useState, useRef } from 'react';
import { UploadFile } from '@/api/integrations';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { Loader2, UploadCloud, X } from 'lucide-react';

export default function ProfileImageUpload({ user, onImageUpdate }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsLoading(true);
    try {
      // 1. Upload file using the integration
      const uploadResult = await UploadFile({ file });
      if (!uploadResult || !uploadResult.file_url) {
        throw new Error('File upload failed.');
      }
      const newImageUrl = uploadResult.file_url;

      // 2. Update user data with the new URL
      await User.updateMyUserData({ profile_image_url: newImageUrl });
      
      // 3. Notify parent component
      onImageUpdate(newImageUrl);

      toast({
        title: 'Success!',
        description: 'Your profile picture has been updated.',
      });
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'There was a problem uploading your image.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-32 flex flex-col items-center gap-2 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />
      <div 
        className="w-32 h-32 border-4 border-dashed border-brand-border rounded-full flex items-center justify-center cursor-pointer hover:border-brand-red transition-colors relative"
        onClick={triggerFileSelect}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-brand-text-secondary">
            <UploadCloud className="w-8 h-8" />
            <span className="text-xs mt-1">Select Image</span>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-2 w-full">
          <Button onClick={handleUpload} disabled={isLoading} className="w-full bg-brand-red hover:bg-red-700">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
          </Button>
          <Button variant="ghost" onClick={() => { setFile(null); setPreview(null); }} className="w-full text-xs">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}