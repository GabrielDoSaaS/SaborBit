const { MercadoPagoConfig, PreApprovalPlan, PreApproval } = require('mercadopago');
const Chef = require('../Models/Chef');
const moment = require('moment'); 

const client = new MercadoPagoConfig({
    accessToken: MERCADOPAGO_TOKEN.process.env,
    options: {
        timeout: 5000
    }
});

const preApprovalPlan = new PreApprovalPlan(client);
const preApproval = new PreApproval(client);

async function createMonthlyPlan(req, res) {
    const { emailChef } = req.body;

    try {
        const response = await preApprovalPlan.create({
            body: {
                reason: "Assinatura Mensal de Serviço",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 59.90,
                    currency_id: "BRL"
                },
                back_url: "https://www.seusite.com.br/sucesso-assinatura",
                external_reference: `plano_mensal_premium_${emailChef}`,
                status: "active"
            }
        });

        return res.send(response.init_point);
    } catch (error) {
        console.error("Erro ao criar plano mensal:", error.message || error);
        return res.status(500).send("Erro ao criar plano mensal.");
    }
}

async function createAnnualPlan(req, res) {
    const { emailChef } = req.body;

    try {
        const response = await preApprovalPlan.create({
            body: {
                reason: "Assinatura Anual de Serviço",
                auto_recurring: {
                    frequency: 12,
                    frequency_type: "months",
                    transaction_amount: 599,
                    currency_id: "BRL"
                },
                back_url: "https://www.seusite.com.br/sucesso-assinatura-anual",
                external_reference: `plano_anual_premium_${emailChef}`,
                status: "active"
            }
        });

        return res.send(response.init_point);
    } catch (error) {
        console.error("Erro ao criar plano anual:", error.message || error);
        return res.status(500).send("Erro ao criar plano anual.");
    }
}

async function handleMercadoPagoWebhook(req, res) {
    const { type, data } = req.body;

    console.log("Webhook recebido:", type, data);

    try {
        if (type === 'preapproval') {
            const preapprovalId = data.id;
            const preapprovalDetails = await preApproval.get({ id: preapprovalId });
            const externalReference = preapprovalDetails.external_reference;
            const status = preapprovalDetails.status;

            const emailChefMatch = externalReference.match(/_(plano_mensal_premium|plano_anual_premium)_(.+)/);
            const emailChef = emailChefMatch ? emailChefMatch[2] : null;

            if (!emailChef) {
                console.warn("Email do chef não encontrado no external_reference:", externalReference);
                return res.status(400).send("Email do chef não encontrado.");
            }

            const chef = await Chef.findOne({ email: emailChef });

            if (!chef) {
                console.warn("Chef não encontrado para o email:", emailChef);
                return res.status(404).send("Chef não encontrado.");
            }

            if (status === 'authorized') {
                chef.planoAtivo = true;

                if (externalReference.includes('plano_mensal_premium')) {
                    chef.dataExpiracaoPlano = moment().add(1, 'months').toDate();
                } else if (externalReference.includes('plano_anual_premium')) {
                    chef.dataExpiracaoPlano = moment().add(12, 'months').toDate();
                }

                await chef.save();
                console.log(`Plano ativado para o chef ${chef.email}. Data de expiração: ${chef.dataExpiracaoPlano}`);
            } else if (status === 'cancelled' || status === 'paused' || status === 'pending') {
                chef.planoAtivo = false;
                chef.dataExpiracaoPlano = null;
                await chef.save();
                console.log(`Plano do chef ${chef.email} atualizado para ${status}.`);
            }
        } else if (type === 'payment') {
            const paymentId = data.id;
            const paymentDetails = await client.payments.get({ id: paymentId });
            const paymentStatus = paymentDetails.status;
            const externalReference = paymentDetails.external_reference;

            if (paymentStatus === 'approved' && externalReference && externalReference.startsWith('plano_')) {
                const emailChefMatch = externalReference.match(/_(plano_mensal_premium|plano_anual_premium)_(.+)/);
                const emailChef = emailChefMatch ? emailChefMatch[2] : null;

                if (emailChef) {
                    const chef = await Chef.findOne({ email: emailChef });
                    if (chef && !chef.planoAtivo) {
                        chef.planoAtivo = true;
                        if (externalReference.includes('plano_mensal_premium')) {
                            chef.dataExpiracaoPlano = moment().add(1, 'months').toDate();
                        } else if (externalReference.includes('plano_anual_premium')) {
                            chef.dataExpiracaoPlano = moment().add(12, 'months').toDate();
                        }
                        await chef.save();
                        console.log(`Plano ativado via pagamento aprovado para o chef ${chef.email}. Data de expiração: ${chef.dataExpiracaoPlano}`);
                    }
                }
            }
        }

        return res.status(200).send('Webhook recebido com sucesso.');
    } catch (error) {
        console.error("Erro ao processar webhook do Mercado Pago:", error.message || error);
        return res.status(500).send("Erro interno ao processar webhook.");
    }
}

async function checkExpiredPlans() {
    try {
        const chefsExpirados = await Chef.find({
            planoAtivo: true,
            dataExpiracaoPlano: { $lte: new Date() }
        });

        for (const chef of chefsExpirados) {
            chef.planoAtivo = false;
            chef.dataExpiracaoPlano = null;
            await chef.save();
            console.log(`Plano do chef ${chef.email} desativado por expiração.`);
        }
    } catch (error) {
        console.error("Erro ao verificar planos expirados:", error.message || error);
    }
}

module.exports = {
    createMonthlyPlan,
    createAnnualPlan,
    handleMercadoPagoWebhook,
    checkExpiredPlans
};