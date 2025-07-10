import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

const NavFooter = ({
  activeStep,
  handleStepChange,
  totalSteps,
  handleCreateAgent,
}: {
  activeStep: number;
  handleStepChange: (step: number) => void;
  totalSteps: number;
  handleCreateAgent: () => void;
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg shadow-gray-200">
      <Button
        className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
        disabled={activeStep === 1}
        onClick={() => handleStepChange(activeStep - 1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>
      <Button
        className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold"
        onClick={() => handleStepChange(activeStep + 1)}
      >
        {activeStep === totalSteps ? (
          <Button onClick={handleCreateAgent}>Create Agent</Button>
        ) : (
          "Next"
        )}
        {activeStep !== totalSteps && <ArrowRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default NavFooter;
