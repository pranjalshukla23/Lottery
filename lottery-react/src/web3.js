import Web3 from "web3";

//request access to metamask connection
window.ethereum.request({ method: "eth_requestAccounts" });

//provide metamask provider as input to web3
const web3 = new Web3(window.ethereum);

//export web3 object
export default web3;
