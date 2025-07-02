import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../../api/freelancer/freelancerServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import OrderDetails from './OrderDetails';

const truncateTitle = (title: string, maxLength = 45) => title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;

const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function fetchOrderList() {
      if (user?._id) {
        const data = { freelancerId: user._id };
        const response = await fetchOrders(data);
        setOrders(response.orders);
      }
    }
    fetchOrderList();
  }, [user]);

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  // Update order status locally
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const calculateDeliveryDate = (orderDate: string, deliveryDays: number) => {
    const orderDateObj = new Date(orderDate);
    orderDateObj.setDate(orderDateObj.getDate() + deliveryDays);
    return orderDateObj.toLocaleDateString();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700">
          <span className="w-1/5">Client</span>
          <span className="w-4/6">Project</span>
          <span className="w-1/5">Status</span>
          <span className="w-1/5">Due On</span>
          <span className="w-1/5">Total Price</span>
          <span className="w-1/5 text-right">Actions</span>
        </div>

        {orders.map((order) => (
          <div key={order._id} className="flex justify-between items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition duration-200">
            <div className="w-1/5 flex items-center space-x-4">
              <img src={order.clientId?.profilePicture} alt="Client" className="w-10 h-10 rounded-full" />
              <span className="text-gray-800 font-medium">{order.clientId.name}</span>
            </div>

            <div className="w-4/6">
              <p className="text-gray-800 font-medium">{truncateTitle(order.projectId.title)}</p>
            </div>

            <span className={`w-1/5 font-medium inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {order.status}
            </span>

            <div className="w-1/5 text-gray-600">{calculateDeliveryDate(order.orderDate, order.bidId?.deliveryDays)}</div>

            <div className="w-1/5 text-gray-600">$ {order.total}</div>

            <div className="w-1/5 text-right">
              <button className="text-sm font-semibold text-white h-8 bg-black w-32" onClick={() => openDetailsModal(order)}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDetailsModalOpen && (
        <OrderDetails
          order={selectedOrder}
          onClose={closeDetailsModal}
          updateOrderStatus={updateOrderStatus} 
        />
      )}
    </div>
  );
};

export default OrderList;
