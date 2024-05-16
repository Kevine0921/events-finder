"use client";

import { useEffect } from "react";
import {
  BOOK_REC_KEY,
  RECOMMENDATIONS_KEY,
} from "@/constants/localStorageKeys";
import { stepDescriptions, stepTitles } from "@/data/wizardData";
import useAPIRequestsState from "@/store/requestsStore";
import useWizardState from "@/store/wizardStore";
import { parseRecommendations } from "@/utils/parseRecommendations";
import Conffetti from "react-confetti";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoadingSpinner from "../loading-spinner";
import RecommendationsArtwork from "../recommendations/recommendations-artwork";
import FirstStep from "./steps/first-step";
import SecondStep from "./steps/second-step";
import ThirdStep from "./steps/third-step";

interface StepComponents {
  [key: number]: JSX.Element;
}

function Wizard() {
  const {
    currentStep,
    incrementStep,
    decrementStep,
    resetStep,
    setFinalStep,
    favoriteGenre,
    setFavoriteGenre,
    selectedMood,
    setSelectedMood,
    bookLengthPreference,
    setBookLengthPreference,
    resetSelectedMood,
    resetFavoriteGenre,
    resetBookLengthPreference,
  } = useWizardState();

  const {
    isLoading,
    setLoading,
    fetchRecommendations,
    fetchBookInformation,
    recommendations,
    bookInformation,
    setBookInformation,
    setRecommendations,
    bookInformationError,
    recommendationsError,
  } = useAPIRequestsState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRecommendations = localStorage.getItem(RECOMMENDATIONS_KEY);
      const storedBookInformation = localStorage.getItem(BOOK_REC_KEY);

      if (storedRecommendations && storedBookInformation) {
        setFinalStep();
        setRecommendations(JSON.parse(storedRecommendations));
        setBookInformation(JSON.parse(storedBookInformation));
      }
    }
  }, [setFinalStep, setRecommendations, setBookInformation]);

  const handleNextStep = () => {
    setLoading(true);
    const nextStep = currentStep + 1;
    incrementStep();

    if (nextStep === 4) {
      (async () => {
        await fetchRecommendations(
          favoriteGenre,
          selectedMood,
          bookLengthPreference
        );
        await fetchBookInformation();

        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    decrementStep();
  };

  const handleResetWizard = () => {
    setLoading(true);

    resetStep();
    resetFavoriteGenre();
    resetSelectedMood();
    resetBookLengthPreference();

    if (typeof window !== "undefined") {
      localStorage.removeItem(RECOMMENDATIONS_KEY);
      localStorage.removeItem(BOOK_REC_KEY);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const shouldShowConfetti =
    typeof window !== "undefined" &&
    !localStorage.getItem(RECOMMENDATIONS_KEY) &&
    !bookInformationError &&
    !recommendationsError;

  const stepComponents: StepComponents = {
    1: (
      <FirstStep
        favoriteGenre={favoriteGenre}
        onSelectGenre={setFavoriteGenre}
      />
    ),
    2: (
      <SecondStep
        selectedMood={selectedMood}
        onSelectedMood={setSelectedMood}
      />
    ),
    3: (
      <ThirdStep
        selectedBookLength={bookLengthPreference}
        onSelectedLength={setBookLengthPreference}
      />
    ),
    4: (
      <>
        {isLoading && <LoadingSpinner stepNumber={currentStep} />}
        {!isLoading && bookInformation && typeof window !== "undefined" && (
          <>
            {shouldShowConfetti && (
              <Conffetti numberOfPieces={200} opacity={0.6} recycle={false} />
            )}
            <RecommendationsArtwork
              recommendations={parseRecommendations(recommendations)}
              bookInformation={bookInformation}
              error={!!bookInformationError || !!recommendationsError}
            />
          </>
        )}
      </>
    ),
  };

  const renderStepComponent = () => {
    return (
      stepComponents[currentStep] || (
        <FirstStep onSelectGenre={setFavoriteGenre} />
      )
    );
  };

  const isStep1Disabled = currentStep === 1 && !favoriteGenre;
  const isStep2Disabled = currentStep === 2 && !selectedMood;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{stepTitles[currentStep]}</CardTitle>
        <CardDescription>{stepDescriptions[currentStep]}</CardDescription>
      </CardHeader>
      {isLoading && (
        <CardContent className="flex items-center justify-center">
          <LoadingSpinner stepNumber={currentStep} />
        </CardContent>
      )}
      {!isLoading && (
        <>
          <CardContent>{renderStepComponent()}</CardContent>
          <CardFooter>
            <div className="mx-auto mt-6 flex space-x-6">
              {currentStep !== 1 && currentStep !== 4 && (
                <Button
                  disabled={currentStep === 1}
                  onClick={handlePreviousStep}
                  aria-label="Go back to the previous step"
                >
                  Go back
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  onClick={handleNextStep}
                  disabled={isStep1Disabled}
                  aria-label="Continue to the next step"
                >
                  Continue
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  onClick={handleNextStep}
                  disabled={isStep2Disabled}
                  aria-label="Continue to the next step"
                >
                  Continue
                </Button>
              )}
              {currentStep === 3 && bookLengthPreference && (
                <Button
                  onClick={handleNextStep}
                  aria-label="Get recommendations"
                >
                  Give me some recommendations! ✨
                </Button>
              )}
              {currentStep === 4 && (
                <Button onClick={handleResetWizard} aria-label="Start again">
                  Start again 🎉
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default Wizard;
