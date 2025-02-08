const NavigationBar = () => {
  return (
    <nav className="flex items-center w-full h-full bg-white border-gray-200 px-2 sm:px-4 py-2.5" style={{border: "1px solid #EFF0F8"}}>
      <div className="container flex flex-wrap flex-row-reverse items-center self-center justify-between max-w-none">
        <button
          type="button"
          className="flex mr-3 text-sm rounded-full md:mr-0"
        >
          <img
            alt="Bordered avatar"
            className="w-10 h-10 p-1 rounded-full ring-2 ring-medium-slate-blue "
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </button>
        <button
          type="button"
          className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
