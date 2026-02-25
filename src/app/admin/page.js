"use client";

import { FoodMenu } from "./_features/foodmenu";
import { Order } from "./_features/order";
import { useRouter } from "next/navigation";
import { useAdminContext } from "../_provider/adminProvider";

const Admin = () => {
  const { setOrderMenu, setFoodMenu, orderMenu, foodMenu } = useAdminContext();

  const router = useRouter();
  const goToHomePage = () => {
    router.push("/home");
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#E4E4E5]">
      <aside
        aria-label="Navigation"
        className="flex w-[124px] shrink-0 flex-col items-center gap-8 border-r border-[#E4E4E7] bg-[#FAFAFA] px-3 py-6"
      >
        <div
          aria-label="Logo and Slogan section"
          className="flex cursor-pointer items-center gap-2"
          onClick={goToHomePage}
        >
          <svg
            aria-label="logo"
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="30"
            viewBox="0 0 36 30"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.7996 0.189376C16.614 0.374842 16.6072 0.415061 16.6246 1.2258C16.6345 1.68966 16.6109 2.10089 16.5721 2.1395C16.5333 2.17811 16.1224 2.26498 15.6589 2.33239C13.6267 2.62825 11.9182 3.22433 10.1049 4.27026C8.79564 5.02545 8.08594 5.5568 7.01375 6.58457C5.90531 7.64711 5.17363 8.57368 4.23113 10.1085C3.96048 10.5494 3.44001 11.5811 3.44001 11.6769C3.44001 11.6966 3.35513 11.8983 3.2514 12.1251C2.66788 13.4009 2.14879 15.7562 2.13002 17.2133C2.11707 18.221 2.15729 18.1777 1.14883 18.2699C0.384977 18.3398 0.263937 18.3706 0.136922 18.5274C-0.0627173 18.7739 -0.0434123 19.0425 0.1907 19.2766C0.387045 19.4729 0.396315 19.4742 1.24405 19.4245C1.7145 19.3969 3.13358 19.3236 4.3976 19.2616C5.66162 19.1995 7.29911 19.1146 8.03646 19.0727C10.1539 18.9528 10.6898 18.9251 11.7519 18.8815C12.7965 18.8386 14.7168 18.7368 16.8463 18.6115C17.5415 18.5705 18.6126 18.5189 19.2264 18.4968C19.8401 18.4747 20.6158 18.4412 20.95 18.4225C21.2843 18.4038 22.385 18.352 23.3963 18.3074C24.4075 18.2629 25.7864 18.1938 26.4606 18.1539C27.1347 18.114 28.0827 18.0616 28.5673 18.0374C29.0518 18.0132 29.6551 17.9786 29.9079 17.9605C30.1607 17.9424 30.7985 17.9076 31.3251 17.8831C34.7595 17.7236 35.6852 17.6458 35.8426 17.5033C36.0484 17.317 36.0534 16.8471 35.8515 16.6644C35.7278 16.5524 35.5719 16.5347 34.8564 16.5511C34.3898 16.5619 33.9828 16.5455 33.952 16.5147C33.9212 16.4839 33.8381 16.0727 33.7673 15.601C33.6237 14.6433 33.5955 14.5079 33.4379 14.0155C33.3771 13.8259 33.2873 13.5156 33.2382 13.326C33.189 13.1364 33.1177 12.9215 33.0797 12.8483C33.0416 12.7751 33.0105 12.6762 33.0105 12.6287C33.0105 12.4491 32.2817 10.8248 31.9005 10.1547C31.3958 9.26775 30.9517 8.58487 30.7228 8.34386C30.6242 8.23998 30.4525 8.03437 30.3413 7.8869C29.8704 7.26239 28.9125 6.30526 28.1298 5.67715C27.5216 5.18901 25.8426 4.08356 25.3497 3.84669C23.1752 2.80177 21.1423 2.26582 18.9658 2.16378C18.279 2.13153 17.9505 2.08549 17.8759 2.01095C17.8116 1.9466 17.7667 1.7308 17.7628 1.46734C17.7481 0.475505 17.7262 0.317617 17.5814 0.157584C17.3807 -0.0641951 17.0392 -0.0503291 16.7996 0.189376Z"
              fill="#EF4444"
            />
          </svg>
          <div aria-label="Logo name and Slogan" className="flex flex-col">
            <p className="text-[14px] font-semibold">NomNom</p>
            <p className="text-[10px] font-normal text-[#71717A]">Swift delivery</p>
          </div>
        </div>

        <div
          aria-label="Food Menu"
          className={`flex w-full cursor-pointer items-center justify-center gap-2.5 px-4 py-2 text-xs ${
            foodMenu ? "rounded-full bg-[#18181B] text-white" : "text-[#18181B]"
          }`}
          onClick={() => {
            setFoodMenu(true);
            setOrderMenu(false);
          }}
        >
          <p>Food Menu</p>
        </div>

        <div
          aria-label="Orders of users"
          className={`flex w-full cursor-pointer items-center justify-center gap-2.5 px-4 py-2 text-xs ${
            orderMenu ? "rounded-full bg-[#18181B] text-white" : "text-[#18181B]"
          }`}
          onClick={() => {
            setOrderMenu(true);
            setFoodMenu(false);
          }}
        >
          <p>Order</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {foodMenu && !orderMenu && <FoodMenu />}
        {orderMenu && !foodMenu && <Order />}
      </main>
    </div>
  );
};

export default Admin;
