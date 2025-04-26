import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';

const CalendarPrices = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('LHR');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  console.log('selectedMonth:', selectedMonth);

  const fetchCalendarData = async (origin, destination, month) => {
    try {
      const startDateStr = month.toLocaleDateString('en-CA');

      const endDate = new Date(month);
      endDate.setDate(endDate.getDate() + 41);
      const endDateStr = endDate.toLocaleDateString('en-CA');

      const res = await api.get('/prices/calendar', {
        params: { origin, destination, startDate: startDateStr, endDate: endDateStr }
      });

      setCalendarData(res.data);
    } catch (err) {
      console.error('Error fetching calendar data:', err.message);
      setCalendarData([]);
    }
  };

  useEffect(() => {
    fetchCalendarData(origin, destination, selectedMonth);
  }, [origin, destination, selectedMonth]);

  const getPriceForDate = (date) => {
       const dateStr = date.toLocaleDateString('en-CA');
       const entry = calendarData.find(item => item.date === dateStr);
       return entry ? `${entry.currency} ${entry.price}` : null;
    };
    

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Cheapest Flight Calendar</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          placeholder="Origin (e.g. DEL)"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="Destination (e.g. LHR)"
          className="p-2 border rounded"
        />
      </div>

      <Calendar
        value={selectedMonth}
        onActiveStartDateChange={({ activeStartDate }) => setSelectedMonth(activeStartDate)}
        tileContent={({ date, view }) => {
            if (view !== 'month') return null;

            const dateStr = date.toLocaleDateString('en-CA');
            const entry = calendarData.find(item => item.date === dateStr);

            if (!entry) return null;

            let priceColor = 'text-gray-500'; // Default
            if (entry.price <= 300) priceColor = 'text-green-600 font-bold';
            else if (entry.price <= 400) priceColor = 'text-yellow-500 font-semibold';
            else priceColor = 'text-red-600 font-bold';

            return (
                <div className={`text-xs mt-1 ${priceColor}`}>
                    {`${entry.currency} ${entry.price}`}
                </div>
            ); 
        }}
    />
    </div>
  );
};

export default CalendarPrices;