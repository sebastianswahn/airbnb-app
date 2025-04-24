import { useIsMobile } from "@/hooks/useIsMobile";

interface CategoriesProps {
  activeCategory: string;
  onChange: (categoryId: string) => void;
  showOnDesktop?: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ 
  activeCategory, 
  onChange,
  showOnDesktop = false 
}) => {
  const isMobile = useIsMobile();
  
  // If on desktop and not showing categories there, return null
  if (!isMobile && !showOnDesktop) {
    return null;
  }
  
  const categories = [
    { id: "amazing-views", name: "Amazing views", icon: "🏔️" },
    { id: "beachfront", name: "Beachfront", icon: "🏖️" },
    { id: "countryside", name: "Countryside", icon: "🏡" },
    { id: "iconic-cities", name: "Iconic cities", icon: "🏙️" },
    // Add more categories as needed
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-6 py-4">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`flex flex-col items-center min-w-[80px] pb-2 border-b-2 transition
            ${activeCategory === category.id 
              ? "border-black text-black" 
              : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-800"}`}
          onClick={() => onChange(category.id)}
        >
          <span className="text-2xl mb-1">{category.icon}</span>
          <span className="text-xs whitespace-nowrap">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Categories;
