import React, {useImperativeHandle, forwardRef, useEffect, useState} from "react";
import {useForm, Controller, FieldErrors, SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z4 from "zod/v4";
import {Loader2, ChevronDown} from "lucide-react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
import t from "onda-types";
import {buscaCpf} from "./1-tipo-cadastro";

const estadosBrasileiros = [
    {sigla: "AC", nome: "Acre"},
    {sigla: "AL", nome: "Alagoas"},
    {sigla: "AP", nome: "Amapá"},
    {sigla: "AM", nome: "Amazonas"},
    {sigla: "BA", nome: "Bahia"},
    {sigla: "CE", nome: "Ceará"},
    {sigla: "DF", nome: "Distrito Federal"},
    {sigla: "ES", nome: "Espírito Santo"},
    {sigla: "GO", nome: "Goiás"},
    {sigla: "MA", nome: "Maranhão"},
    {sigla: "MT", nome: "Mato Grosso"},
    {sigla: "MS", nome: "Mato Grosso do Sul"},
    {sigla: "MG", nome: "Minas Gerais"},
    {sigla: "PA", nome: "Pará"},
    {sigla: "PB", nome: "Paraíba"},
    {sigla: "PR", nome: "Paraná"},
    {sigla: "PE", nome: "Pernambuco"},
    {sigla: "PI", nome: "Piauí"},
    {sigla: "RJ", nome: "Rio de Janeiro"},
    {sigla: "RN", nome: "Rio Grande do Norte"},
    {sigla: "RS", nome: "Rio Grande do Sul"},
    {sigla: "RO", nome: "Rondônia"},
    {sigla: "RR", nome: "Roraima"},
    {sigla: "SC", nome: "Santa Catarina"},
    {sigla: "SP", nome: "São Paulo"},
    {sigla: "SE", nome: "Sergipe"},
    {sigla: "TO", nome: "Tocantins"},
];

const tiposEmpresa = [
    {valor: "mei", nome: "MEI"},
    {valor: "ei", nome: "Empresário (Individual)"},
    {valor: "eireli", nome: "EIRELI"},
    {valor: "ltda", nome: "Sociedade Limitada"},
    {valor: "sa", nome: "Sociedade Anônima"},
    {valor: "other", nome: "Outros"},
];

function formatCPF(value: string): string {
    const cpf = value.replace(/\D/g, "").slice(0, 11);
    return cpf.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/, (match: string, p1: string, p2: string, p3: string, p4: string) => {
        let result = p1;
        if (p2) result += "." + p2;
        if (p3) result += "." + p3;
        if (p4) result += "-" + p4;
        return result;
    });
}

function formatCEP(value: string): string {
    const cep = value.replace(/\D/g, "").slice(0, 8);
    return cep.replace(/^(\d{0,5})(\d{0,3})$/, (match: string, p1: string, p2: string) => (p2 ? `${p1}-${p2}` : p1));
}

function formatReais(value: string | number): string {
    const stringValue = String(value || "");
    const num = stringValue.replace(/\D/g, "");
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(Number(num) / 100);
}

function formatPhoneNumber(value: string, isMobile: boolean = false): string {
    const digits = value.replace(/\D/g, "");
    const maxLength = isMobile ? 9 : 8;
    const sliced = digits.slice(0, maxLength);
    const pattern = isMobile ? /^(\d{0,5})(\d{0,4})$/ : /^(\d{0,4})(\d{0,4})$/;
    return sliced.replace(pattern, (match: string, p1: string, p2: string) => (p2 ? `${p1}-${p2}` : p1));
}

const addressSchema = z4.object({
    rua: z4.string().min(1, "Logradouro é obrigatório"),
    numero_rua: z4.string().min(1, "Número é obrigatório"),
    complemento: z4.string().min(1, "Complemento é obrigatório"),
    bairro: z4.string().min(1, "Bairro é obrigatório"),
    cidade: z4.string().min(1, "Cidade é obrigatória"),
    estado: z4.string().min(1, "Estado é obrigatório"),
    cep: z4.string().min(8, "CEP deve ter 8 dígitos").max(8, "CEP deve ter 8 dígitos"),
    ponto_referencia: z4.string().min(1, "Ponto de referência é obrigatório"),
});

const telefoneSchema = z4.object({
    ddd: z4.string().min(2, "DDD é obrigatório").max(2, "DDD deve ter 2 dígitos"),
    numero: z4.string().min(8, "Número é obrigatório"),
    tipo: z4.string().optional(),
});

const individualSchema = z4.object({
    tipo: z4.literal("individual"),
    nome: z4.string().min(1, "Nome é obrigatório"),
    nome_mae: z4.string().optional(),
    data_nascimento: z4.string().min(1, "Data de nascimento é obrigatória"),
    renda_mensal: z4.number().min(1, "Valor deve ser maior que R$ 1,00"),
    ocupacao_profissional: z4.string().min(1, "Ocupação profissional é obrigatória"),
    telefones: z4.array(telefoneSchema).min(1, "Telefone é obrigatório"),
    endereco: addressSchema,
});

const socioSchema = z4.object({
    tipo: z4.literal("individual"),
    nome: z4.string().min(1, "Nome do representante é obrigatório"),
    documento: z4.string().min(11, "CPF deve ter 11 dígitos").max(11, "CPF deve ter 11 dígitos"),
    email: z4.string().email("Email inválido").min(1, "Email é obrigatório"),
    telefones: z4.array(telefoneSchema).min(1, "Telefone móvel é obrigatório"),
    data_nascimento: z4.string().min(1, "Data de nascimento é obrigatória"),
    nome_mae: z4.string().optional(),
    renda_mensal: z4.number().min(1, "Valor deve ser maior que R$ 1,00"),
    ocupacao_profissional: z4.string().min(1, "Ocupação profissional é obrigatória"),
    representante_legal_autodeclarado: z4.boolean({error: "Campo obrigatório"}),
    endereco: addressSchema,
});

const empresaSchema = z4.object({
    tipo: z4.literal("empresa"),
    razao_social: z4.string().min(1, "Razão social é obrigatória"),
    nome_fantasia: z4.string().min(1, "Nome fantasia é obrigatório"),
    faturamento_anual: z4.number().min(1, "Valor deve ser maior que R$ 1,00"),
    tipo_empresa: z4.string().optional(),
    data_fundacao: z4.string().min(1, "Data de fundação é obrigatória"),
    telefones: z4.array(telefoneSchema).min(1, "Telefone fixo da empresa é obrigatório"),
    endereco_principal: addressSchema,
    socios_administradores: z4.array(socioSchema).min(1, "Representante legal é obrigatório"),
});

type IndividualFormData = z4.infer<typeof individualSchema>;
type EmpresaFormData = z4.infer<typeof empresaSchema>;

const createSchema = (type: string) => {
    if (type === "individual") {
        return individualSchema;
    }
    return empresaSchema;
};

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{valor?: string; sigla?: string; nome: string}>;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({label, value, onChange, options, error, disabled, placeholder = "Selecione"}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    color="default"
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${
                        disabled ? "bg-gray-100 text-gray-500" : "bg-white"
                    }`}
                >
                    <span className={value ? "text-gray-900" : "text-gray-500"}>
                        {value ? options.find((opt) => (opt.valor || opt.sigla) === value)?.nome || value : placeholder}
                    </span>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </button>
                {isOpen && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div
                            onClick={() => {
                                onChange("");
                                setIsOpen(false);
                            }}
                            className="px-3 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                            {placeholder}
                        </div>
                        {options.map((option) => (
                            <div
                                key={option.valor || option.sigla}
                                onClick={() => {
                                    onChange(option.valor || option.sigla || "");
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                            >
                                {option.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

interface AutocompleteProps {
    label: string;
    value: boolean | null;
    onChange: (value: boolean | null) => void;
    error?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({label, value, onChange, error}) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = [
        {label: "Sim", value: true},
        {label: "Não", value: false},
    ];

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    color="default"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? "border-red-500" : "border-gray-300"
                    } bg-white`}
                >
                    <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>{selectedOption?.label || "Selecione"}</span>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {options.map((option) => (
                            <div
                                key={option.label}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

interface DadosPessoaisProps {}

interface DadosPessoaisRef {
    validateForm: () => Promise<boolean>;
    onSubmitDadosPessoais: () => void;
}

const DadosPessoais = forwardRef<DadosPessoaisRef, DadosPessoaisProps>((props, ref) => {
    const formularioState = controller_recebedor.contexto.jsx.get_formulario();
    const recebedorTipo = formularioState.tipo;
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [isLoadingPartnerCep, setIsLoadingPartnerCep] = useState(false);
    const [isLoadingCpf, setIsLoadingCpf] = useState(false);
    const [isAddressEditable, setIsAddressEditable] = useState(true);
    const [isPartnerAddressEditable, setIsPartnerAddressEditable] = useState(true);

    const schema = createSchema(recebedorTipo);
    type FormData = IndividualFormData | EmpresaFormData;

    const {
        control,
        handleSubmit,
        formState: {errors},
        trigger,
        setValue,
        getValues,
        clearErrors,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues:
            recebedorTipo === "individual"
                ? ({
                      tipo: "individual",
                      nome: formularioState?.dados_recebedor?.nome || "",
                      nome_mae: "",
                      data_nascimento: "",
                      renda_mensal: 0,
                      ocupacao_profissional: "",
                      telefones: [{ddd: "", numero: "", tipo: ""}],
                      endereco: {
                          rua: "",
                          numero_rua: "",
                          complemento: "",
                          bairro: "",
                          cidade: "",
                          estado: "",
                          cep: "",
                          ponto_referencia: "",
                      },
                  } as any)
                : ({
                      tipo: "empresa",
                      razao_social: formularioState?.dados_recebedor?.razao_social || "",
                      nome_fantasia: formularioState?.dados_recebedor?.nome_fantasia || "",
                      faturamento_anual: 0,
                      tipo_empresa: "",
                      data_fundacao: formularioState?.dados_recebedor?.data_fundacao || "",
                      telefones: [{ddd: "", numero: "", tipo: ""}],
                      endereco_principal: {
                          rua: "",
                          numero_rua: "",
                          complemento: "",
                          bairro: "",
                          cidade: "",
                          estado: "",
                          cep: "",
                          ponto_referencia: "",
                      },
                      socios_administradores: [
                          {
                              nome: "",
                              email: "",
                              documento: "",
                              nome_mae: "",
                              ocupacao_profissional: "",
                              representante_legal_autodeclarado: null,
                              renda_mensal: 0,
                              telefones: [{ddd: "", numero: "", tipo: ""}],
                              endereco: {
                                  rua: "",
                                  numero_rua: "",
                                  complemento: "",
                                  bairro: "",
                                  cidade: "",
                                  estado: "",
                                  cep: "",
                                  ponto_referencia: "",
                              },
                          },
                      ],
                  } as any),
    });

    const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const cep = event.target.value.replace(/\D/g, "");
        onChange(cep);
        if (cep.length !== 8) {
            setIsLoadingCep(false);
            return;
        }

        setIsLoadingCep(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const data = await response.json();

            const addressField = recebedorTipo === "individual" ? "endereco" : "endereco_principal";
            const currentAddress = getValues(addressField as any) || {};
            const address = {
                ...currentAddress,
                cep: data.cep || "",
                rua: data.street || "",
                bairro: data.neighborhood || "",
                cidade: data.city || "",
                estado: data.state || "",
                ponto_referencia: currentAddress.ponto_referencia || "",
            };

            setValue(addressField as any, address, {shouldValidate: false});
            setIsAddressEditable(!data.street || !data.neighborhood);
            clearErrors();
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setIsAddressEditable(true);
        } finally {
            setIsLoadingCep(false);
        }
    };

    const handlePartnerCepChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const cep = event.target.value.replace(/\D/g, "");
        onChange(cep);
        if (cep.length !== 8) {
            setIsLoadingPartnerCep(false);
            return;
        }

        setIsLoadingPartnerCep(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const data = await response.json();

            const currentPartner = getValues("socios_administradores.0" as any) || {};
            const currentPartnerAddress = currentPartner.endereco || {};
            const address = {
                ...currentPartnerAddress,
                cep: data.cep || "",
                rua: data.street || "",
                bairro: data.neighborhood || "",
                cidade: data.city || "",
                estado: data.state || "",
                ponto_referencia: currentPartnerAddress.ponto_referencia || "",
            };

            setValue("socios_administradores.0.endereco" as any, address, {shouldValidate: false});
            setIsPartnerAddressEditable(!data.street || !data.neighborhood);
            clearErrors();
        } catch (error) {
            console.error("Erro ao buscar CEP do representante:", error);
            setIsPartnerAddressEditable(true);
        } finally {
            setIsLoadingPartnerCep(false);
        }
    };

    const handleCpfChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const rawValue = event.target.value.replace(/\D/g, "");
        onChange(rawValue);
        if (rawValue.length !== 11 || isLoadingCpf) return;

        setIsLoadingCpf(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await buscaCpf(rawValue, setValue as any);
        } catch (error) {
            console.error("Erro ao buscar CPF:", error);
        } finally {
            setIsLoadingCpf(false);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        let setDadosRecebedor: {
            data?: {
                // Aqui está a mágica: aplicamos Partial ao tipo do recebedor
                recebedor?: Partial<t.Financeiro.Controllers.Recebedor.Criar.Input["data"]["recebedor"]>;
            };
        } = {};

        if (data.tipo === "individual") {
            // TypeScript agora sabe que 'data' é IndividualFormData
            setDadosRecebedor = {
                data: {
                    recebedor: {
                        tipo: "individual",
                        nome: data.nome,
                        nome_mae: data.nome_mae,
                        data_nascimento: data.data_nascimento,
                        renda_mensal: data.renda_mensal,
                        ocupacao_profissional: data.ocupacao_profissional,
                        telefones: data.telefones,
                        endereco: data.endereco,
                    },
                },
            };
        } else if (data.tipo === "empresa") {
            setDadosRecebedor = {
                data: {
                    recebedor: {
                        tipo: "empresa",
                        razao_social: data.razao_social,
                        nome_fantasia: data.nome_fantasia,
                        data_fundacao: data.data_fundacao,
                        faturamento_anual: data.faturamento_anual,
                        tipo_empresa: data.tipo_empresa,
                        telefones: data.telefones,
                        endereco_principal: data.endereco_principal,
                        socios_administradores: data.socios_administradores,
                    },
                },
            };
        }
        controller_recebedor.contexto.state.set_state((currentStates) => {
            console.log(setDadosRecebedor, "setDadosRecebedor");

            currentStates.formulario.dados_recebedor_new = setDadosRecebedor as t.Financeiro.Controllers.Recebedor.Criar.Input;
        });

        const isValid = await trigger();
        if (isValid) {
            controller_recebedor.contexto.state.set_steep_progress(2);
        }
    };

    useImperativeHandle(ref, () => ({
        validateForm: () => trigger(),
        onSubmitDadosPessoais: () => handleSubmit(onSubmit)(),
    }));

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">
                        Dados {recebedorTipo === "individual" ? "Pessoais - Pessoa Física" : "Empresariais - Pessoa Jurídica"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recebedorTipo === "individual" ? (
                        <>
                            <div>
                                <Controller
                                    name="nome"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).nome ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).nome && <p className="mt-1 text-sm text-red-600">{(errors as any).nome?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="nome_mae"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).nome_mae ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).nome_mae && <p className="mt-1 text-sm text-red-600">{(errors as any).nome_mae?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="data_nascimento"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento*</label>
                                            <input
                                                {...field}
                                                type="date"
                                                color="default"
                                                min="1900-01-01"
                                                max={new Date().toISOString().split("T")[0]}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).data_nascimento ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).data_nascimento && <p className="mt-1 text-sm text-red-600">{(errors as any).data_nascimento?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="ocupacao_profissional"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ocupação Profissional*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).ocupacao_profissional ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).ocupacao_profissional && <p className="mt-1 text-sm text-red-600">{(errors as any).ocupacao_profissional?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Controller
                                    name="renda_mensal"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Renda Mensal (R$)*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatReais(value || 0)}
                                                onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).renda_mensal ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).renda_mensal && <p className="mt-1 text-sm text-red-600">{(errors as any).renda_mensal?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="telefones.0.ddd"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">DDD*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={value || ""}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 2))}
                                                maxLength={2}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.telefones?.[0]?.ddd ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.telefones?.[0]?.ddd && <p className="mt-1 text-sm text-red-600">{errors.telefones[0].ddd?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="telefones.0.numero"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Telefone*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatPhoneNumber(value || "", true)}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
                                                maxLength={10}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.telefones?.[0]?.numero ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.telefones?.[0]?.numero && <p className="mt-1 text-sm text-red-600">{errors.telefones[0].numero?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Controller
                                    name="nome_fantasia"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).nome_fantasia ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).nome_fantasia && <p className="mt-1 text-sm text-red-600">{(errors as any).nome_fantasia?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="razao_social"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).razao_social ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).razao_social && <p className="mt-1 text-sm text-red-600">{(errors as any).razao_social?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="tipo_empresa"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <Select
                                            label="Tipo da Empresa"
                                            value={value || ""}
                                            onChange={onChange}
                                            options={tiposEmpresa}
                                            error={(errors as any).tipo_empresa?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="data_fundacao"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fundação*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="date"
                                                max={new Date().toISOString().split("T")[0]}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).data_fundacao ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).data_fundacao && <p className="mt-1 text-sm text-red-600">{(errors as any).data_fundacao?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="faturamento_anual"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Receita Anual (R$)*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatReais(value || 0)}
                                                onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).faturamento_anual ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).faturamento_anual && <p className="mt-1 text-sm text-red-600">{(errors as any).faturamento_anual?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="telefones.0.ddd"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">DDD*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={value || ""}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 2))}
                                                maxLength={2}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.telefones?.[0]?.ddd ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.telefones?.[0]?.ddd && <p className="mt-1 text-sm text-red-600">{errors.telefones[0].ddd?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="telefones.0.numero"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone fixo da Empresa*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatPhoneNumber(value || "", false)}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                                maxLength={9}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.telefones?.[0]?.numero ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.telefones?.[0]?.numero && <p className="mt-1 text-sm text-red-600">{errors.telefones[0].numero?.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t pt-6">
                    {recebedorTipo === "individual" ? (
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                    ) : (
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço Principal</h3>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4"></h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.cep" : "endereco_principal.cep"}
                                control={control}
                                render={({field: {onChange, value}}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatCEP(value || "")}
                                                onChange={(e) => handleCepChange(e, onChange)}
                                                disabled={isLoadingCep}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).endereco?.cep || (errors as any).endereco_principal?.cep ? "border-red-500" : "border-gray-300"
                                                } ${isLoadingCep ? "bg-gray-100" : ""}`}
                                            />
                                            {isLoadingCep && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        {((errors as any).endereco?.cep || (errors as any).endereco_principal?.cep) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.cep?.message || (errors as any).endereco_principal?.cep?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.rua" : "endereco_principal.rua"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro*</label>
                                        <input
                                            {...field}
                                            color="default"
                                            type="text"
                                            disabled={isLoadingCep || !isAddressEditable}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.rua || (errors as any).endereco_principal?.rua ? "border-red-500" : "border-gray-300"
                                            } ${isLoadingCep || !isAddressEditable ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.rua || (errors as any).endereco_principal?.rua) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.rua?.message || (errors as any).endereco_principal?.rua?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.bairro" : "endereco_principal.bairro"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro*</label>
                                        <input
                                            {...field}
                                            color="default"
                                            type="text"
                                            disabled={isLoadingCep || !isAddressEditable}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.bairro || (errors as any).endereco_principal?.bairro ? "border-red-500" : "border-gray-300"
                                            } ${isLoadingCep || !isAddressEditable ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.bairro || (errors as any).endereco_principal?.bairro) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.bairro?.message || (errors as any).endereco_principal?.bairro?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.cidade" : "endereco_principal.cidade"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade*</label>
                                        <input
                                            {...field}
                                            color="default"
                                            type="text"
                                            disabled={isLoadingCep || !isAddressEditable}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.cidade || (errors as any).endereco_principal?.cidade ? "border-red-500" : "border-gray-300"
                                            } ${isLoadingCep || !isAddressEditable ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.cidade || (errors as any).endereco_principal?.cidade) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.cidade?.message || (errors as any).endereco_principal?.cidade?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.estado" : "endereco_principal.estado"}
                                control={control}
                                render={({field: {onChange, value}}) => (
                                    <Select
                                        label="Estado*"
                                        value={value || ""}
                                        onChange={onChange}
                                        options={estadosBrasileiros}
                                        disabled={isLoadingCep || !isAddressEditable}
                                        error={(errors as any).endereco?.estado?.message || (errors as any).endereco_principal?.estado?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.numero_rua" : "endereco_principal.numero_rua"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número*</label>
                                        <input
                                            {...field}
                                            type="text"
                                            color="default"
                                            disabled={isLoadingCep}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.numero_rua || (errors as any).endereco_principal?.numero_rua ? "border-red-500" : "border-gray-300"
                                            } ${isLoadingCep ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.numero_rua || (errors as any).endereco_principal?.numero_rua) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.numero_rua?.message || (errors as any).endereco_principal?.numero_rua?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.complemento" : "endereco_principal.complemento"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Complemento*</label>
                                        <input
                                            {...field}
                                            type="text"
                                            color="default"
                                            disabled={isLoadingCep}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.complemento || (errors as any).endereco_principal?.complemento ? "border-red-500" : "border-gray-300"
                                            } ${isLoadingCep ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.complemento || (errors as any).endereco_principal?.complemento) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.complemento?.message || (errors as any).endereco_principal?.complemento?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Controller
                                name={recebedorTipo === "individual" ? "endereco.ponto_referencia" : "endereco_principal.ponto_referencia"}
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ponto de referência*</label>
                                        <input
                                            {...field}
                                            color="default"
                                            type="text"
                                            disabled={isLoadingCep}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                (errors as any).endereco?.ponto_referencia || (errors as any).endereco_principal?.ponto_referencia
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } ${isLoadingCep ? "bg-gray-100" : ""}`}
                                        />
                                        {((errors as any).endereco?.ponto_referencia || (errors as any).endereco_principal?.ponto_referencia) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {(errors as any).endereco?.ponto_referencia?.message || (errors as any).endereco_principal?.ponto_referencia?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {recebedorTipo === "empresa" && (
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Representante Legal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Controller
                                    name="socios_administradores.0.documento"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF*</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    color="default"
                                                    value={formatCPF(value || "")}
                                                    onChange={(e) => handleCpfChange(e, onChange)}
                                                    disabled={isLoadingCpf}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.documento ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingCpf ? "bg-gray-100" : ""}`}
                                                />
                                                {isLoadingCpf && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                    </div>
                                                )}
                                            </div>
                                            {(errors as any).socios_administradores?.[0]?.documento && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].documento?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.nome"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.nome ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.nome && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].nome?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.nome_mae"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.nome_mae ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.nome_mae && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].nome_mae?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.data_nascimento"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="date"
                                                min="1900-01-01"
                                                max={new Date().toISOString().split("T")[0]}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.data_nascimento ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.data_nascimento && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].data_nascimento?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.ocupacao_profissional"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ocupação Profissional*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.ocupacao_profissional ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.ocupacao_profissional && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].ocupacao_profissional?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.renda_mensal"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Renda Mensal (R$)*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatReais(value || 0)}
                                                onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.renda_mensal ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.renda_mensal && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].renda_mensal?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.email"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="email"
                                                disabled={isLoadingCpf}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.email ? "border-red-500" : "border-gray-300"
                                                } ${isLoadingCpf ? "bg-gray-100" : ""}`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.email && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].email?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.telefones.0.ddd"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">DDD*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={value || ""}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 2))}
                                                disabled={isLoadingCpf}
                                                maxLength={2}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.telefones?.[0]?.ddd ? "border-red-500" : "border-gray-300"
                                                } ${isLoadingCpf ? "bg-gray-100" : ""}`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.telefones?.[0]?.ddd && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].telefones[0].ddd?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.telefones.0.numero"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone móvel do Representante*</label>
                                            <input
                                                type="text"
                                                color="default"
                                                value={formatPhoneNumber(value || "", true)}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
                                                disabled={isLoadingCpf}
                                                maxLength={10}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    (errors as any).socios_administradores?.[0]?.telefones?.[0]?.numero ? "border-red-500" : "border-gray-300"
                                                } ${isLoadingCpf ? "bg-gray-100" : ""}`}
                                            />
                                            {(errors as any).socios_administradores?.[0]?.telefones?.[0]?.numero && (
                                                <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].telefones[0].numero?.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="socios_administradores.0.representante_legal_autodeclarado"
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <Autocomplete
                                            label="Sou representante legal deste CNPJ*"
                                            value={value}
                                            onChange={onChange}
                                            error={(errors as any).socios_administradores?.[0]?.representante_legal_autodeclarado?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="text-md font-semibold text-gray-900 mb-4">Endereço do Representante Legal</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Controller
                                        name="socios_administradores.0.endereco.cep"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP*</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        color="default"
                                                        value={formatCEP(value || "")}
                                                        onChange={(e) => handlePartnerCepChange(e, onChange)}
                                                        disabled={isLoadingPartnerCep}
                                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                            (errors as any).socios_administradores?.[0]?.endereco?.cep ? "border-red-500" : "border-gray-300"
                                                        } ${isLoadingPartnerCep ? "bg-gray-100" : ""}`}
                                                    />
                                                    {isLoadingPartnerCep && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                {(errors as any).socios_administradores?.[0]?.endereco?.cep && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.cep?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Controller
                                        name="socios_administradores.0.endereco.rua"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep || !isPartnerAddressEditable}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.rua ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep || !isPartnerAddressEditable ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.rua && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.rua?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Controller
                                        name="socios_administradores.0.endereco.bairro"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep || !isPartnerAddressEditable}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.bairro ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep || !isPartnerAddressEditable ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.bairro && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.bairro?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Controller
                                        name="socios_administradores.0.endereco.cidade"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep || !isPartnerAddressEditable}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.cidade ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep || !isPartnerAddressEditable ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.cidade && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.cidade?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Controller
                                        name="socios_administradores.0.endereco.estado"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <Select
                                                label="Estado*"
                                                value={value || ""}
                                                onChange={onChange}
                                                options={estadosBrasileiros}
                                                disabled={isLoadingPartnerCep || !isPartnerAddressEditable}
                                                error={(errors as any).socios_administradores?.[0]?.endereco?.estado?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <Controller
                                        name="socios_administradores.0.endereco.numero_rua"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Número*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.numero_rua ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.numero_rua && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.numero_rua?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Controller
                                        name="socios_administradores.0.endereco.complemento"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.complemento ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.complemento && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.complemento?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <Controller
                                        name="socios_administradores.0.endereco.ponto_referencia"
                                        control={control}
                                        render={({field}) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ponto de referência*</label>
                                                <input
                                                    {...field}
                                                    color="default"
                                                    type="text"
                                                    disabled={isLoadingPartnerCep}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        (errors as any).socios_administradores?.[0]?.endereco?.ponto_referencia ? "border-red-500" : "border-gray-300"
                                                    } ${isLoadingPartnerCep ? "bg-gray-100" : ""}`}
                                                />
                                                {(errors as any).socios_administradores?.[0]?.endereco?.ponto_referencia && (
                                                    <p className="mt-1 text-sm text-red-600">{(errors as any).socios_administradores[0].endereco.ponto_referencia?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

DadosPessoais.displayName = "DadosPessoais";

export default DadosPessoais;
