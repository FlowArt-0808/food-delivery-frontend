import Link from "next/link";
import NomNomLogoRed from "../../_components/icons/NomNomLogoRed";

const Header = () => {
  return (
    <header className="w-full bg-[#18181b]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8 lg:px-[88px]">
        <div aria-label="Logo and slogan section" className="flex items-center gap-3">
          <NomNomLogoRed />
          <div aria-label="slogan" className="flex flex-col text-white">
            <p className="text-xl font-semibold leading-none">
              Nom<span className="text-[#ef4444]">Nom</span>
            </p>
            <p className="mt-1 text-xs text-white/70">Swift delivery</p>
          </div>
        </div>

        <div aria-label="User register and login section" className="flex gap-2 sm:gap-3">
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-full bg-[#f4f4f5] px-4 text-sm font-medium text-[#18181b] transition hover:bg-white"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-full bg-[#ef4444] px-4 text-sm font-medium text-white transition hover:bg-[#dc2626]"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
