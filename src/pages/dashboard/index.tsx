import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelHeader";
import { FiTrash2, FiMapPin, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { Footer } from "../../components/footer";
import { Modal } from "../../components/modal";
import { toast } from "react-hot-toast";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  make: string;
  km: string | number;
  city: string;
  favorite: boolean;
  images: carImageProps[];
}

interface carImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [carId, setCarId] = useState("");

  useEffect(() => {
    function loadCars() {
      if (!user) return;
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));
      getDocs(queryRef).then((snapshot) => {
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
            favorite: doc.data().favorite,
          });
        });

        setCars(listCars);
      });
    }

    loadCars();
  }, [user]);

  async function handleDeleteCar(id: string) {
    await deleteDoc(doc(db, "cars", id)).then(() => {
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      setShowModal(!showModal);
      toast.success("Veículo deletado com sucesso");
    });
  }

  function toggleModal(idCar: string) {
    setCarId(idCar);
    setShowModal(!showModal);
  }

  return (
    <Container>
      {showModal && (
        <Modal
          close={() => setShowModal(!showModal)}
          delete={() => handleDeleteCar(carId)}
        />
      )}
      <DashboardHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <section
            key={car.id}
            className="w-full bg-[#2e3135] rounded-lg shadow-lg relative text-white"
          >
            <button
              className="h-14 w-14 bg-[#1A1A1A] rounded-full absolute flex items-center justify-center top-2 right-2 cursor-pointer hover:bg-[#555555] transition-all z-10"
              onClick={() => toggleModal(car.id)}
            >
              <FiTrash2 size={32} />
            </button>
            <img
              src={car.images[0].url}
              className="w-full mb-2 h-60 object-cover rounded-t-lg"
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
                className="bg-[#0082FF] py-3 mt-2 text-white rounded-lg text-center hover:bg-sky-500 transition-all cursor-pointer"
              >
                Ver mais
              </Link>
            </div>

            <div className="h-px bg-gray-600 my-3"></div>

            <div className="px-4 mb-4 flex items-center justify-between opacity-70">
              <span className="flex items-center gap-2 text-sm">
                <FiMapPin /> {car.city}
              </span>
            </div>
          </section>
        ))}
      </main>

      {cars.length === 0 && (
        <main className="flex items-center justify-center w-full flex-col h-screen -mt-28">
          <h1 className="text-2xl font-bold text-gray-500">
            Você ainda não tem anúncios...
          </h1>

          <Link
            to="/dashboard/new"
            className="flex justify-center items-center gap-2 bg-[#06233F] text-white py-3 px-8 rounded-lg ml-4 hover:bg-gray-500 transition-all cursor-pointer text-xl mt-4"
          >
            Criar novo anúncio
            <FiPlus color="white" size={25} />
          </Link>
        </main>
      )}

      <Footer />
    </Container>
  );
}
