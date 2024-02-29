import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";
import { signOut } from "firebase/auth";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdFavoriteBorder, MdExitToApp } from "react-icons/md";

export function DashboardHeader() {
  function HandleSignOut() {
    signOut(auth);
  }

  return (
    <div className="w-full flex items-center bg-[#06233F] h-16 rounded-lg gap-5 px-5 text-sm text-white mb-3">
      <div className="flex items-center gap-2 md:p-2 rounded-lg transition-all hover:bg-[#203b55] cursor-pointer">
        <FaRegPlusSquare className="w-4 h-4 md:w-6 md:h-6" />
        <Link to="/dashboard/new" className="md:font-bold md:text-base">
          Novo anúncio
        </Link>
      </div>
      <div className="flex items-center gap-1 md:p-2 rounded-lg transition-all hover:bg-[#203b55] cursor-pointer">
        <MdFavoriteBorder className="w-4 h-4 md:w-6 md:h-6" />
        <Link to="/dashboard/favorites" className="md:font-bold md:text-base">
          Meus favoritos
        </Link>
      </div>

      <button className="ml-auto" onClick={HandleSignOut}>
        <MdExitToApp className="w-6 h-6 md:w-7 md:h-7" />
      </button>
    </div>
  );
}
