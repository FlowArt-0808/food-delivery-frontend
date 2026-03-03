import { ProductCard } from "../../_components/productCard";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1V11M1 6H11" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
    <path
      d="M11.6667 1L4.33333 8.33333L1 5"
      stroke="#E4E4E7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Submenu = ({ title, dishes = [], onSelectDish, cartItemIds = [] }) => {
  const visibleDishes = dishes.slice(0, 6);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#FFFFFF]">{title}</h2>
      </div>

      <div className="flex flex-wrap gap-9">
        {visibleDishes.map((dish) => {
          const isInCart = Boolean(dish?._id && cartItemIds.includes(dish._id));

          return (
            <ProductCard
              key={`${title}-${dish._id || dish.foodName}`}
              title={dish.foodName || "Unknown dish"}
              description={dish.ingredients || ""}
              price={`$${Number(dish.price || 0).toFixed(2)}`}
              imageSrc={dish.image || ""}
              imageAlt={dish.foodName || "Dish"}
              unoptimized={Boolean(dish.image)}
              onClick={() => onSelectDish?.(dish)}
              actionSlot={
                <button
                  type="button"
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-md transition ${
                    isInCart ? "bg-[#18181B]" : "bg-white hover:bg-[#F4F4F5]"
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectDish?.(dish);
                  }}
                >
                  {isInCart ? <CheckIcon /> : <PlusIcon />}
                </button>
              }
            />
          );
        })}
      </div>
    </section>
  );
};
