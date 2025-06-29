import React, {useImperativeHandle, forwardRef, useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z4 from "zod/v4";
import {Loader2, ChevronDown} from "lucide-react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";

// Schema Zod para validação
const schema = z4.object({
    conta_bancaria: z4.object({
        nome_titular: z4.string().min(1, "Nome do titular é obrigatório"),
        documento_titular: z4.string().min(1, "Documento do titular é obrigatório"),
        banco: z4.string().min(1, "Banco é obrigatório"),
        tipo_titular: z4.union([z4.literal("individual"), z4.literal("empresa")], "Tipo de titular é obrigatório"),
        numero_agencia: z4.string().min(1, "Agência é obrigatória").max(4, "Agência deve ter no máximo 4 dígitos"),
        digito_agencia: z4.string().optional(),
        numero_conta: z4.string().min(1, "Número da conta é obrigatório").max(13, "Número da conta deve ter no máximo 13 dígitos"),
        digito_conta: z4.string().min(1, "Dígito da conta é obrigatório"),
        tipo: z4.string().min(1, "Tipo de conta é obrigatório"),
    }),
});

type FormData = z4.infer<typeof schema>;

interface Banco {
    codigo: string;
    nome: string;
}

// Componente Select customizado para bancos
interface BankSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    banks: Banco[];
    loading: boolean;
    error?: string;
    onOpen: () => void;
}

const BankSelect: React.FC<BankSelectProps> = ({label, value, onChange, banks, loading, error, onOpen}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedBank = banks.find((bank) => bank.codigo === value);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    color="default"
                    onClick={() => {
                        if (!isOpen && banks.length === 0 && !loading) {
                            onOpen();
                        }
                        setIsOpen(!isOpen);
                    }}
                    className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? "border-red-500" : "border-gray-300"
                    } bg-white`}
                >
                    <span className={selectedBank ? "text-gray-900" : "text-gray-500"}>
                        {selectedBank ? `${selectedBank.codigo} - ${selectedBank.nome}` : "Selecione um banco"}
                    </span>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />}
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </button>
                {isOpen && !loading && banks.length > 0 && (
                    <div className="absolute z4-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div
                            onClick={() => {
                                onChange("");
                                setIsOpen(false);
                            }}
                            className="px-3 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                            Selecione um banco
                        </div>
                        {banks.map((bank) => (
                            <div
                                key={bank.codigo}
                                onClick={() => {
                                    onChange(bank.codigo);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                            >
                                {bank.codigo} - {bank.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {loading && <p className="mt-1 text-sm text-gray-500">Carregando bancos...</p>}
            {!loading && banks.length === 0 && <p className="mt-1 text-sm text-gray-500">Nenhum banco disponível</p>}
        </div>
    );
};

interface DadosBancariosProps {
    setSubmitSuccess: (success: boolean) => void;
    setSubmitError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
}

interface DadosBancariosRef {
    onSubmitDadosBancarios: () => Promise<boolean>;
    validateForm: () => Promise<boolean>;
}

const DadosBancarios = forwardRef<DadosBancariosRef, DadosBancariosProps>(({setSubmitSuccess, setSubmitError, setLoading}, ref) => {
    // Estados locais
    const [banks, setBanks] = useState<Banco[]>([]);
    const [isLoadingBanks, setIsLoadingBanks] = useState(false);

    // Obter dados do formulário do controller
    const formularioState = controller_recebedor.contexto.jsx.get_formulario();

    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        trigger,
        clearErrors,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            conta_bancaria: {
                nome_titular: "", // Será preenchido dinamicamente
                tipo_titular: formularioState.tipo === "individual" ? "individual" : "empresa",
                documento_titular: "", // Será preenchido dinamicamente
                banco: "",
                numero_agencia: "",
                digito_agencia: "",
                numero_conta: "",
                digito_conta: "",
                tipo: "",
            },
        },
    });

    const bankValue = watch("conta_bancaria.banco");

    const buscaBanco = async () => {
        if (banks.length > 0) return;

        try {
            setIsLoadingBanks(true);
            const response = await fetch("https://brasilapi.com.br/api/banks/v1");
            if (!response.ok) throw new Error("Erro ao buscar bancos");
            const data = await response.json();

            const formattedBanks: Banco[] = data
                .filter((bank: any) => bank.code && bank.name)
                .map((bank: any) => ({
                    codigo: bank.code.toString().padStart(3, "0"),
                    nome: bank.name,
                }));

            setBanks(formattedBanks);
        } catch (error) {
            console.error("Erro ao buscar bancos:", error);
        } finally {
            setIsLoadingBanks(false);
        }
    };

    useEffect(() => {
        buscaBanco();
    }, []);

    useEffect(() => {
        const selectedBank = banks.find((bank) => bank.codigo === bankValue) || null;
        if (selectedBank && bankValue) {
            setValue("conta_bancaria.banco", selectedBank.codigo, {shouldValidate: false});
        }
    }, [banks, bankValue, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            // Simular chamada à API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Aqui você faria a chamada real para a API
            // const response = await controller_recebedor.api.criar({
            //   data: {
            //     recebedor: { ...formularioState, ...data }
            //   }
            // });

            setSubmitSuccess(true);
            return true;
        } catch (error: any) {
            console.error("Erro ao enviar dados:", error);
            setSubmitError(error.message || "Erro ao enviar os dados");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        onSubmitDadosBancarios: async () => {
            const isValid = await trigger();
            if (isValid) {
                return await handleSubmit(onSubmit)();
            }
            return false;
        },
        validateForm: async () => {
            return await trigger();
        },
    }));

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Dados Bancários</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Controller
                            name="conta_bancaria.nome_titular"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Titular*</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        disabled
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 ${
                                            errors.conta_bancaria?.nome_titular ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Será preenchido automaticamente"
                                    />
                                    {errors.conta_bancaria?.nome_titular && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.nome_titular.message}</p>}
                                    {!errors.conta_bancaria?.nome_titular && <p className="mt-1 text-sm text-gray-500">Deve corresponder ao nome associado ao CPF/CNPJ</p>}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documento do Titular*</label>
                        <input
                            type="text"
                            disabled
                            className="w-full px-3 py-2 border rounded-md bg-gray-100 border-gray-300"
                            placeholder="Mesmo documento do recebedor"
                            color="default"
                        />
                        <p className="mt-1 text-sm text-gray-500">Mesmo documento do recebedor</p>
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.banco"
                            control={control}
                            render={({field: {value, onChange}}) => (
                                <BankSelect
                                    label="Banco*"
                                    value={value}
                                    onChange={(newValue) => {
                                        onChange(newValue);
                                        clearErrors("conta_bancaria.banco");
                                    }}
                                    banks={banks}
                                    loading={isLoadingBanks}
                                    error={errors.conta_bancaria?.banco?.message}
                                    onOpen={buscaBanco}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.tipo"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta*</label>
                                    <select
                                        {...field}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.conta_bancaria?.tipo ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="corrente">Conta Corrente</option>
                                        <option value="poupanca">Conta Poupança</option>
                                    </select>
                                    {errors.conta_bancaria?.tipo && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.tipo.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.numero_agencia"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agência*</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        maxLength={4}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.conta_bancaria?.numero_agencia ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.conta_bancaria?.numero_agencia && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.numero_agencia.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.digito_agencia"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dígito da Agência</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        maxLength={1}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.conta_bancaria?.digito_agencia ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.conta_bancaria?.digito_agencia && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.digito_agencia.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.numero_conta"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número da Conta*</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        maxLength={13}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.conta_bancaria?.numero_conta ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.conta_bancaria?.numero_conta && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.numero_conta.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="conta_bancaria.digito_conta"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dígito da Conta*</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        maxLength={1}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.conta_bancaria?.digito_conta ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.conta_bancaria?.digito_conta && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.digito_conta.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

DadosBancarios.displayName = "DadosBancarios";

export default DadosBancarios;
