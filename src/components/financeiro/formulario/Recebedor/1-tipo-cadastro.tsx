import React, {useImperativeHandle, forwardRef, useCallback, useEffect} from "react";
import controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
import {UserRound, Building2, AlertCircle} from "lucide-react";
import {useForm, Controller, UseFormSetValue, SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import t from "onda-types";
import z4 from "zod/v4";
import utils from "onda-utils";
import api from "onda-utils/src/api";

const PUBLIC_BASE_URL_WAVE = process.env.PUBLIC_BASE_URL_WAVE;

const TipoCadastroSchema = z4
    .object({
        tipo: t.Financeiro.Controllers.Recebedor.TipoSchema.refine((val) => !!val, {
            message: "Selecione o tipo de recebedor",
        }),
        nome: z4.string().optional(),
        documento: z4.string().min(1, "Documento é obrigatório"),
        email: z4.string().min(1, "Email é obrigatório"),
        site_url: z4
            .string()
            .optional()
            .refine(
                (val) => {
                    if (!val) return true;
                    try {
                        new URL(val);
                        return true;
                    } catch {
                        return false;
                    }
                },
                {message: "URL inválida. Inclua http:// ou https://"}
            ),
    })
    .superRefine((data, ctx) => {
        // Valida o campo 'documento' com base no valor do campo 'tipo'
        if (data.tipo === "individual" && data.documento.length !== 14) {
            ctx.addIssue({
                code: z4.ZodIssueCode.custom,
                path: ["documento"], // Adiciona o erro especificamente ao campo 'documento'
                message: "CPF com formato inválido. Deve conter 11 dígitos.",
            });
        }
        if (data.tipo === "empresa" && data.documento.length !== 18) {
            ctx.addIssue({
                code: z4.ZodIssueCode.custom,
                path: ["documento"],
                message: "CNPJ com formato inválido. Deve conter 14 dígitos.",
            });
        }
    });

// 3. O tipo do formulário é inferido a partir do schema corrigido
type TipoCadastroForm = z4.infer<typeof TipoCadastroSchema>;

// 4. Função `buscaCpf` com a tipagem correta para `setValue`
export const buscaCpf = async (cpf: string, setValue: UseFormSetValue<TipoCadastroForm>): Promise<void> => {
    const apenasNumeros = (valor: string | undefined | null): string => {
        if (!valor) return "";
        return valor.replace(/\D/g, "");
    };
    const cpfApenasNumeros = apenasNumeros(cpf);
    // Os nomes dos campos agora correspondem ao schema
    const nameField = "nome";
    const documentField = "documento";

    try {
        const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_WAVE), `/public/locatario/${cpfApenasNumeros}`, true);
        const data: {results: Array<{locatarioNome?: string}>} = await response.json();

        setValue(nameField, data.results[0]?.locatarioNome || "", {shouldValidate: true});
        setValue(documentField, cpf, {shouldValidate: true});
    } catch (error) {
        console.error("Erro ao buscar dados do CPF:", error);
        setValue(nameField, "", {shouldValidate: true});
        setValue(documentField, cpf, {shouldValidate: true});
    }
};

// Funções de formatação (mantidas como no original)
function formatCPF(value: string): string {
    const cpf = value.replace(/\D/g, "").slice(0, 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatCNPJ(value: string): string {
    const cnpj = value.replace(/\D/g, "").slice(0, 14);
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

interface TipoCadastroProps {
    onValidate?: () => t.Financeiro.Controllers.Recebedor.Criar.Input;
}

interface TipoCadastroRef {
    validateForm: () => Promise<boolean>;
    onSubmitTipoCadastro: () => void;
}

const TipoCadastro = forwardRef<TipoCadastroRef, TipoCadastroProps>(({onValidate}, ref) => {
    const formularioState = controller_recebedor.contexto.jsx.get_formulario();
    const user = api.usuario_auth().data.usuario_auth;
    const loginUser = user as Extract<typeof user, {type: "login"}>;

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
        watch,
        trigger,
        clearErrors,
    } = useForm<TipoCadastroForm>({
        resolver: zodResolver(TipoCadastroSchema),
        defaultValues: {
            tipo: (formularioState.tipo as t.Financeiro.Controllers.Recebedor.Tipo) || undefined,
            documento: "",
            email: loginUser.email || "",
            site_url: undefined,
            nome: "",
        },
    });

    const tipoRecebedor = watch("tipo");
    const documento = watch("documento");

    const handleTipoChange = async (tipo: t.Financeiro.Controllers.Recebedor.Tipo) => {
        controller_recebedor.contexto.state.set_steep_progress(0);
        setValue("tipo", tipo, {shouldValidate: true});
        setValue("documento", "", {shouldValidate: false});
        setValue("site_url", "", {shouldValidate: true});
        setValue("email", loginUser.email || "", {shouldValidate: true});
        clearErrors();
    };

    const buscaCnpj = useCallback(
        async (cnpj: string): Promise<void> => {
            try {
                const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/[^\d]/g, "")}`);
                if (!response.ok) throw new Error("Erro ao buscar CNPJ");
                const data: {site?: string} = await response.json();
                setValue("site_url", data.site || "", {shouldValidate: true});
                clearErrors("site_url");
            } catch (error) {
                console.error("Erro ao buscar dados do CNPJ:", error);
            }
        },
        [setValue, clearErrors]
    );

    useEffect(() => {
        // A lógica de busca é disparada quando o documento atinge o tamanho formatado
        if (tipoRecebedor === "individual" && documento?.length === 14) {
            buscaCpf(documento, setValue);
        } else if (tipoRecebedor === "empresa" && documento?.length === 18) {
            buscaCnpj(documento);
        }
    }, [documento, tipoRecebedor, buscaCnpj, setValue]);

    const onSubmit: SubmitHandler<TipoCadastroForm> = async (data) => {
        console.log("Form data is valid:", data);
        const isValid = await trigger();
        if (isValid) {
            controller_recebedor.contexto.state.set_steep_progress(1);
        }
    };

    useImperativeHandle(ref, () => ({
        validateForm: async () => {
            return await trigger();
        },
        onSubmitTipoCadastro: () => {
            handleSubmit(onSubmit)();
        },
    }));

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Selecione o tipo de recebedor</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* Pessoa Física */}
                        <div
                            className={`border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                tipoRecebedor === "individual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleTipoChange("individual")}
                        >
                            <div className="p-6 text-center">
                                <UserRound className="mx-auto mb-3 text-blue-500" size={48} />
                                <h3 className="text-lg font-semibold mb-2">Pessoa Física</h3>
                                <p className="text-sm text-gray-600">Para recebedores individuais com CPF</p>
                            </div>
                        </div>

                        {/* Pessoa Jurídica */}
                        <div
                            className={`border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                tipoRecebedor === "empresa" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleTipoChange("empresa")}
                        >
                            <div className="p-6 text-center">
                                <Building2 className="mx-auto mb-3 text-blue-500" size={48} />
                                <h3 className="text-lg font-semibold mb-2">Pessoa Jurídica</h3>
                                <p className="text-sm text-gray-600">Para empresas e negócios com CNPJ</p>
                            </div>
                        </div>
                    </div>

                    {errors.tipo && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
                            <AlertCircle size={16} />
                            <span>{errors.tipo.message}</span>
                        </div>
                    )}
                </div>

                {tipoRecebedor && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Campo Documento */}
                            <div>
                                <Controller
                                    name="documento"
                                    control={control}
                                    render={({field: {onChange, value, ...field}}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{tipoRecebedor === "individual" ? "CPF*" : "CNPJ*"}</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="text"
                                                value={value || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const rawValue = e.target.value;
                                                    const formattedValue = tipoRecebedor === "individual" ? formatCPF(rawValue) : formatCNPJ(rawValue);
                                                    onChange(formattedValue);
                                                }}
                                                maxLength={tipoRecebedor === "individual" ? 14 : 18}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.documento ? "border-red-500" : "border-gray-300"
                                                }`}
                                                placeholder="Digite apenas números"
                                            />
                                            {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento.message}</p>}
                                            {!errors.documento && <p className="mt-1 text-sm text-gray-500">Digite apenas números</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Campo Email */}
                            <div>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                                            <input
                                                {...field}
                                                color="default"
                                                type="email"
                                                value={loginUser.email || field.value || ""}
                                                disabled={!!loginUser.email}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.email ? "border-red-500" : "border-gray-300"
                                                } ${!!loginUser.email ? "bg-gray-100" : ""}`}
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Campo Website */}
                        <div>
                            <Controller
                                name="site_url"
                                control={control}
                                render={({field}) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input
                                            {...field}
                                            color="default"
                                            value={field.value || ""} // Garante que o input não receba `undefined`
                                            type="url"
                                            placeholder="https://"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.site_url ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.site_url && <p className="mt-1 text-sm text-red-600">{errors.site_url.message}</p>}
                                        {!errors.site_url && <p className="mt-1 text-sm text-gray-500">Opcional. Inclua o protocolo http:// ou https://</p>}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

TipoCadastro.displayName = "TipoCadastro";

export default TipoCadastro;
