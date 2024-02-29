interface ModalProps {
  close: () => void;
  delete: () => void;
}

export function Modal({ close, delete: handleDeleteCar }: ModalProps) {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-[#00000073] z-20">
      <main className="fixed max-w-[500px] top-[30%] right-0 left-0 mx-auto bg-white flex items-center justify-center flex-col p-5 rounded-lg shadow-2xl">
        <p className="font-medium text-xl mt-4">
          Tem certeza que deseja deletar o anúncio?
        </p>
        <p className="opacity-80">Uma vez deletado será impossível recuperar</p>
        <div className="mt-6 p-3 flex items-center justify-center gap-8 text-white">
          <button
            className="bg-red-500 py-3 px-6 rounded-md"
            onClick={handleDeleteCar}
          >
            Deletar
          </button>
          <button className="bg-blue-950 py-3 px-6 rounded-md" onClick={close}>
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}
