import React from "react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface FooterProps {
    currentStep: number;
    validateForm: () => Promise<boolean>;
    onClickNext: (step: number) => void;
    onFinalize: () => void;
}

const Footer: React.FC<FooterProps> = ({currentStep, validateForm, onClickNext, onFinalize}) => {
    const {loading_submit} = controller_recebedor.contexto.jsx.get_formulario();

    const handleNextOrFinalize = async () => {
        const isValid = await validateForm();
        if (!isValid || loading_submit) {
            return;
        }

        if (currentStep === 2) {
            // Apenas chame a função onFinalize do componente pai.
            onFinalize();
        } else {
            // Para as outras etapas, continue chamando onClickNext.
            onClickNext(currentStep);
        }
    };

    const handleBack = () => {
        controller_recebedor.contexto.state.set_steep_progress(currentStep - 1);
    };

    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
                type="button"
                color="default"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-md border transition-colors ${
                    currentStep === 0 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
            >
                <ChevronLeft className="w-4 h-4" />
                Voltar
            </button>

            <button
                type="button"
                color="default"
                onClick={handleNextOrFinalize}
                disabled={loading_submit}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
                {currentStep === 2 ? "Finalizar" : "Próximo"}
                {currentStep !== 2 && <ChevronRight className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default Footer;
