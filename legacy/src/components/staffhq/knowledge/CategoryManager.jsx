import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { ArticleCategory } from '@/api/entities';

const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(category || { name: '', description: '' });
  }, [category, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'Create'} Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Category Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Category Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await ArticleCategory.list();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (data) => {
    if (editingCategory) {
      await ArticleCategory.update(editingCategory.id, data);
    } else {
      await ArticleCategory.create(data);
    }
    closeModal();
    loadCategories();
  };

  const handleDelete = async () => {
    if (deletingCategory) {
      await ArticleCategory.delete(deletingCategory.id);
      setDeletingCategory(null);
      loadCategories();
    }
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  return (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Article Categories</CardTitle>
        <Button size="sm" onClick={() => openModal()}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium text-brand-text-primary">{cat.name}</TableCell>
                  <TableCell className="text-brand-text-secondary">{cat.description}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(cat)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingCategory(cat)}><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        category={editingCategory}
      />
      
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the category. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}