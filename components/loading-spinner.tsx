type LoadingSpinnerPropsType = {
  stepNumber: number;
};

type LoadingTitleMap = {
  [key: number]: string;
};

function LoadingSpinner({ stepNumber }: LoadingSpinnerPropsType) {
  const loadingTitle: LoadingTitleMap = {
    2: "Starting to cook some recommendations...",
    3: "Only one step missing!",
    4: "Finishing the last details & generating your new book(s)! ✨",
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mb-4 flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-y-2 border-gray-900"></div>
        <div className="ml-2 text-lg font-semibold">
          {loadingTitle[stepNumber]}
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
