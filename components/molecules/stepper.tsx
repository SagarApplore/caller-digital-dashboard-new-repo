export function Stepper(
  title: string,
  stepNo: number,
  currentIndex: number,
  maxSteps: number
) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepNo < currentIndex
              ? "bg-green-600 text-white"
              : stepNo === currentIndex
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {stepNo}
        </div>
        <span
          className={`font-medium ${
            stepNo < currentIndex
              ? "text-green-600"
              : stepNo === currentIndex
              ? "text-purple-600"
              : "text-gray-500"
          }`}
        >
          {title}
        </span>
      </div>

      {stepNo < maxSteps && <div className="w-16 h-px bg-gray-300"></div>}
    </>
  );
}
