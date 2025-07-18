import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

const NavFooter = ({
  activeStep,
  handleStepChange,
  totalSteps,
  handleCreateAgent,
  mode = "create",
  creating,
  validateCurrentStep,
}: {
  activeStep: number;
  handleStepChange: (step: number) => void;
  totalSteps: number;
  handleCreateAgent: () => void;
  mode?: "create" | "edit";
  creating: boolean;
  validateCurrentStep: () => { isValid: boolean; errors: string[] };
}) => {
  const handleNext = () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      // The error will be shown by the parent component
      return;
    }
    handleStepChange(activeStep + 1);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg shadow-gray-200">
      <Button
        className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
        disabled={activeStep === 1 || creating}
        onClick={() => handleStepChange(activeStep - 1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>
      {activeStep === totalSteps ? (
        <Button
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold"
          disabled={creating}
          onClick={handleCreateAgent}
        >
          {mode === "edit" ? "Update Agent" : "Create Agent"}
        </Button>
      ) : (
        <Button
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold"
          onClick={handleNext}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default NavFooter;
