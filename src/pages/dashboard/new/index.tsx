import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";

import { Input } from "../../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChangeEvent, useContext, useState } from "react";
import { storage, db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { Footer } from "../../../components/footer";
import toast from "react-hot-toast";

const schema = z.object({
  model: z.string().min(1, "Modelo é obrigatório"),
  make: z.string().min(1, "Marca é obrigatória"),
  year: z.string().min(1, "Ano é obrigatório"),
  km: z.string().min(1, "Km é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "Whatsapp é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value && event.target.files) {
      const image = event.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Imagem inválida, apenas imagens .jpeg e .png são permitidas");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}/`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const imageItem = {
          uid: currentUid,
          name: uidImage,
          previewUrl: URL.createObjectURL(image),
          url,
        };

        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    if (carImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem do veículo");
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, "cars"), {
      title: data.model.toUpperCase(),
      make: data.make,
      year: data.year,
      km: data.km,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      created: new Date(),
      owner: user?.displayName, //talvez seja aqui
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        setCarImages([]);
        reset();
        toast.success("Veículo anunciado com sucesso");
      })
      .catch((error) => {
        console.log("Erro ao anunciar veículo: " + error);
      });
  }

  async function handleDeleteImage(image: ImageItemProps) {
    const imageRef = ref(storage, `images/${image.uid}/${image.name}`);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((item) => item.name !== image.name));
    } catch (error) {
      console.error("Erro ao deletar imagem " + error);
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-[#17181A] p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-400 h-32">
          <div className="absolute cursor-pointer">
            <FiUpload size={32} color="#9CA3AF" />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute z-10"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={32} color="white" />
            </button>
            <img
              src={item.previewUrl}
              alt="Foto do carro"
              className="w-full h-32 object-cover rounded-lg brightness-75"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-[#121314] text-white p-5 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2 mb-10 shadow-lg">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Título</p>
            <Input
              type="text"
              placeholder="Ex: Fiat Cronos..."
              name="model"
              register={register}
              error={errors.model?.message}
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo</p>
            <Input
              type="text"
              placeholder="Ex: 2.0 FLEX TURBO..."
              name="make"
              register={register}
              error={errors.make?.message}
            />
          </div>

          <div className="flex gap-4">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                placeholder="Ex: 2023/2023..."
                name="year"
                register={register}
                error={errors.year?.message}
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Quilometragem</p>
              <Input
                type="text"
                placeholder="Ex: 20.000..."
                name="km"
                register={register}
                error={errors.km?.message}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Telefone / WhatsApp</p>
              <Input
                type="text"
                placeholder="Ex: 61983171532..."
                name="whatsapp"
                register={register}
                error={errors.whatsapp?.message}
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                placeholder="Ex: Taguatinga..."
                name="city"
                register={register}
                error={errors.city?.message}
              />
            </div>
          </div>

          <div className="mb-3 w-full">
            <p className="mb-2 font-medium">Valor</p>
            <Input
              type="text"
              placeholder="Ex: 80.000..."
              name="price"
              register={register}
              error={errors.price?.message}
            />
          </div>

          <div className="mb-3 w-full">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="w-full p-3 rounded-lg h-24 resize-none outline-none bg-[#333537]"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa do veículo..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description?.message}</p>
            )}
          </div>

          <button
            className="bg-[#0082FF] text-white w-full py-4 mt-3 rounded-lg"
            type="submit"
          >
            Anunciar veículo
          </button>
        </form>
      </div>

      <Footer />
    </Container>
  );
}
