import { useState, useEffect } from "react";
import { withdrawContract, addBalanceOperation, claimFundsOperation, addBalanceOperationOwner, claimFundsOperationOwner } from "./utils/operation";

// Components
import Navbar from "./components/Navbar";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [iswithdrawOwner, setiswithdrawOwner] = useState(0);
  const [iswithdrawCounterParty, setiswithdrawCounterParty] = useState(0);

  const onClaimFunds = async () => {
    try{
      setLoading(true)
      await claimFundsOperation()
      alert("Transaction succesful")
    }
    catch (error)
    {
      throw error;
    }
    setLoading(false)
  };

  const onClaimFundsOwner = async () => {
    try{
      setLoading1(true)
      await claimFundsOperationOwner()
      alert("Transaction succesful")
    }
    catch (error)
    {
      throw error;
    }
    setLoading1(false)
  };

  const onAddBalance = async (amount) => {
    try
    {
      await addBalanceOperation(amount)
      alert("Transaction succesful")
    }
    catch (error)
    {
      alert(error)
      alert("Transaction failed")
    }
  };

  const onAddBalanceOwner = async (amount) => {
    try
    {
      await addBalanceOperationOwner(amount)
      alert("Transaction succesful")
    }
    catch (error)
    {
      alert(error)
      alert("Transaction failed")
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fundsInput = event.target.funds.value;
    event.target.funds.value="";
    onAddBalance(fundsInput);
  };

  const handleSubmitOwner = (event) => {
    event.preventDefault();
    const fundsInputOwner = event.target.fundsOwner.value;
    event.target.fundsOwner.value="";
    onAddBalanceOwner(fundsInputOwner);
  };

  const handleChangeOwner = event => {
    if (event.target.checked) {
      setiswithdrawOwner(1);
    } else {
      setiswithdrawOwner(0);
    }
  };


  const handleChangeCounterParty = event => {
    if (event.target.checked) {
      setiswithdrawCounterParty(1);
    } else {
      setiswithdrawCounterParty(0);
    }
  };

  const onWithdraw = async () => {
    try{
      setLoading2(true)
      await withdrawContract(iswithdrawOwner,iswithdrawCounterParty)
      alert("Transaction succesful")
    }
    catch (error)
    {
      alert(error)
      alert("Transaction failed")
    }
    setLoading2(false)
  };

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div class="row">

      <div class="col-sm">
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div className="mt-2">
          <p> Owner </p>
        </div>
        <form onSubmit={handleSubmitOwner}>
            <label>
              Deposit Funds: {''}
              <input type="text" name="fundsOwner" defaultValue="" />
            </label> {''}
            <input type="submit" value="Submit" />
        </form>{"\n"}
        <div className="mt-2">
          <button type="button" onClick= {onClaimFundsOwner} className="btn btn-primary btn-lg">
            { loading1 ? "Loading..." : "Claim Funds"}        
          </button> {''} {''}
        </div>
        <label htmlFor="withdrawOwner">
            <input
            type="checkbox"
            value={iswithdrawOwner}
            onChange={handleChangeOwner}
            id="withdrawOwner"
            name="withdrawOwner"
            />
            Withdraw Contract
        </label>
      </div>
      </div>

      <div class="col-sm">
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div className="mt-2">
          <p> CounterParty </p>
        </div>
        <form onSubmit={handleSubmit}>
            <label>
              Deposit Funds: {''}
              <input type="text" name="funds" defaultValue="" />
            </label> {''}
            <input type="submit" value="Submit" />
        </form>{"\n"}
        <div className="mt-2">
          <button type="button" onClick= {onClaimFunds} className="btn btn-primary btn-lg">
            { loading ? "Loading..." : "Claim Funds"}        
          </button> {''}
        </div>
        <label htmlFor="withdrawCounterParty">
            <input
            type="checkbox"
            value={iswithdrawCounterParty}
            onChange={handleChangeCounterParty}
            id="withdrawCounterParty"
            name="withdrawCounterParty"
            />
            Withdraw Contract
        </label>

      </div>
      </div>
      
      </div> 

      <div class="row">
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div className="mt-2">
          <button type="button" onClick= {onWithdraw} className="btn btn-primary btn-lg">
            { loading2 ? "Loading..." : "Withdraw"}        
          </button> {''}
        </div>
      </div>
      </div> 
      </div>
    </div>
  );
};

export default App;
