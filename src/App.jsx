import React, { useState, useEffect } from 'react';
// Removed Font Awesome imports as they caused issues in the preview

// Helper function to format date strings (optional but good practice)
const formatDate = (date) => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  // Use 'en-US' locale for consistent month/day names, adjust if needed
  // Add ordinal suffix (e.g., 2nd, 9th) - basic implementation
  const day = date.getDate();
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';

  // Format date and manually add suffix
  const formatted = date.toLocaleDateString('en-US', options);
  return formatted.replace(new RegExp(`\\b${day}\\b`), `${day}${suffix}`);
};

// --- Header Component ---
function Header() {
  return (
    <div className="text-center mb-10">
      <img
        src="https://southbeachmenu.coastline-fm.com/logo.png"
        alt="KAUST Logo"
        className="mx-auto mb-5 h-16"
        onError={(e) => {
          // Fallback placeholder if logo fails
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/150x50/cccccc/ffffff?text=Logo+Not+Found';
        }}
      />
      {/* Main Heading with Merriweather font - Apply font via CSS or Tailwind config */}
      {/* Ensure 'font-merriweather' is defined in your Tailwind config or CSS */}
      <h1 className="text-4xl font-bold text-gray-900 font-merriweather">South Beach</h1>
      {/* Sub Heading */}
      <p className="text-xl text-gray-700 mt-2 font-poppins font-medium">Friday Menu</p>
      {/* Description Text */}
      <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto">
        Special food offerings available only on Fridays between 3:00 PM and 6:00 PM
      </p>
    </div>
  );
}

// --- Menu Item Component ---
function MenuItem({ name, price }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{name}</span>
      <span className="font-semibold text-teal-800">SR {price.toFixed(2)}</span>
    </div>
  );
}

// --- Accordion Item Component ---
function AccordionItem({ date, items, isOpen, onToggle }) {
  // Format the date for display
  const displayDate = formatDate(new Date(date + 'T00:00:00')); // Ensure consistent parsing

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Add 'open' class to button when isOpen is true */}
      <button
        className={`toggle-button w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen} // Accessibility
      >
        <div>
          {/* Display formatted date */}
          <h2 className="text-lg font-semibold text-teal-700 font-poppins">{displayDate}</h2>
          <p className="text-xs text-gray-500 mt-0.5">3:00 PM - 6:00 PM</p>
        </div>
        {/* Use <i> tag for Font Awesome icon - rotation handled by CSS */}
        <span className="toggle-icon text-teal-600 transition-transform duration-300">
           {/* Removed Tailwind rotate class, CSS will handle it */}
          <i className="fas fa-chevron-down"></i>
        </span>
      </button>
      {/* Add 'open' class to content div when isOpen is true */}
      <div
         className={`toggle-content px-6 pb-4 border-t border-gray-200 transition-max-height duration-400 ease-in-out overflow-hidden ${isOpen ? 'open' : ''}`}
         style={{ maxHeight: isOpen ? '500px' : '0' }} // Control height for transition
         aria-hidden={!isOpen} // Accessibility
      >
        <div className="space-y-3 text-sm text-gray-700 pt-4">
          {items.map((item, index) => (
            <MenuItem key={index} name={item.name} price={item.price} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Accordion Component ---
function Accordion({ menuData }) {
  const [openIndex, setOpenIndex] = useState(null); // Index of the currently open item

  useEffect(() => {
    // Determine which accordion item should be open by default
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only

    let upcomingFridayIndex = -1;
    let minDiff = Infinity;

    menuData.forEach((item, index) => {
      const fridayDate = new Date(item.date + 'T00:00:00');
      const diff = (fridayDate - today) / (1000 * 60 * 60 * 24); // Difference in days

      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        upcomingFridayIndex = index;
      }
    });

    // Set the initial open index
    if (upcomingFridayIndex !== -1) {
      setOpenIndex(upcomingFridayIndex);
    } else if (menuData.length > 0) {
        // Fallback: open the first item if no upcoming date is found
        setOpenIndex(0);
    }
  }, [menuData]); // Rerun effect if menuData changes

  // Function to handle toggling accordion items
  const handleToggle = (index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index)); // Open clicked, close if already open
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {menuData.map((menu, index) => (
        <AccordionItem
          key={index}
          date={menu.date}
          items={menu.items}
          isOpen={openIndex === index} // Pass boolean based on state
          onToggle={() => handleToggle(index)} // Pass handler function
        />
      ))}
    </div>
  );
}


// --- Main App Component ---
export default function App() {
  // Define the menu data structure
  const fridayMenus = [
    {
      date: "2025-05-02",
      items: [
        { name: "Cold Pasta Salad with Pesto", price: 10.00 },
        { name: "Grilled Hot Dogs Sandwich with assorted toppings", price: 10.00 },
        { name: "Grilled Vegetables Wrap", price: 10.00 },
        { name: "Fruit Salad Cup", price: 10.00 },
      ],
    },
    {
      date: "2025-05-09",
      items: [
        { name: "Potato Wedges", price: 8.00 },
        { name: "Classic Beef Burger with wedges", price: 15.00 },
        { name: "Vegetable Burger with wedges", price: 12.00 },
        { name: "Fruit Salad Cup", price: 10.00 },
      ],
    },
    {
      date: "2025-05-16",
      items: [
        { name: "Tex Mex Platter (1 skewer Chicken Satay, 1 Skewer Beef Kebab with Yellow Rice & Salad)", price: 25.00 },
        { name: "Grilled Vegetables Wrap", price: 10.00 },
        { name: "Fruit Salad Cup", price: 10.00 },
      ],
    },
    {
      date: "2025-05-23",
      items: [
        { name: "Beef Kebab Sandwich", price: 12.00 },
        { name: "Shish Taouk Sandwich", price: 12.00 },
        { name: "Falafel Sandwich", price: 8.00 },
        { name: "Fruit Salad Cup", price: 10.00 },
      ],
    },
    {
      date: "2025-05-30",
      items: [
        { name: "Peri Peri Quarter Chicken with French fries & Bread", price: 18.00 },
        { name: "Falafel Sandwich", price: 8.00 },
        { name: "Fruit Salad Cup", price: 10.00 },
      ],
    },
  ];


  return (
    <>
      {/* Main container with white background and shadow */}
      <main className="container mx-auto px-4 sm:px-6 py-8 mt-8 mb-8 bg-white shadow-lg rounded-lg">
        <Header />
        <Accordion menuData={fridayMenus} />

        {/* Footer */}
        <footer className="bg-transparent mt-12 py-6">
          <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
            &copy; 2025 Coastline LLC. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}