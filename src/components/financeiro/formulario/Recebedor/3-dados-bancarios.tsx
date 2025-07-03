import React, {useImperativeHandle, forwardRef, useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z4 from "zod/v4";
import {Loader2, ChevronDown} from "lucide-react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
import utils from "onda-utils";

const PUBLIC_BASE_URL_WORKER_FINANCEIRO = process.env.PUBLIC_BASE_URL_WORKER_FINANCEIRO;

const schema = z4.object({
    conta_bancaria: z4.object({
        nome_titular: z4.string().min(1, "Nome do titular é obrigatório"),
        documento_titular: z4.string().optional(),
        banco: z4.string().min(1, "Banco é obrigatório"),
        tipo_titular: z4.union([z4.literal("individual"), z4.literal("empresa")], "Tipo de titular é obrigatório"),
        numero_agencia: z4.string().min(1, "Agência é obrigatória").max(4, "Agência deve ter no máximo 4 dígitos"),
        digito_agencia: z4
            .string()
            .transform((valor) => (valor === "" ? null : valor))
            .nullable()
            .optional(),
        numero_conta: z4.string().min(1, "Número da conta é obrigatório").max(13, "Número da conta deve ter no máximo 13 dígitos"),
        digito_conta: z4.string().min(1, "Dígito da conta é obrigatório"),
        tipo: z4.string().min(1, "Tipo de conta é obrigatório"),
    }),
    configuracoes_transferencia: z4.object({
        transferencia_habilitada: z4.boolean(),
        intervalo_transferencia: z4.union([z4.literal("Diaria"), z4.literal("Semanal"), z4.literal("Mensal")]),
        dia_transferencia: z4.number().int(),
    }),
    configuracoes_antecipacao: z4.object({
        habilitado: z4.boolean(),
        tipo: z4.union([z4.literal("completa"), z4.literal("parcial")]),
        percentual_volume: z4.string(),
        atraso: z4.number().nullable(),
    }),
});

type FormData = z4.infer<typeof schema>;

interface Banco {
    codigo: string;
    nome: string;
}

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
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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
    onSubmitDadosBancarios: () => Promise<void>;
    validateForm: () => Promise<boolean>;
}

const DadosBancarios = forwardRef<DadosBancariosRef, DadosBancariosProps>(({setSubmitSuccess, setSubmitError, setLoading}, ref) => {
    const [banks, setBanks] = useState<Banco[]>([]);
    const [isLoadingBanks, setIsLoadingBanks] = useState(false);
    const formularioState = controller_recebedor.contexto.jsx.get_formulario();
    const recebedorData = formularioState.dados_recebedor_new?.data?.recebedor;

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
                nome_titular: (recebedorData?.tipo === "individual" ? recebedorData.nome : recebedorData?.razao_social) || "",
                tipo_titular: recebedorData?.tipo,
                documento_titular: recebedorData?.documento,
                banco: "",
                numero_agencia: "",
                digito_agencia: "",
                numero_conta: "",
                digito_conta: "",
                tipo: "",
            },
            configuracoes_transferencia: {
                transferencia_habilitada: false,
                intervalo_transferencia: "Mensal",
                dia_transferencia: 10,
            },
            configuracoes_antecipacao: {
                atraso: 10,
                habilitado: false,
                percentual_volume: "100",
                tipo: "completa",
            },
        },
    });

    useEffect(() => {
        if (recebedorData) {
            const nomeTitular = (recebedorData.tipo === "individual" ? recebedorData.nome : recebedorData.razao_social) || "";
            const documentoTitular = recebedorData.documento?.replace(/\D/g, "") || "";

            setValue("conta_bancaria.nome_titular", nomeTitular, {shouldValidate: true});
            setValue("conta_bancaria.documento_titular", documentoTitular, {shouldValidate: true});
        }
    }, [recebedorData, setValue]);
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

    const onSubmit = async (data: FormData) => {
        controller_recebedor.contexto.state.set_state((currentStates) => {
            const existingRecebedor = currentStates.formulario.dados_recebedor_new.data?.recebedor || {};

            const finalRecebedorData = {
                ...existingRecebedor,
                conta_bancaria: {
                    ...data.conta_bancaria,
                    documento_titular: data.conta_bancaria.documento_titular?.replace(/\D/g, ""),
                },
                configuracoes_transferencia: data.configuracoes_transferencia,
                configuracoes_antecipacao: data.configuracoes_antecipacao,
            };
            if (currentStates.formulario.dados_recebedor_new.data) {
                currentStates.formulario.dados_recebedor_new.data.recebedor = finalRecebedorData as any;
            }
        });
    };

    useImperativeHandle(ref, () => ({
        onSubmitDadosBancarios: async () => {
            const isValid = await trigger();
            if (isValid) {
                return await handleSubmit(onSubmit)();
            }
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
                        <Controller
                            name="conta_bancaria.documento_titular"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento do Titular*</label>
                                    <input
                                        {...field}
                                        color="default"
                                        type="text"
                                        disabled
                                        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
                                            errors.conta_bancaria?.documento_titular ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Será preenchido automaticamente"
                                    />
                                    {errors.conta_bancaria?.documento_titular && <p className="mt-1 text-sm text-red-600">{errors.conta_bancaria.documento_titular.message}</p>}
                                    {!errors.conta_bancaria?.documento_titular && <p className="mt-1 text-sm text-gray-500">Mesmo documento do recebedor</p>}
                                </div>
                            )}
                        />
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
                                        value={field.value ?? undefined}
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
