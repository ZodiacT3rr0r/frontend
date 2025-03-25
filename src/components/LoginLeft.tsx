import Plane from "./911";
import Radar from "./Radar";

const LoginLeft = () => {

  const stats = [
    { label: "Language Support", value: "30+" },
    { label: "Developers", value: "10K+" },
    { label: "Hours Saved", value: "100K+" },
  ];

  return ( 
    <div className="hidden lg:flex justify-center pt-4 items-center h-screen w-1/2 border-r border-gray-800 bg-transparent relative text-white">
      <div className="relative w-[474px] h-[322px]">
        {/* Feature Summary */}
        <div className="relative z-8 w-[447px] h-[170px] border border-gray-800 bg-[#242424] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] shadow-gray-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-5 text-lg font-bold">
            <img src="/logo-blue.svg" alt="App Logo" className="w-8 h-8" />
            <p>Taskpilot</p>
          </div>
          <div className="flex justify-between mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <span className="block text-lg font-bold">{stat.value}</span>
                <p className="text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Details */}
        <div className="absolute bottom-0 z-10 right-0 w-[265px] h-[164px] border border-gray-800 bg-[#242424] shadow-[4px_4px_10px_rgba(0,0,0,0.2)] shadow-gray-800  rounded-3xl p-4 flex flex-col justify-between">
          <div className="relative">
            <img src="/pie.svg" alt="Pie Chart" className="w-16 h-16" />
            <p className="text-sm font-bold mt-2">
              Issues Fixed <span className="block text-2xl">500K+</span>
            </p>
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <img src="/upArr.svg" alt="Up Arrow" className="w-4 h-4" />
              <p className="text-blue-600 font-bold text-sm">14%</p>
              <p className="text-xs">This Week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <Plane />
      </div>

      <div className="absolute bottom-0 left-0 p-8">
        <Radar />
      </div>
    </div>
  );
}
 
export default LoginLeft;