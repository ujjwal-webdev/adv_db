import AircraftMap from './components/AircraftMap';
import FlightPrices from './components/FlightPrices';
import CalendarPrices from './components/CalendarPrices';

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <div className="w-full h-[60vh]">
        <AircraftMap />
      </div>

      <div className="w-full px-4 pb-10 pt-6">
        <FlightPrices />
      </div>

      <div className="w-full px-4 pb-10 pt-6">
        <CalendarPrices />
      </div>
    </div>
  );
}

export default App;
