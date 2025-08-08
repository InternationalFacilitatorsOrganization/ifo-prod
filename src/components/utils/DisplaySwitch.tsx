export const DisplaySwitch = ({ display, setDisplay }: { display: string; setDisplay: (display: string) => void }) => {
  return (
    <div className="flex flex-row space-x-2">
      Display: 
      <a
        className={`px-4  rounded-md ${display === "cards" ? " text-cool-green" : "bg-white text-primary hover:cursor-pointer"}`}
        onClick={() => setDisplay("cards")}
      >
        Cards
      </a>
      <a
        className={`px-4 rounded-md ${display === "data-grid" ? "bg-primary text-white" : "bg-white text-primary hover:cursor-pointer"}`}
        onClick={() => setDisplay("grid")}
      >
        Table
      </a>
    </div>
  );
};

