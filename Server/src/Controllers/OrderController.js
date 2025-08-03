const Order = require('../Models/Order');
const Chef = require('../Models/Chef');
const MenuItem = require('../Models/MenuItem');

class OrderController {
  async createOrder(req, res) {
    try {
      const { chefId, items, clientName, clientPhone, clientAddress, observations } = req.body;

      const chef = await Chef.findById(chefId);
      if (!chef) {
        return res.status(404).json({ message: 'Chef/restaurante não encontrado.' });
      }

      let total = 0;
      const completeItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
          return res.status(404).json({ message: `Item do cardápio com ID ${item.menuItemId} não encontrado.` });
        }

        let itemPrice = menuItem.price;

        total += itemPrice * item.quantity;
        completeItems.push({
          menuItemId: menuItem._id,
          itemName: menuItem.name,
          unitPrice: itemPrice,
          quantity: item.quantity,
          observations: item.observations,
        });
      }

      const newOrder = new Order({
        chefId,
        items: completeItems,
        total,
        clientName,
        clientPhone,
        clientAddress,
        observations,
        status: 'pending',
      });

      await newOrder.save();

      if (!chef.phone) {
        return res.status(500).json({ message: 'Número de telefone WhatsApp do restaurante não configurado.' });
      }

      let message = `*Novo Pedido - ${chef.restaurantName}*\\n\\n`;
      message += `*Cliente:* ${newOrder.clientName}\\n`;
      message += `*Telefone:* ${newOrder.clientPhone}\\n`;
      if (newOrder.clientAddress) message += `*Endereço:* ${newOrder.clientAddress}\\n`;
      message += `*Itens do Pedido:*\\n`;

      newOrder.items.forEach(item => {
        message += `- ${item.quantity}x ${item.itemName} (R$ ${item.unitPrice.toFixed(2)})`;
        if (item.observations) message += `\\n  *Obs:* ${item.observations}`;
        message += `\\n`;
      });

      message += `\\n*Total:* R$ ${newOrder.total.toFixed(2)}`;
      if (newOrder.observations) message += `\\n\\n*Observações Gerais:* ${newOrder.observations}`;
      message += `\\n\\n*Status:* ${newOrder.status}`;

      const whatsappUrl = `https://wa.me/${chef.phone}?text=${encodeURIComponent(message)}`;
      res.status(201).json({ order: newOrder, whatsappUrl });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
    }
  }

  async getOrdersByChef(req, res) {
    try {
      const { chefId } = req.params;
      const orders = await Order.find({ chefId }).sort({ orderDate: -1 });
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { orderId } = req.params;
      const updates = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      res.status(200).json({ message: 'Pedido atualizado com sucesso', order: updatedOrder });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;

      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      res.status(200).json({ message: 'Pedido excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      res.status(500).json({ message: 'Erro ao excluir pedido', error: error.message });
    }
  }
}

module.exports = new OrderController();