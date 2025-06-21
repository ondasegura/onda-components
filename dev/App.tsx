import React from "react";
import { Button, Card } from "../src";
import { Heart, Send, Settings } from "lucide-react";

export const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Biblioteca de Componentes</h1>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Botões</h2>

                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <Button size="sm" icon={Heart}>
                                Small
                            </Button>
                            <Button size="md" icon={Send}>
                                Medium
                            </Button>
                            <Button size="lg" icon={Settings}>
                                Large
                            </Button>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <Button icon={Heart} iconPosition="left">
                                Icon Left
                            </Button>
                            <Button icon={Send} iconPosition="right">
                                Icon Right
                            </Button>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cards</h2>

                    <div className="space-y-4">
                        <Card title="Card Simples">Este é um card básico com título e conteúdo.</Card>

                        <Card id="card-dismissible" title="Card Dispensável" dismissible>
                            Este card pode ser fechado clicando no X. O estado é gerenciado com Zustand.
                        </Card>

                        <Card className="bg-blue-50">
                            <p className="font-semibold mb-2">Card Customizado</p>
                            Este card tem classes CSS customizadas aplicadas.
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
};
