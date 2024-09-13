const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7'];

function CategoryListComponent() {
  return (
    <>
    <div>
        <h1 className="text-4xl font-bold mb-4">Popular Categories</h1> {/* Adjust the size and style here */}
    </div>
    
<div className="flex flex-wrap gap-4  justify-between">
  {categories.map((category, index) => (
    <div key={index} className="bg-blue-500 text-white flex items-center justify-center h-40 w-40 rounded-lg shadow-md">
      {category}
    </div>
  ))}
</div>
    </>
   
   
  );
}

export default CategoryListComponent;
