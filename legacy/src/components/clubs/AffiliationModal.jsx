
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Home, Building } from 'lucide-react'; // Added Building icon

const AffiliationModal = ({ isOpen, onClose, club, currentAffiliation, onConfirm }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // If club is null, don't render the modal
  if (!club) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); // Execute the parent's onConfirm function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Home className="w-6 h-6 text-brand-red" />
            Confirm Your Home Club
          </DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            Are you sure you want to set <span className="font-bold text-brand-text-primary">{club.name}</span> as your home club?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-brand-text-secondary">
            This will update your profile and help us personalize your MyCurling experience. You can change this at any time from your profile.
        </div>
        {/* Replaced DialogFooter with a custom div for button layout */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-brand-red text-white hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Building className="w-4 h-4 mr-2" />
                Set as Home Club
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliationModal;
