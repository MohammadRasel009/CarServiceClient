import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import CheckOutRow from "./CheckOutRow";

const CheckOuts = () => {
  const { user } = useContext(AuthContext);
  
  const [checkouts, setCheckouts] = useState([]);

  const url = `http://localhost:5000/checkouts?email=${user?.email}`;
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCheckouts(data));
  }, [url]);

  const handleDelete = id => {
    const proceed = confirm('Are you sure you want to delete');
    if(proceed){
      fetch(`http://localhost:5000/checkouts/${id}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.deletedCount > 0){
          alert('Deleted Successfully.');
          const remaining = checkouts.filter(checkout => checkout._id !== id);
          setCheckouts(remaining);
        }
        
      })
    }
  }

  const handleCheckOutConfirm = id => {
    fetch(`http://localhost:5000/checkouts/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ status: 'Confirmed' })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.modifiedCount > 0) {
        // update status
        const remaining = checkouts.filter(checkout => checkout._id !== id);
        const updated = checkouts.find(checkout => checkout._id === id);
        updated.status = 'Confirmed';
        const newCheckouts = [updated, ...remaining];
        setCheckouts(newCheckouts);
      }
    })
  }

  return (
    <div>
      <h2 className="text-5xl"> Your CheckOuts : {checkouts.length}</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Image</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            
            {
                  checkouts.map(checkout => <CheckOutRow
                  key={checkout._id}
                  checkout={checkout}
                  handleDelete={handleDelete}
                  handleCheckOutConfirm={handleCheckOutConfirm}
                  ></CheckOutRow>)
            }

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckOuts;
