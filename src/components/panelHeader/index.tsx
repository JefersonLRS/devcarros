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
    <div className="w-full flex items-center bg-[#333537] h-16 rounded-lg gap-5 px-5 mt-4 text-sm text-white mb-3">
      <div className="flex items-center gap-2 md:p-2 rounded-lg transition-all hover:bg-[#484c4e] cursor-pointer duration-500">
        <FaRegPlusSquare className="w-4 h-4 md:w-6 md:h-6" />
        <Link to="/dashboard/new" className="md:font-bold md:text-base">
          Novo anúncio
        </Link>
      </div>
      <div className="flex items-center gap-1 md:p-2 rounded-lg transition-all hover:bg-[#484c4e] cursor-pointer duration-500">
        <MdFavoriteBorder className="w-4 h-4 md:w-6 md:h-6" />
        <Link to="/dashboard/favorites" className="md:font-bold md:text-base">
          Meus favoritos
        </Link>
      </div>

      <button className="ml-auto" onClick={HandleSignOut}>
        <MdExitToApp className="w-6 h-6 md:w-7 md:h-7 hover:text-blue-500 transition-all duration-300" />
      </button>
    </div>
  );
}
