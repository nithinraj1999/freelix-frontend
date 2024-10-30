const categories = [
  "Programming",
  "Graphic Designing ",
  "Video Editing",
  "Translation",
  "Animation",
  "Digital Marketing",
  "Voice over",
];

function CategoryListComponent() {
  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-4">Popular Categories</h1>
      </div>
      <div className="flex flex-wrap gap-4  justify-between">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-emerald-400 font-bold text-white flex items-center justify-center h-40 w-40 rounded-lg shadow-md"
          >
            {category}
          </div>
        ))}
      </div>
    </>
  );
}

export default CategoryListComponent;
