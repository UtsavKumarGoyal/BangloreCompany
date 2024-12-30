import axios from "axios";

function Reset() {
  const handleReset = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/seats/reset",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("All bookings have been reset");
    } catch (err) {
      alert(err.response.data.message || "Reset failed");
    }
  };

  return (
    <div>
      <h1>Reset All Bookings</h1>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Reset;
