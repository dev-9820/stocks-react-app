import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import css from './App.css'

function App() {
  const [stocks, setStocks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newStock, setNewStock] = useState({ name: '', ticker_symbol: '', price: '' });
  const [error, setError] = useState('');


  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const response = await axios.get('https://flask-api-stocks.onrender.com/stocks');
    setStocks(response.data);
  };

  const deleteStock = async (id) => {
    const response = await axios.delete(`https://flask-api-stocks.onrender.com/stocks/${id}`);
    fetchStocks();
  }


  const addStock = async () => {

      if (!newStock.name || !newStock.ticker_symbol || !newStock.price) {
        console.error('Please Fill The Data');
          return;
      }


      await axios.post('https://flask-api-stocks.onrender.com/stocks', newStock);
      fetchStocks();
    setIsOpen(false);

    setNewStock({ name: '', ticker_symbol: '', price: '' });
  };


  return (
      <div className="bg-cyan-800 p-16 min-h-screen">

        <h1 className="text-3xl font-bold text-white text-center mb-5">Stock List</h1>
        <table className="min-w-full rounded-xl overflow-hidden shadow-2xl table-auto">
          <thead className="bg-gray-200">
          <tr>
            <th className="px-4 border  py-2">Name</th>
            <th className="px-4 border  py-2">Ticker Symbol</th>
            <th className="px-4 border  py-2">Price</th>
            <th className="px-4 border  py-2">Edit</th>
          </tr>
          </thead>
          <tbody>
          {stocks.map(stock => (
              <tr key={stock.id} className="text-center bg-white">
                <td className="border px-4 py-2">{stock.name}</td>
                <td className="border px-4 py-2">{stock.ticker_symbol}</td>
                <td className="border px-4 py-2">${stock.price}</td>
                <td className="border px-4 py-2">
                  <button
                      onClick={() => deleteStock(stock.id) }
                      className="bg-red-600 p-1 hover:bg-red-500 transition-all rounded shadow-md">
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
        <div className="text-center">
        <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white rounded px-4 py-2 mt-4 hover:bg-blue-950 transition-all shadow-lg"
        >
          Add Stock
        </button>
          </div>


        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
          <div className="scale-110 bg-cyan-800 min-h-screen min-w-full pt-32 text-center">
            <h2 className="text-3xl mb-5 font-mono font-bold">Add New Stock</h2>
            <div className="form">
            <input
                className="border rounded-md mb-3 border-cyan-500 p-1 block text-center"
                type="text"
                placeholder="Name"
                value={newStock.name}
                onChange={(e) => setNewStock({...newStock, name: e.target.value})}
            />
            <input
                className="border rounded-md mb-3 border-cyan-500 p-1 block text-center"
                type="text"
                placeholder="Ticker Symbol"
                value={newStock.ticker_symbol}
                onChange={(e) => setNewStock({...newStock, ticker_symbol: e.target.value})}
            />
            <input
                className="border rounded-md mb-3 border-cyan-500 p-1 block text-center"
                type="number"
                placeholder="Price"
                value={newStock.price}
                onChange={(e) => setNewStock({...newStock, price: parseFloat(e.target.value)})}
            />
            </div>
            <button onClick={addStock}
                    className="bg-blue-500 mx-4 text-white rounded px-4 py-2 mt-4 hover:bg-blue-950 transition-all shadow-lg">Add
            </button>
            <button onClick={() => setIsOpen(false)}
                    className="bg-red-500 text-white rounded px-4 py-2 mt-4 hover:bg-red-950 transition-all shadow-lg">Cancel
            </button>

          </div>
        </Modal>
      </div>
  );
}

export default App;
