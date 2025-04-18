import CityMap from "../../components/CityMap/CityMap";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";

export default function CityDashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Área do CityMap com scroll */}
        <div className="flex-1 bg-gray-900 overflow-auto">
          <div className="min-h-full flex items-center justify-center">
            <CityMap />
          </div>
        </div>

        {/* Sidebar com scroll independente */}
        <Sidebar />
      </div>

      <Footer />
      
    </div>
  );
}
