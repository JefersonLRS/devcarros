import { Container } from "../../components/container";
import { FiMapPin } from "react-icons/fi";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";
import { Footer } from "../../components/footer";

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

export function Home() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]); // tem q receber do banco
  const [userFavoritesList, setUserFavoritesList] = useState<string[]>([]);

  useEffect(() => {
    loadCars();

    async function loadUserFavorites() {
      if (!user) return;
      console.log("oi");

      const userRef = collection(db, "users");
      const userDoc = doc(userRef, user?.uid);

      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserFavorites(docSnap.data().favorites.map((item: string) => item));
        setUserFavoritesList(
          docSnap.data().favorites.map((item: string) => item)
        );
        user.favorites = docSnap.data().favorites.map((item: string) => item);
      }
      return;
    }

    loadUserFavorites();
  }, [user]);

  async function loadCars() {
    setIsLoading(true);
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    await getDocs(queryRef).then((snapshot) => {
      let listCars = [] as CarsProps[];

      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          name: doc.data().title,
          year: doc.data().year,
          price: doc.data().price,
          make: doc.data().make,
          km: doc.data().km,
          city: doc.data().city,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });

      setIsLoading(false);
      setCars(listCars);
    });
  }

  function handleLoadImage(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCar() {
    if (search === "") return loadCars();

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("title", ">=", search.toUpperCase()),
      where("title", "<=", search.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    let listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().title,
        year: doc.data().year,
        price: doc.data().price,
        make: doc.data().make,
        km: doc.data().km,
        city: doc.data().city,
        images: doc.data().images,
        uid: doc.data().uid,
      });
    });

    setCars(listCars);
  }

  async function handleFavorite(id: string) {
    const userRef = collection(db, "users");
    const userDoc = doc(userRef, user?.uid);

    //Se o anuncio ainda não foi favoritado
    if (!user?.favorites.includes(id)) {
      user?.favorites.push(id);

      if (!userFavoritesList.includes(id)) {
        userFavoritesList.push(id);
        await updateDoc(userDoc, {
          email: user?.email,
          name: user?.displayName,
          uid: user?.uid,
          favorites: userFavoritesList,
        });
      }

      console.log(userFavoritesList);

      setUserFavorites((prevFavorites) => [...prevFavorites, id]);
    }
    //Se o anuncio já foi favoritado
    else {
      user.favorites = user?.favorites.filter((item) => item !== id);

      if (userFavoritesList.includes(id)) {
        setUserFavoritesList(userFavoritesList.filter((item) => item !== id));
        await updateDoc(userDoc, {
          email: user?.email,
          name: user?.displayName,
          uid: user?.uid,
          favorites: userFavoritesList.filter((item) => item !== id),
        });
      }

      setUserFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item !== id)
      );
    }
  }

  return (
    <Container>
      <section className="w-full bg-white rounded-md max-w-3xl mx-auto p-3 flex gap-5">
        <input
          className="outline-none w-full p-2"
          type="text"
          placeholder="Digite o nome do carro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-[#06233F] px-10 py-2 rounded-md text-white hover:bg-gray-500 transition-all"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="text-2xl font-bold text-center my-7">
        Carros novos e usados em todo o Brasil
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
                <strong className="text-xl font-medium">R$ {car.price}</strong>
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

      <Footer />
    </Container>
  );
}
