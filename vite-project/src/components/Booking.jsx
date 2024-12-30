// // import { useState, useEffect } from "react";
// // import axios from "axios";

// // function Booking() {
// //   const [seats, setSeats] = useState([]);
// //   const [selectedSeats, setSelectedSeats] = useState([]);

// //   useEffect(() => {
// //     const fetchSeats = async () => {
// //       const res = await axios.get("http://localhost:5000/api/seats", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setSeats(res.data);
// //     };
// //     fetchSeats();
// //   }, []);

// //   const handleSeatClick = (seat) => {
// //     if (selectedSeats.includes(seat)) {
// //       setSelectedSeats(selectedSeats.filter((s) => s !== seat));
// //     } else if (selectedSeats.length < 7) {
// //       setSelectedSeats([...selectedSeats, seat]);
// //     }
// //   };

// //   const handleBooking = async () => {
// //     try {
// //       await axios.post(
// //         "http://localhost:5000/api/seats/book",
// //         { seats: selectedSeats },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       alert("Seats booked successfully");
// //       setSelectedSeats([]);
// //     } catch (err) {
// //       alert(err.response.data.message || "Booking failed");
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Book Your Seats</h1>
// //       <div className="seats">
// //         {Array.from({ length: 80 }, (_, i) => i + 1).map((seat) => (
// //           <button
// //             key={seat}
// //             onClick={() => handleSeatClick(seat)}
// //             disabled={seats.includes(seat)}
// //             className={selectedSeats.includes(seat) ? "selected" : ""}
// //           >
// //             {seat}
// //           </button>
// //         ))}
// //       </div>
// //       <button onClick={handleBooking}>Book Selected Seats</button>
// //     </div>
// //   );
// // }

// // export default Booking;


import { useState, useEffect} from "react";
import axios from "axios";

function Booking() {
  const [seats, setSeats] = useState(Array(80).fill(false)); // 80 seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(0);

  useEffect(() => {
    // Fetch booked seats from the backend
    const fetchSeats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/seats");
        setSeats(response.data); // Assume API returns an array of 80 booleans
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };
    fetchSeats();
  }, []);

  const handleSeatClick = (index) => {
    if (selectedSeats.length < 7 && !seats[index]) {
      // Add seat to selection if under the limit and not already booked
      setSelectedSeats((prev) => [...prev, index]);
    } else if (selectedSeats.includes(index)) {
      // Remove seat if it's already selected
      setSelectedSeats((prev) => prev.filter((seat) => seat !== index));
    }
  };

  const handleBooking = async () => {
    try {
      await axios.post("http://localhost:5000/api/seats/book", {
        seats: selectedSeats,
      });
      alert("Seats booked successfully");
      setSelectedSeats([]);
      // Refresh the seat data
      const response = await axios.get("http://localhost:5000/api/seats");
      setSeats(response.data);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed");
    }
  };

  return (
    <div className="booking-container">
      <h1>Ticket Booking</h1>
      <div className="seats-container">
        {seats.map((booked, index) => (
          <button
            key={index}
            className={`seat ${booked ? "booked" : selectedSeats.includes(index) ? "selected" : "available"}`}
            onClick={() => handleSeatClick(index)}
            disabled={booked}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="controls">
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(Number(e.target.value))}
          placeholder="Enter seats to book"
        />
        
        <button onClick={handleBooking}>Book</button>
        <p>
          Selected Seats: {selectedSeats.map((seat) => seat + 1).join(", ")}
        </p>
      </div>
    </div>
  );
}

export default Booking;

