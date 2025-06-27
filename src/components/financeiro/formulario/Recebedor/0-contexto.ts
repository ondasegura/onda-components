import { create } from 'zustand';

export const store = create((set) => ({
    formData: {
        type: '',
        //Pessoa física
        name: '',
        mother_name: '',
        birthdate: '',
        monthly_income: '',
        professional_occupation: '',
        //Pessoa jurídica
        company_name: '',
        trading_name:'',
        annual_revenue: '',
        corporation_type: '',
        founding_date: '',
        //Comuns
        email:'',
        document: '',
        site_url: '',
        phone_numbers: [{
            ddd: '',
            number: '',
            type: ''
        }],
        main_address: {
            street: '',
            complementary: '',
            street_number: '',
            neighborhood: '',
            city: '',
            state: '',
            zip_code: '',
            reference_point: ''
        },
        managing_partners: [{
            name: '',
            email: '',
            document: '',
            type: 'individual',
            mother_name: '',
            birthdate: '',
            monthly_income: '',
            professional_occupation: '',
            self_declared_legal_representative: null,
            address: {
                street: '',
                complementary: '',
                street_number: '',
                neighborhood: '',
                city: '',
                state: '',
                zip_code: '',
                reference_point: ''
            },
            phone_numbers: [{
                ddd: '',
                number: '',
                type: ''
            }]
        }],
        //Dados bancários
        default_bank_account: {
            holder_name: '',
            holder_type: '',
            holder_document: '',
            bank: '',
            branch_number: '',
            branch_check_digit: '',
            account_number: '',
            account_check_digit: '',
            type: 'checking'
        },
        //Lista de bancos
        isLoadingBanks: false,
        metadata: {},
        // Controle de campos desabilitados para CEP
        isLoadingCep: false,
        isAddressEditable: false,
        // Controle de campos desabilitados para CPF
        isLoadingCpf: false,
        // Controle de campos desabilitados para Representante Legal
        isManagingPartnerNameDisabled: true,
        isManagingPartnerEmailDisabled: true,
        isManagingPartnerDddDisabled: true,
        bancos: [],
    },
    step: 0,
    reset_form: '',
}));

class DadosRecebedorSplitContext {
    // static jsx = class jsx {}
    static state = class state {
        static get_form_data() {
            return store.getState();
        }
    }
    // static api = class api {}
    // static websocket = class websocket {}

    static get_state() {
        return store.getState();
    }

    // static get_form_data() {
    //     return store((state) => state.formData) 
    // }

    static get_form_data() {
        return store.getState().formData;
    }
    
    static get_step() {
        return store.getState().step;
    }

    static set_step(newStep) {
        store.setState({ step: newStep });
    }

    static next_step() {
        const currentStep = store.getState().step;
        if (currentStep < 2) {
            store.setState({ step: currentStep + 1 });
        }
    }

    static prev_step() {
        const currentStep = store.getState().step;
        if (currentStep > 0) {
            store.setState({ step: currentStep - 1 });
        }
    }

    static update_form_data(newData) {  
        store.setState(state => ({
            formData: { ...state.formData, ...newData }
        }));
    }

    static reset_form() {
        store.setState({
            formData: {
                type: '',
                name: '',
                mother_name: '',
                birthdate: '',
                monthly_income: '',
                professional_occupation: '',
                company_name: '',
                trading_name: '', 
                annual_revenue: '',
                corporation_type: '',
                founding_date: '',
                email: '',
                document: '',
                site_url: '',
                phone_numbers: [{
                    ddd: '',
                    number: '',
                    type: ''
                }],
                main_address: {
                    street: '',
                    complementary: '',
                    street_number: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    reference_point: ''
                },
                managing_partners: [{
                    name: '',
                    email: '',
                    document: '',
                    type: 'individual',
                    mother_name: '',
                    birthdate: '',
                    monthly_income: '',
                    professional_occupation: '',
                    self_declared_legal_representative: null,
                    address: {
                        street: '',
                        complementary: '',
                        street_number: '',
                        neighborhood: '',
                        city: '',
                        state: '',
                        zip_code: '',
                        reference_point: '',
                    },
                    phone_numbers: [{
                        ddd: '',
                        number: '',
                        type: ''
                    }]
                }],
                default_bank_account: {
                    holder_name: '',
                    holder_type: '',
                    holder_document: '',
                    bank: '',
                    branch_number: '',
                    branch_check_digit: '',
                    account_number: '',
                    account_check_digit: '',
                    type: 'checking'
                },
                bancos: [],
                isLoadingBanks: false,
                metadata: {},
                isLoadingCep: false,
                isAddressEditable: false,
                isLoadingCpf: false,
                isManagingPartnerNameDisabled: true,
                isManagingPartnerEmailDisabled: true,
                isManagingPartnerDddDisabled: true
            },
            step: 0
        });
    }
}


export default DadosRecebedorSplitContext;