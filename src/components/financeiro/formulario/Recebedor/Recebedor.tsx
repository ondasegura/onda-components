import React, {useEffect, useRef, useState} from "react";
import {X, Loader2, CheckCircle, AlertCircle} from "lucide-react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
import TipoCadastro from "./1-tipo-cadastro";
import DadosPessoais from "./2-dados-pessoais";
import DadosBancarios from "./3-dados-bancarios";
import Header from "./header";
import Footer from "./footer";

const steps = [{label: "Tipo de Cadastro"}, {label: "Dados Pessoais"}, {label: "Dados Bancários"}];

interface SnackbarProps {
    open: boolean;
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({open, message, type, onClose}) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                    type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
                }`}
            >
                {type === "success" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors" color="default">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({open, onClose, title, children}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" color="default">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6">{children}</div>
                    <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" color="default">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FinanceiroFormularioRecebedor: React.FC = () => {
    // Estados do controller Zustand
    const formularioState = controller_recebedor.contexto.jsx.get_formulario();

    // Estados locais
    const [modalOpen, setModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs para os componentes dos passos
    const tipoCadastroRef = useRef<any>(null);
    const dadosPessoaisRef = useRef<any>(null);
    const dadosBancariosRef = useRef<any>(null);

    const setLoading = (loading: boolean) => {
        setIsSubmitting(loading);
    };

    const setSubmitErrorHandler = (error: string | null) => {
        setSubmitError(error);
    };

    const setSubmitSuccessHandler = (success: boolean) => {
        setSubmitSuccess(success);
        if (success) {
            setModalOpen(true);
            // Reset do formulário usando o controller
            controller_recebedor.contexto.state.reset();
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <TipoCadastro ref={tipoCadastroRef} />;
            case 1:
                return <DadosPessoais ref={dadosPessoaisRef} />;
            case 2:
                return <DadosBancarios ref={dadosBancariosRef} setSubmitSuccess={setSubmitSuccessHandler} setSubmitError={setSubmitErrorHandler} setLoading={setLoading} />;
            default:
                return <TipoCadastro ref={tipoCadastroRef} />;
        }
    };

    const handleClickNext = (step: number) => {
        if (step === 0) {
            tipoCadastroRef.current?.onSubmitTipoCadastro();
        } else if (step === 1) {
            dadosPessoaisRef.current?.onSubmitDadosPessoais();
        } else if (step === 2) {
            dadosBancariosRef.current?.onSubmitDadosBancarios();
        }
    };

    const validateCurrentForm = async (): Promise<boolean> => {
        if (formularioState.step === 0 && tipoCadastroRef.current) {
            return await tipoCadastroRef.current.validateForm();
        } else if (formularioState.step === 1 && dadosPessoaisRef.current) {
            return await dadosPessoaisRef.current.validateForm();
        } else if (formularioState.step === 2 && dadosBancariosRef.current) {
            return await dadosBancariosRef.current.validateForm();
        }
        return true;
    };

    const handleCloseSnackbar = () => {
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Navegação - ajuste conforme seu roteador
        // navigate.push("/resumo");
        console.log("Navegar para /resumo");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <Header steps={steps} currentStep={formularioState.step} />

                    <div className="min-h-96 relative">
                        {/* Loading Overlay */}
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <span className="text-gray-700 font-medium">Enviando dados...</span>
                                </div>
                            </div>
                        )}

                        {/* Conteúdo do passo atual */}
                        {getStepContent(formularioState.step)}
                    </div>

                    <Footer
                        currentStep={formularioState.step}
                        validateForm={validateCurrentForm}
                        onClickNext={handleClickNext}
                        onFinalize={async () => {
                            if (formularioState.step === 2) {
                                return await dadosBancariosRef.current?.onSubmitDadosBancarios();
                            }
                            return await validateCurrentForm();
                        }}
                    />
                </div>
            </div>

            {/* Modal de Sucesso */}
            <Modal open={modalOpen} onClose={handleCloseModal} title="Cadastro Concluído">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <h4 className="font-medium text-gray-900">Cadastro realizado com sucesso!</h4>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        A conta foi cadastrada com sucesso. Fique atento para os recebimentos de bonificações. Os pagamentos começarão a ser efetuados através desta conta a partir
                        de 01/07/2025.
                    </p>
                </div>
            </Modal>

            {/* Snackbar de Sucesso */}
            <Snackbar open={submitSuccess && !modalOpen} message="Dados enviados com sucesso!" type="success" onClose={handleCloseSnackbar} />

            {/* Snackbar de Erro */}
            <Snackbar open={!!submitError} message={submitError || "Erro ao enviar dados"} type="error" onClose={handleCloseSnackbar} />
        </div>
    );
};
