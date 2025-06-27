import React from "react";
import {Check} from "lucide-react";

interface Step {
    label: string;
}

interface HeaderProps {
    steps: Step[];
    currentStep: number;
}

const Header: React.FC<HeaderProps> = ({steps, currentStep}) => {
    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cadastro de Recebedor</h1>

            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                    index < currentStep ? "bg-green-600 text-white" : index === currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                            </div>
                            <span className={`mt-2 text-xs font-medium text-center max-w-24 ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>{step.label}</span>
                        </div>

                        {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 transition-colors ${index < currentStep ? "bg-green-600" : "bg-gray-200"}`} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Header;
