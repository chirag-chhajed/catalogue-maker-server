"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Catalogue {
  id: string;
  name: string;
  description: string;
}

interface EditCatalogueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  catalogue: Catalogue;
}

export default function EditCatalogueDialog({
  isOpen,
  onClose,
  catalogue,
}: Readonly<EditCatalogueDialogProps>) {
  const [name, setName] = useState(catalogue.name);
  const [description, setDescription] = useState(catalogue.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement update catalogue functionality
    console.log("Updating catalogue:", { id: catalogue.id, name, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Catalogue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
