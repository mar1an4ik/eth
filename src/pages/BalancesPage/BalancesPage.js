import { useEffect, useState } from "react";
import {
  infuraProvider,
  minABI,
  tokenAddresses,
  walletAddress
} from "../../constants/wallet";
import Web3 from "web3";
import { DataGrid } from "@material-ui/data-grid";
import { Loading, Title } from "../../styled-components";

const BalancesPage = props => {
  const [tokens, setTokens] = useState([]);
  const [etherium, setEtherium] = useState("");
  const Web3Client = new Web3(new Web3.providers.HttpProvider(infuraProvider));

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "coin", headerName: "Coin", width: 200 },
    { field: "value", headerName: "Amount", width: 300 }
  ];

  const getTokenBalance = async (tokenAddress) => {
    const contract = new Web3Client.eth.Contract(minABI, tokenAddress);
    const result = await contract.methods.balanceOf(walletAddress).call();
    const format = Web3Client.utils.fromWei(result);
    return format;
  };

  const setETHBalance = () => {
    Web3Client.eth.getBalance(walletAddress).then((result) => {
      setEtherium(Web3Client.utils.fromWei(result));
    });
  };

  const setAllTokens = async (tokenAddresses) => {
    let newData = [];
    let index = 0;
    for (const [key, value] of Object.entries(tokenAddresses)) {
      await getTokenBalance(value).then(response => {
        newData.push({
          "coin": key,
          "value": response,
          "id": index
        })
      });
      index++;
    }
    setTokens(newData);
  };

  useEffect(() => {
    setETHBalance();
    setAllTokens(tokenAddresses);
  }, [setAllTokens, setETHBalance]);

  return tokens.length && etherium
    ?
    <div className="balances-page">
      <Title>You have {etherium} Etherium</Title>
      <div style={{ height: "80vh", width: "100%" }}>
        <DataGrid rows={tokens} columns={columns}/>
      </div>
    </div>
    :
    <Loading>Getting data from all wallets...</Loading>
};

export default BalancesPage;
