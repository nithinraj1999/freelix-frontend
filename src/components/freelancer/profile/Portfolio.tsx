import React from "react";

const Portfolio: React.FC = () => {
  const portfolioItems = [
    { id: 1, image: "https://res.cloudinary.com/dhir9n7dj/image/upload/v1720798873/cld-sample.jpg", title: "Project 1" },
    { id: 2, image: "https://via.placeholder.com/300", title: "Project 2" },
    { id: 3, image: "https://via.placeholder.com/300", title: "Project 3" },
    { id: 4, image: "https://via.placeholder.com/300", title: "Project 4" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700 pl-14 pr-14 pb-8">Portfolio</h2>
      <div className="flex flex-wrap justify-start pl-14 pr-14">
        {portfolioItems.map((item) => (
          <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 p-2">
            <div className="bg-white rounded shadow-md overflow-hidden relative group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-white text-lg font-semibold">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
