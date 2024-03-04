import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Footer } from "../../components/footer";

import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  title: string;
  make: string;
  city: string;
  year: string;
  km: string | number;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string | number;
  favorite: boolean;
  images: ImageCarProps[];
}

interface ImageCarProps {
  uid: string;
  name: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.data()?.id,
          title: snapshot.data()?.title,
          make: snapshot.data()?.make,
          city: snapshot.data()?.city,
          year: snapshot.data()?.year,
          km: snapshot.data()?.km,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          price: snapshot.data()?.price,
          owner: snapshot.data()?.owner,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
          favorite: snapshot.data()?.favorite,
        });
      });
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
          rewind
          spaceBetween={15}
        >
          {car?.images.map((images) => (
            <SwiperSlide key={images.uid}>
              <img
                src={images.url}
                alt="Foto do carro"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4 shadow-lg">
          <div className="flex items-center justify-between font-bold md:text-2xl">
            <h1>{car.title}</h1>
            <h1>
              <span className="text-base">R$ </span>
              {car.price}
            </h1>
          </div>
          <p>{car.make}</p>

          <div className="flex gap-10 my-10">
            <div className="flex flex-col gap-2">
              <p>Cidade</p>
              <strong>{car.city}</strong>
            </div>
            <div className="flex flex-col gap-2">
              <p>Ano</p>
              <strong>{car.year}</strong>
            </div>
            <div className="flex flex-col gap-2">
              <p>Quilometragem</p>
              <strong>{car.km} Km</strong>
            </div>
          </div>

          <div className="mb-6">
            <strong>Descrição:</strong>
            <p className="mt-2">{car.description}</p>
          </div>

          <div className="mb-6">
            <strong>Telefone</strong>
            <p className="mt-2">{car.whatsapp}</p>
          </div>

          <a
            href={`https://api.whatsapp.com/send/?phone=${car?.whatsapp}&text=Olá, ${car.owner}! Vi o seu anúncio do carro ${car?.title} no site do DevCarros e gostaria de mais informações.`}
            target="_blank"
            className="w-full flex justify-center items-center gap-3 text-white p-4 rounded-lg bg-green-500"
          >
            <p className="font-medium md:text-xl lg:text-2xl">
              Falar com vendedor
            </p>
            <FaWhatsapp size={30} color="white" />
          </a>
        </main>
      )}

      <Footer />
    </Container>
  );
}
