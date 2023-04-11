import { tezos } from "./tezos";
import { wallet } from "./wallet";

export const claimFundsOperation = async () => {
    try
    {
        const contract= await tezos.wallet.at("KT1XPG8RDjH6K2yvZpzXVwYrmH6xzgTeUmgc")
        const storage = await contract.storage();
        const account = await wallet.client.getActiveAccount();

        if (account.address != storage.counterparty)
        {
            throw "Sender is not the CounterParty";
        }

        if (storage.authorizedAdmin != 0)
        {
            throw "Admin has authorized withdrawal";
        }

        const packedBytes = "01223344"
        const op = await contract.methods.claimCounterparty(packedBytes).send();
        await op.confirmation(1);

    }
    catch(err)
    {
        throw err;
    }
};

export const claimFundsOperationOwner = async () => {
  try
  {
    const contract= await tezos.wallet.at("KT1XPG8RDjH6K2yvZpzXVwYrmH6xzgTeUmgc")
    const storage = await contract.storage();
    const account = await wallet.client.getActiveAccount();

    if (account.address != storage.owner)
    {
        throw "Sender is not the Owner";
    }

    if (storage.authorizedAdmin != 0)
    {
        throw "Admin has authorized withdrawal";
    }

    const op = await contract.methods.claimOwner().send();
    await op.confirmation(1);

  }
  catch(err)
  {
      throw err;
  }
};

export const addBalanceOperation = async (amount) => {
    try
    {
        const contract= await tezos.wallet.at("KT1XPG8RDjH6K2yvZpzXVwYrmH6xzgTeUmgc")
        const storage = await contract.storage();
        const account = await wallet.client.getActiveAccount();

        if (account.address != storage.counterparty)
        {
            throw "Sender is not the CounterParty";
        }

        if (storage.authorizedAdmin != 0)
        {
            throw "Admin has authorized withdrawal";
        }

        const op = await contract.methods.addBalanceCounterparty().send({
            amount: amount,
            mutez: false,

        })
        await op.confirmation(1);

    }
    catch(err)
    {
        throw err;
    }
};

export const addBalanceOperationOwner = async (amount) => {
  try
  {
    const contract= await tezos.wallet.at("KT1XPG8RDjH6K2yvZpzXVwYrmH6xzgTeUmgc")
    const storage = await contract.storage();
    const account = await wallet.client.getActiveAccount();

    if (account.address != storage.owner)
    {
        throw "Sender is not the Owner";
    }

    if (storage.authorizedAdmin != 0)
    {
        throw "Admin has authorized withdrawal";
    }

    const op = await contract.methods.addBalanceOwner().send({
        amount: amount,
        mutez: false,

    })
    await op.confirmation(1);

  }
  catch(err)
  {
      throw err;
  }
};

export const withdrawContract = async (checkOwner,checkCounterParty) => {
    try
    {
        const contract= await tezos.wallet.at("KT1XPG8RDjH6K2yvZpzXVwYrmH6xzgTeUmgc")
        const storage = await contract.storage();
        const account = await wallet.client.getActiveAccount();
        if (checkOwner!=1)
        {
            throw "Owner does not agree to withdraw";
        }
        if (checkCounterParty!=1)
        {
            throw "Counterparty does not agree to withdraw";
        }

        const op = await contract.methods.withdraw(checkOwner, checkCounterParty).send();
        await op.confirmation(1);
  
    }
    catch(err)
    {
        throw err;
    }
  };
