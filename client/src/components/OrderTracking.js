import React from "react";

const OrderTracking = () => {
  // Dummy tracking data
  const trackingSteps = [
    { id: 1, label: "Order Placed", date: "2024-11-20", completed: true },
    { id: 2, label: "Order Shipped", date: "2024-11-21", completed: true },
    { id: 3, label: "Arrived at Delivering Facility", date: "2024-11-22", completed: true },
    { id: 4, label: "Out for Delivery", date: "2024-11-23", completed: false },
    { id: 5, label: "Delivered", date: "2024-11-24", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Track Your Order</h1>
        <div className="space-y-4">
          {trackingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg shadow-sm 
                ${step.completed ? "bg-green-100 border-l-4 border-green-500" : "bg-gray-50 border-l-4 border-gray-300"}
              `}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full
                  ${step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}
                `}
              >
                {step.completed ? (
                  <span>&#10003;</span> // Checkmark for completed steps
                ) : (
                  <span>{index + 1}</span> // Step number for pending steps
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{step.label}</h3>
                <p className="text-sm text-gray-600">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
