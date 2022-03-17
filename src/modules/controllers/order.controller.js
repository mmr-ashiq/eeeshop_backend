const createOrder = async (req, res) => {
    res.status(201).json("Order created");
};

const getAllOrders = async (req, res) => {
}

const getSingleOrder = async (req, res) => {
  
}

const getCurrentUserOrders = async (req, res) => {
}

const updateOrder = async (req, res) => {
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
};