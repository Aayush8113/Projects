import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md py-3">
      <Navbar />
    </header>
  );
}
