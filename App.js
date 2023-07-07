import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [crashPercentages, setCrashPercentages] = useState([]);
  const [equityData, setEquityData] = useState([]);

  const handlePurchasePriceChange = (event) => {
    setPurchasePrice(Number(event.target.value));
  };

  const handleDepositChange = (event) => {
    setDeposit(Number(event.target.value));
  };

  const handleCrashPercentageChange = (index, event) => {
    const updatedPercentages = [...crashPercentages];
    updatedPercentages[index] = Number(event.target.value);
    setCrashPercentages(updatedPercentages);
  };

  const handleAddCrashPercentage = () => {
    setCrashPercentages([...crashPercentages, 0]);
  };

  const handleRemoveCrashPercentage = (index) => {
    const updatedPercentages = [...crashPercentages];
    updatedPercentages.splice(index, 1);
    setCrashPercentages(updatedPercentages);
  };

  const calculateEquityData = () => {
    const months = 24; // Number of months
  
    const equityData = Array.from({ length: months }, (_, index) => {
      const month = index + 1;
      const equity = crashPercentages.map((percentage) => purchasePrice - month * (purchasePrice * (percentage / 100 / months)));
      const hasNegativeEquity = equity.some((equity) => (purchasePrice - deposit));
      return { month, equity, hasNegativeEquity };
    });
  
    setEquityData(equityData);
  };

  const renderTable = () => {
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Scenario</th>
            <th>Total Equity Loss</th>
          </tr>
        </thead>
        <tbody>
          {crashPercentages.map((percentage, index) => {
            const totalEquityLoss = purchasePrice - (purchasePrice * (percentage / 100));
            return (
              <tr key={`scenario-${index}`}>
                <td>Crash {index + 1}</td>
                <td>{totalEquityLoss}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <h2>House Equity Calculator</h2>
      <div className="form-group">
        <label>Purchase Price:</label>
        <input type="number" className="form-control" value={purchasePrice} onChange={handlePurchasePriceChange} />
      </div>
      <div className="form-group">
        <label>Deposit:</label>
        <input type="number" className="form-control" value={deposit} onChange={handleDepositChange} />
      </div>
      <div>
        <h3>Price Crash Percentages:</h3>
        {crashPercentages.map((percentage, index) => (
          <div key={`crash-${index}`}>
            <input
              type="number"
              className="form-control"
              value={percentage}
              onChange={(event) => handleCrashPercentageChange(index, event)}
            />
            <button className="btn btn-danger" onClick={() => handleRemoveCrashPercentage(index)}>Remove</button>
          </div>
        ))}
        <button className="btn btn-primary" onClick={handleAddCrashPercentage}>Add Percentage</button>
      </div>
      <button className="btn btn-success" onClick={calculateEquityData}>Calculate Equity Data</button>
      <div>
        <h3>Monthly Equity Reduction:</h3>
        <LineChart width={800} height={400} data={equityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {crashPercentages.map((_, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={`equity[${index}]`}
              name={`Crash ${index + 1}`}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
          <Line
            type="linear"
            dataKey="negativeEquity"
            name="Negative Equity"
            stroke="#FF0000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
      <div>
        <h3>Total Equity Loss:</h3>
        {renderTable()}
      </div>
    </div>
  );
};

export default App;
