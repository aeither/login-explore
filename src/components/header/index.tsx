import { Earth } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
    >
      <nav className="container flex h-14 items-center justify-between">
        <Link className="flex flex-row gap-2" href="/">
          <Earth />
          <div className="font-bold">superhack</div>
        </Link>

        <div>
          <ModeToggle></ModeToggle>
        </div>
        {/* <Link href="/profile">
          <User />
        </Link> */}
      </nav>
    </header>
  );
};

export default Header;
