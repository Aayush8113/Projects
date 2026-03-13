const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm w-fit animate-fade-in">
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 delay-150 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 delay-300 bg-pink-500 rounded-full animate-pulse"></div>
    </div>
  );
};

export default TypingIndicator;