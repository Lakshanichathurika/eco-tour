export default function DestinationPopup({ destination, onClose }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">

      <div className="w-full md:w-[700px] bg-white h-screen p-8 overflow-y-auto">

        <button
          onClick={onClose}
          className="text-3xl font-bold float-right"
        >
          ✕
        </button>

        <h1 className="text-4xl font-bold mt-10">
          {destination.title}
        </h1>

        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-80 object-cover rounded-2xl mt-8"
        />

        <p className="mt-8 text-lg text-gray-600">
          {destination.description}
        </p>

      </div>

    </div>
  );
}