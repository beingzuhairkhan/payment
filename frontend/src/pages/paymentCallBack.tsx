import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function PaymentCallback() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "cancelled">("loading");
  const [message, setMessage] = useState("Processing payment...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectRequestId = params.get("EdvironCollectRequestId");
    const paymentStatus = params.get("status");

    if (!collectRequestId) {
      setStatus("error");
      setMessage("Invalid payment redirect.");
      return;
    }

    if (paymentStatus === "SUCCESS") {
      axios
        .get(`https://payment-8a95.onrender.com/api/order/verify-payment?collect_request_id=${collectRequestId}`)
        .then((res) => {
          if (res.data.status === "success") {
            setStatus("success");
            setMessage("Payment Successful! 🎉");
          } else {
            setStatus("error");
            setMessage("Payment not confirmed. Please contact support.");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("error");
          setMessage("Error verifying payment.");
        });
    } else {
      setStatus("cancelled");
      setMessage("Payment failed or cancelled.");
    }
  }, [location]);

  // Conditional styling based on status
  const statusStyles = {
    loading: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    cancelled: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div
        className={`max-w-md w-full border-l-4 p-6 rounded shadow-md ${statusStyles[status]} transition-all duration-500`}
      >
        {status === "loading" && (
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
            <span className="text-lg font-medium">{message}</span>
          </div>
        )}
        {status !== "loading" && <p className="text-lg font-medium">{message}</p>}
      </div>
    </div>
  );
}
