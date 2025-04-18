import CityMap from "../../components/CityMap/CityMap";

export default function CityDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Minha Cidade</h1>
      <CityMap />
    </div>
  );
}