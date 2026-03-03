"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductCard } from "@/app/_components/productCard";

const EmptyCard = ({ categoryName, onClick, disabled }) => (
  <button
    aria-label="Add new dish to a category"
    className="flex h-[342px] w-full max-w-[397px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#FCA5A5] bg-[#FFF] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M5.16667 0.5V9.83333M0.5 5.16667H9.83333" stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <p className="max-w-[220px] text-center text-[16px] font-medium text-[#3F3F46]">
      Add new dish to {categoryName}
    </p>
  </button>
);

const FoodForm = ({
  title,
  categories,
  values,
  setValues,
  onFileChange,
  submitText,
  onSubmit,
  secondaryActionText,
  onSecondaryAction,
  secondaryActionDisabled,
  isSubmitting,
  isAuthenticated,
}) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-2 rounded-xl bg-[#FFF]">
    <DialogHeader>
      <DialogTitle className="text-[13px] font-semibold text-[#09090B]">{title}</DialogTitle>
    </DialogHeader>

    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-[#71717A]">Dish name</p>
      <Input
        className="h-6 text-[10px]"
        type="text"
        placeholder="Type dish name"
        value={values.foodName}
        onChange={(e) => setValues((prev) => ({ ...prev, foodName: e.target.value }))}
        required
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-[#71717A]">Dish category</p>
      <select
        className="h-6 rounded-md border border-[#E4E4E7] px-2 text-[10px]"
        value={values.category}
        onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
      >
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-[#71717A]">Ingredients</p>
      <Textarea
        className="min-h-[62px] text-[10px]"
        placeholder="Type ingredients"
        value={values.ingredients}
        onChange={(e) => setValues((prev) => ({ ...prev, ingredients: e.target.value }))}
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-[#71717A]">Price</p>
        <Input
          className="h-6 text-[10px]"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={values.price}
          onChange={(e) => setValues((prev) => ({ ...prev, price: e.target.value }))}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-[#71717A]">Image</p>
        <Input className="h-6 text-[9px]" type="file" accept="image/*" onChange={onFileChange} />
      </div>
    </div>

    {values.previewImage && (
      <div className="relative overflow-hidden rounded-lg border border-[#E4E4E7] bg-[#F4F4F5]">
        <img src={values.previewImage} alt="Dish preview" className="h-[74px] w-full object-cover" />
      </div>
    )}

    <DialogFooter className={secondaryActionText ? "!justify-between" : "!justify-end"}>
      {secondaryActionText && onSecondaryAction ? (
        <Button
          type="button"
          variant="outline"
          className="h-6 rounded-md border-[#EF4444] px-3 text-[10px] text-[#EF4444] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
          onClick={onSecondaryAction}
          disabled={secondaryActionDisabled || isSubmitting || !isAuthenticated}
        >
          {secondaryActionText}
        </Button>
      ) : null}
      <Button className="h-6 rounded-md bg-[#18181B] px-3 text-[10px]" type="submit" disabled={isSubmitting || !isAuthenticated}>
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </DialogFooter>
  </form>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M15.3 5.1L18.9 8.7M16.9 3.5C17.9 2.5 19.5 2.5 20.5 3.5C21.5 4.5 21.5 6.1 20.5 7.1L9.2 18.4L4 20L5.6 14.8L16.9 3.5Z"
      stroke="#EF4444"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DishCard = ({ food, onEdit }) => (
  <ProductCard
    title={food.foodName || "Unknown dish"}
    description={food.ingredients || ""}
    price={`$${Number(food.price || 0).toFixed(2)}`}
    imageSrc={food.image || ""}
    imageAlt={food.foodName || "Dish"}
    unoptimized={Boolean(food.image)}
    actionSlot={
      <button
        type="button"
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#E4E4E7] bg-[#F4F4F5] p-0 shadow-sm transition hover:bg-white"
        onClick={onEdit}
      >
        <EditIcon />
      </button>
    }
  />
);

export const Dishmenu = ({
  category,
  allCategories = [],
  onCreateFood,
  onUpdateFood,
  onDeleteFood,
  onUploadDishImage,
  isAuthenticated,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [deletingFood, setDeletingFood] = useState(null);
  const [undoPayload, setUndoPayload] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);

  const defaultValues = useMemo(
    () => ({
      foodName: "",
      price: "",
      ingredients: "",
      category: category._id,
      previewImage: "",
    }),
    [category._id]
  );

  const [formValues, setFormValues] = useState(defaultValues);

  const resetForm = () => {
    setFormValues(defaultValues);
    setSelectedFile(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let imageUrl = formValues.previewImage || "";
      if (selectedFile) {
        imageUrl = await onUploadDishImage(selectedFile);
      }

      const numericPrice = Number.parseFloat(String(formValues.price).replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(numericPrice)) {
        throw new Error("Price must be a valid number");
      }

      await onCreateFood({
        foodName: formValues.foodName.trim(),
        price: numericPrice,
        ingredients: formValues.ingredients.trim(),
        category: formValues.category,
        image: imageUrl,
      });

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      alert(error?.response?.data?.error || error?.response?.data?.message || error.message || "Failed to create dish");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (food) => {
    setEditingFood(food);
    setFormValues({
      foodName: food.foodName || "",
      price: String(food.price ?? ""),
      ingredients: food.ingredients || "",
      category: typeof food.category === "string" ? food.category : food.category?._id || category._id,
      previewImage: food.image || "",
    });
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingFood?._id) {
      return;
    }

    try {
      setIsSubmitting(true);
      let imageUrl = formValues.previewImage || "";
      if (selectedFile) {
        imageUrl = await onUploadDishImage(selectedFile);
      }

      const numericPrice = Number.parseFloat(String(formValues.price).replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(numericPrice)) {
        throw new Error("Price must be a valid number");
      }

      await onUpdateFood({
        id: editingFood._id,
        foodName: formValues.foodName.trim(),
        price: numericPrice,
        ingredients: formValues.ingredients.trim(),
        category: formValues.category,
        image: imageUrl,
      });

      setIsEditDialogOpen(false);
      setEditingFood(null);
      resetForm();
    } catch (error) {
      alert(error?.response?.data?.error || error?.response?.data?.message || error.message || "Failed to update dish");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingFood?._id) {
      return;
    }

    try {
      await onDeleteFood({ id: deletingFood._id });
      setUndoPayload({
        foodName: deletingFood.foodName,
        price: deletingFood.price,
        ingredients: deletingFood.ingredients,
        category:
          typeof deletingFood.category === "string"
            ? deletingFood.category
            : deletingFood.category?._id || category._id,
        image: deletingFood.image || "",
      });
      setShowUndoBanner(true);
      setTimeout(() => setShowUndoBanner(false), 8000);
      setIsDeleteConfirmOpen(false);
      setDeletingFood(null);
    } catch (error) {
      alert(error?.response?.data?.error || error?.response?.data?.message || error.message || "Failed to delete dish");
    }
  };

  const handleUndoDelete = async () => {
    if (!undoPayload) {
      return;
    }

    try {
      await onCreateFood(undoPayload);
      setShowUndoBanner(false);
      setUndoPayload(null);
    } catch (error) {
      alert(error?.response?.data?.error || error?.response?.data?.message || error.message || "Failed to restore dish");
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#FFF] p-3">
      {showUndoBanner && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E4E4E7] bg-white px-4 py-3">
          <div className="space-y-0.5">
            <p className="text-base font-semibold text-[#09090B]">Dish successfully deleted.</p>
            <p className="text-sm text-[#18181B]">Would you like to undo this action?</p>
          </div>
          <Button type="button" className="h-8 rounded-md bg-[#18181B] px-3 text-xs" onClick={handleUndoDelete}>
            Undo
          </Button>
        </div>
      )}

      <div className="flex gap-2 text-[15px] font-semibold text-[#09090B]">
        <p>{category.categoryName}</p>
        <p>({category.foods?.length || 0})</p>
      </div>

      <div aria-label="Cards in category section" className="flex flex-wrap gap-9">
        <EmptyCard
          categoryName={category.categoryName}
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          disabled={!isAuthenticated}
        />

        {(category.foods || []).map((food) => (
          <DishCard
            key={food._id}
            food={food}
            onEdit={() => openEditDialog(food)}
          />
        ))}
      </div>

      <Dialog aria-label="Add dish" open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent
          className="w-[340px] rounded-xl border-[#E4E4E7] p-3.5"
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <FoodForm
            title={`Add new Dish to ${category.categoryName}`}
            categories={allCategories}
            values={formValues}
            setValues={setFormValues}
            onFileChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
              if (file) {
                const preview = URL.createObjectURL(file);
                setFormValues((prev) => ({ ...prev, previewImage: preview }));
              }
            }}
            submitText="Add dish"
            onSubmit={handleAddSubmit}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
          />
        </DialogContent>
      </Dialog>

      <Dialog aria-label="Edit dish info" open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="w-[340px] rounded-xl border-[#E4E4E7] p-3.5"
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <FoodForm
            title="Dishes info"
            categories={allCategories}
            values={formValues}
            setValues={setFormValues}
            onFileChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
              if (file) {
                const preview = URL.createObjectURL(file);
                setFormValues((prev) => ({ ...prev, previewImage: preview }));
              }
            }}
            submitText="Save changes"
            onSubmit={handleEditSubmit}
            secondaryActionText="Delete dish"
            onSecondaryAction={() => {
              if (!editingFood) {
                return;
              }

              setDeletingFood(editingFood);
              setIsEditDialogOpen(false);
              setIsDeleteConfirmOpen(true);
            }}
            secondaryActionDisabled={!editingFood?._id}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
          />
        </DialogContent>
      </Dialog>

      <Dialog aria-label="Delete dish confirmation" open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="w-[320px] rounded-xl border-[#E4E4E7] p-4">
          <DialogHeader>
            <DialogTitle className="text-[13px] font-semibold text-[#09090B]">Delete dish</DialogTitle>
          </DialogHeader>
          <p className="text-[11px] text-[#52525B]">
            Are you sure you want to delete <span className="font-semibold">{deletingFood?.foodName}</span>?
          </p>
          <DialogFooter className="!justify-end gap-2">
            <Button type="button" variant="outline" className="h-7 px-3 text-[11px]" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="h-7 bg-[#18181B] px-3 text-[11px]" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
