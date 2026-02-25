"use client";

import { useFoodCategoryContext } from "../../_provider/foodCategoryProvider";
import { Submenu } from "../_components/submenu";

export const Menu = ({ onSelectDish, cartItemIds = [] }) => {
  const { categories, loading } = useFoodCategoryContext();

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-6 sm:px-8 lg:px-[88px]">
        <p className="text-sm text-[#71717A]">Loading menu...</p>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-6 sm:px-8 lg:px-[88px]">
        <p className="text-sm text-[#71717A]">No categories available yet.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-6 sm:px-8 lg:px-[88px]">
      <div className="flex flex-col gap-10">
        {categories.map((category) => (
          <Submenu
            key={category._id}
            title={category.categoryName}
            dishes={category.foods || []}
            onSelectDish={onSelectDish}
            cartItemIds={cartItemIds}
          />
        ))}
      </div>
    </section>
  );
};
