import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelHeader";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

interface UserProps {
  uid: string;
  displayName: string | null;
  email: string | null;
  favorites: string[];
}

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  make: string;
  km: string | number;
  city: string;
  images: carImageProps[];
}

interface carImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Favorites() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    loadFavoriteCars();
  }, []);

  function handleLoadImage(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function loadFavoriteCars() {
    setIsLoading(true);
    const userRef = addDoc(collection(db, "users"), {
      uid: user?.uid,
      displayName: user?.displayName,
      email: user?.email,
      favorites: user?.favorites,
    });
  }

  function handleFavorite(id: string) {
    if (!user?.favorites.includes(id)) {
      user?.favorites.push(id);
      setUserFavorites((prevFavorites) => [...prevFavorites, id]);
    } else {
      user.favorites = user?.favorites.filter((item) => item !== id);
      setUserFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item !== id)
      );
    }
  }

  return (
    <Container>
      <DashboardHeader />
      <main>
        <h1 className="text-3xl font-bold text-center mb-5">
          Meus carros favoritos
        </h1>

        {isLoading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <l-ring stroke={6} color="black" size={90} />
          </div>
        ) : (
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {cars.map((car) => (
              <section
                className="w-full bg-white rounded-lg shadow-lg"
                key={car.id}
              >
                <div
                  className="w-full h-60 rounded-lg bg-slate-300"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "block",
                  }}
                ></div>
                <img
                  className="w-full mb-2 h-60 object-cover hover:scale-105 transition-all rounded-t-lg"
                  src={car.images[0].url}
                  alt="Foto do carro"
                  onLoad={() => handleLoadImage(car.id)}
                  style={{
                    display: loadImages.includes(car.id) ? "block" : "none",
                  }}
                />

                <p className="font-medium my-2 px-4 text-lg">{car.name}</p>
                <div className="px-4 flex flex-col">
                  <span className="mb-6 opacity-70 w-[70%] text-sm">
                    {car.make}
                  </span>
                  <strong className="text-xl font-medium">
                    R$ {car.price}
                  </strong>
                  <div className="flex justify-between opacity-70 mt-2">
                    <span>{car.year}</span>
                    <span>{car.km} Km</span>
                  </div>
                  <Link
                    to={`/car/${car.id}`}
                    className="bg-[#06233F] py-2 mt-2 text-white rounded-lg text-center hover:bg-gray-500 transition-all cursor-pointer"
                  >
                    Ver mais
                  </Link>
                </div>

                <div className="h-px bg-slate-300 my-3"></div>

                <div className="px-4 mb-4 flex items-center justify-between opacity-70">
                  <span className="flex items-center gap-2 text-sm">
                    <FiMapPin /> {car.city}
                  </span>
                  <button onClick={() => handleFavorite(car.id)}>
                    {userFavorites.includes(car.id) ? (
                      <IoIosHeart color="red" />
                    ) : (
                      <IoIosHeartEmpty />
                    )}
                  </button>
                </div>
              </section>
            ))}
          </main>
        )}
      </main>
    </Container>
  );
}
