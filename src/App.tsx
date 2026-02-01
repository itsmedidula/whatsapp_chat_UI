import { ChatWall } from "./components/ChatWall";

export function App() {
  return (
    <div className="min-h-screen bg-[#d1d7db] flex items-center justify-center">
      <div className="w-full h-full md:h-[90vh] md:max-w-[450px] md:shadow-xl overflow-hidden relative">
         <div className="absolute top-0 w-full h-20 bg-[#00a884] hidden md:block z-0 transform -translate-y-10"></div>
         <ChatWall />
      </div>
    </div>
  );
}
