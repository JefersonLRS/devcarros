import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-20 bg-white drop-shadow mb-4">
      <header className="flex max-w-7xl w-full items-center justify-between px-4 mx-auto">
        <Link to="/">
          <img src={logo} alt="Logo do site" />
        </Link>

        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full border-gray-900 p-1">
              <FiUser size={24} color="black" />
            </div>
          </Link>
        )}
        {!loadingAuth && !signed && (
          <Link to="/login">
            <div>
              <button className="bg-blue-500 py-2 px-10 rounded-md text-white">
                Entrar
              </button>
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
