import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [name, setName] = useState(''); // Initial state is an empty string
  const [datetime, setDatetime] = useState(''); // Initial state is an empty string
  const [description, setDescription] = useState('');
  const [transactions, setTransactions]= useState([]);

  useEffect(()=> {
    getTransactions().then(setTransactions);
  }, []);
  async function getTransactions() {
    const url = "http://localhost:4040/api/transactions";
    try {
      const response = await fetch(url);
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse JSON
      return await response.json();
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      return [];
    }
  }
  
  

  function addNewTransaction(ev) {
    ev.preventDefault();
  
    // Extract the price and description using a regex pattern
    const priceMatch = name.match(/^([+-]?\d+(\.\d+)?)/); // Match price at the start (e.g., +200, -500)
    const price = priceMatch ? priceMatch[0] : ''; // If price is found, use it, otherwise set it as an empty string
    const descriptionPart = name.substring(price.length).trim(); // Extract the rest of the string as description
  
    if (!price || !descriptionPart || !datetime) {
      console.error('Error: Missing required fields. Ensure price, description, and datetime are provided.');
      return; // Exit early if price, description, or datetime is missing
    }
  
    console.log('Price:', price);
    console.log('Description:', descriptionPart);
  
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
  
    // Send the data to the server
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: descriptionPart, // Send description as name
        price: parseFloat(price), // Send price as a number
        description: description, // Send the description from the input
        datetime: datetime, // Send datetime
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON response
    })
    .then((json) => {
      setName('');
      setDatetime('');
      setDescription('');
      console.log('Result:', json); // Log the parsed JSON response
    })
    .catch((error) => {
      console.error('Error:', error); // Log any errors
    });
  }
  
  let balance=0;
  for (const transaction of transactions ){
    balance= balance+ transaction.price;
  }
  const fractionDigits=2;
  balance= balance.toFixed(fractionDigits);
  
  const fraction=balance.split(".")[1];
  balance= balance.split('.')[0];
  // const cents= 

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input 
            type="text" 
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+200 new samsung tv'}
          />
          <input 
            value={datetime} 
            onChange={ev => setDatetime(ev.target.value)} 
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input 
            value={description}
            onChange={ev => setDescription(ev.target.value)} 
            type="text" 
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
        
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div>

        <div className='transaction'>
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            {console.log(transaction.price)}
            <div className={"price "+ (transaction.price < 0?'red':'green')}>
              {transaction.price}
              </div>
            <div className="datetime">01-24-2025 01:29 PM</div>
          </div>
        </div>
          </div>
        ))}
        
        {/* Add more transactions here */}
      </div>
    </main>
  );
}

export default App;
