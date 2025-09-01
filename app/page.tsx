export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white">
      <h1 className="text-5xl font-bold">LoadoutLab</h1>
      <p className="mt-4 text-xl text-gray-400">
        Build your dream loadout with real parts & prices.
      </p>
      <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
        Join the Waitlist
      </button>
    </main>
  );
}
