const routes = require('express').Router();
const RegisterController = require('../Controllers/RegisterController');
const LoginController = require('../Controllers/LoginController');
const MenuItemController = require('../Controllers/MenuItemController'); 
const PlanController = require('../Controllers/PlansController');
const OrderController = require('../Controllers/OrderController');
const QRCode = require('qrcode');
const Chef = require('../Models/Chef'); 
const MenuItem = require('../Models/MenuItem');
const Order = require('../Models/Order'); 

const checkSubscription = async (req, res, next) => {
  let chefId = req.params.chefId || req.body.chefId;
  if (!chefId && req.params.itemId) {
    try {
      const item = await MenuItem.findById(req.params.itemId);
      if (item) {
        chefId = item.chef;
      }
    } catch (error) {
      console.error('Erro ao buscar MenuItem para verificação de assinatura:', error);
      return res.status(500).json({ message: 'Erro do servidor durante a verificação de assinatura.', error: error.message });
    }
  }
  if (!chefId && req.params.orderId) {
    try {
      const order = await Order.findById(req.params.orderId);
      if (order) {
        chefId = order.chefId;
      }
    } catch (error) {
      console.error('Erro ao buscar Pedido para verificação de assinatura:', error);
      return res.status(500).json({ message: 'Erro do servidor durante a verificação de assinatura.', error: error.message });
    }
  }


  if (!chefId) {
    return res.status(401).json({ message: 'Autenticação necessária: ID do Chef não fornecido.' });
  }

  try {
    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ message: 'Chef não encontrado.' });
    }

    if (!chef.planoAtivo || (chef.dataExpiracaoPlano && chef.dataExpiracaoPlano < new Date())) {
      if (chef.planoAtivo && chef.dataExpiracaoPlano && chef.dataExpiracaoPlano < new Date()) {
        chef.planoAtivo = false;
        await chef.save();
      }
      return res.status(403).json({ message: 'Seu plano não está ativo ou expirou. Por favor, assine para ter acesso completo.' });
    }
    req.chef = chef;
    next();
  } catch (error) {
    console.error('Erro no middleware checkSubscription:', error);
    res.status(500).json({ message: 'Erro do servidor durante a verificação de assinatura.', error: error.message });
  }
};

routes.post('/beAChef', RegisterController.registerChef);
routes.post('/loginChef', LoginController.loginChef);
routes.post('/mercadopago/webhook', PlanController.handleMercadoPagoWebhook);
routes.post('/planMensal', PlanController.createMonthlyPlan);
routes.post('/planAnual', PlanController.createAnnualPlan);

routes.get('/chefs/:chefId', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.chefId).select('-password');
    if (!chef) {
      return res.status(404).json({ message: 'Chef não encontrado.' });
    }
    res.status(200).json(chef);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar chef', error: error.message });
  }
});

routes.put('/chefs/:chefId', async (req, res) => {
  try {
    const { email, password, ...updateData } = req.body;
    const chef = await Chef.findByIdAndUpdate(req.params.chefId, updateData, { new: true }).select('-password');
    if (!chef) {
      return res.status(404).json({ message: 'Chef não encontrado.' });
    }
    res.status(200).json({ message: 'Informações do chef atualizadas com sucesso!', chef });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar chef', error: error.message });
  }
});

routes.post('/chefs/:chefId/menuItems', checkSubscription, MenuItemController.createMenuItem); 
routes.get('/chefs/:chefId/menuItems', checkSubscription, MenuItemController.getMenuItemsByChef); 
routes.get('/menuItems/:itemId', checkSubscription, MenuItemController.getMenuItemById); 
routes.put('/menuItems/:itemId', checkSubscription, MenuItemController.updateMenuItem); 
routes.delete('/menuItems/:itemId', checkSubscription, MenuItemController.deleteMenuItem);
routes.get('/chefs/:chefId/orders', checkSubscription, OrderController.getOrdersByChef);
routes.put('/orders/:orderId', checkSubscription, OrderController.updateOrder);
routes.delete('/orders/:orderId', checkSubscription, OrderController.deleteOrder);

routes.post('/generate-qr', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL é obrigatória para gerar o QR Code.' });
  }
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    res.json({ qrCodeUrl: qrCodeDataUrl });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ message: 'Erro ao gerar QR Code', error: error.message });
  }
});

routes.get('/public/menu/:chefId', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.chefId).select('-password');
    if (!chef) {
      return res.status(404).json({ message: 'Chef ou restaurante não encontrado.' });
    }

    if (!chef.planoAtivo || (chef.dataExpiracaoPlano && chef.dataExpiracaoPlano < new Date())) {
      if (chef.planoAtivo && chef.dataExpiracaoPlano && chef.dataExpiracaoPlano < new Date()) {
        chef.planoAtivo = false;
        await chef.save();
      }
      return res.status(403).json({ message: 'O cardápio deste estabelecimento está inativo no momento. Por favor, tente novamente mais tarde.' });
    }

    res.status(200).json({
      _id: chef._id,
      restaurantName: chef.restaurantName,
      address: chef.address,
      phone: chef.phone,
      profilePicture: chef.profilePicture,
    });

  } catch (error) {
    console.error('Erro ao buscar dados do chef para cardápio público:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do estabelecimento para cardápio público', error: error.message });
  }
});

routes.get('/public/menu/:chefId/items', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.chefId);
    if (!chef) {
      return res.status(404).json({ message: 'Chef ou restaurante não encontrado.' });
    }

    if (!chef.planoAtivo || (chef.dataExpiracaoPlano && chef.dataExpiracaoPlano < new Date())) {
      return res.status(403).json({ message: 'O cardápio deste estabelecimento está inativo no momento. Por favor, tente novamente mais tarde.' });
    }

    const menuItems = await MenuItem.find({ chef: req.params.chefId, isAvailable: true }); 
    res.status(200).json({ menuItems });
  } catch (error) {
    console.error('Erro ao buscar itens de cardápio para cardápio público:', error);
    res.status(500).json({ message: 'Erro ao buscar itens de cardápio para cardápio público', error: error.message });
  }
});

routes.post('/public/orders', OrderController.createOrder); 

module.exports = routes;