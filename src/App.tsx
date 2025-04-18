import { ThemeProvider } from "@/components/theme-provider"
import CityDashboardPage from "./pages/City/CityDashboardPage"
 
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
      <CityDashboardPage />
      </div>
    </ThemeProvider>
  )
}
 
export default App