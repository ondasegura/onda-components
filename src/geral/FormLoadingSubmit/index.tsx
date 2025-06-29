import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface FormLoadingSubmitProps {
    loading?: boolean;
}

export const FormLoadingSubmit: React.FC<FormLoadingSubmitProps> = ({ loading }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const steps = ["Validando dados...", "Processando informações...", "Salvando no banco de dados...", "Finalizando operação..."];

    const stepDuration = 800;

    useEffect(() => {
        if (loading) {
            setShowSuccess(false);
            setCurrentStep(0);

            const interval = setInterval(() => {
                setCurrentStep((prev) => {
                    const nextStep = prev + 1;
                    if (nextStep >= steps.length) {
                        setShowSuccess(true);
                        clearInterval(interval);
                        return prev;
                    }
                    return nextStep;
                });
            }, stepDuration);

            return () => clearInterval(interval);
        } else {
            setCurrentStep(0);
            setShowSuccess(false);
        }
        return;
    }, [loading, steps.length]);

    const getCurrentMessage = () => {
        if (showSuccess) return "Operação Concluída!";
        return steps[currentStep] || steps[0];
    };

    const getProgressPercentage = () => {
        if (showSuccess) return 100;
        return ((currentStep + 1) / steps.length) * 100;
    };

    if (!loading) return null;

    return (
        <div className={`absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6 mx-4 max-w-xs w-full animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                    <div className="relative mx-auto mb-4">
                        <div className="w-12 h-12 mx-auto">
                            {showSuccess ? (
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 animate-bounce" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="w-12 h-12 border-3 border-blue-100 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-12 h-12 border-3 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                                    </div>
                                    <div
                                        className="absolute top-1 left-1 w-10 h-10 border-2 border-blue-300 rounded-full border-b-transparent animate-spin"
                                        style={{ animationDuration: "2s" }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 transition-all duration-300">{showSuccess ? "Operação Concluída!" : "Processando..."}</h3>

                    <p className="text-xs text-gray-600 mb-4 transition-all duration-300 min-h-[16px]">{getCurrentMessage()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${showSuccess ? "bg-green-500" : "bg-blue-600"}`}
                            style={{
                                width: `${getProgressPercentage()}%`,
                                transform: `translateX(${showSuccess ? "0%" : "-2px"})`,
                            }}
                        >
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 transform ${
                                    index <= currentStep || showSuccess ? `scale-110 ${showSuccess ? "bg-green-500" : "bg-blue-600"}` : "scale-100 bg-gray-300"
                                }`}
                                style={{
                                    transitionDelay: `${index * 100}ms`,
                                }}
                            />
                        ))}
                    </div>
                    {showSuccess && (
                        <div className="mt-3 animate-in fade-in slide-in-from-bottom duration-500">
                            <p className="text-xs text-green-600 font-medium">✓ Dados salvos com sucesso</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
