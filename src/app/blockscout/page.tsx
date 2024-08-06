"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Chain = { id: string; name: string; url: string };

const chains: Chain[] = [
  { id: "eth", name: "Ethereum Mainnet", url: "https://eth.blockscout.com" },
  {
    id: "goerli",
    name: "Goerli Testnet",
    url: "https://eth-goerli.blockscout.com",
  },
  {
    id: "sepolia",
    name: "Sepolia Testnet",
    url: "https://eth-sepolia.blockscout.com",
  },
  { id: "gnosis", name: "Gnosis Chain", url: "https://gnosis.blockscout.com" },
  { id: "optimism", name: "Optimism", url: "https://optimism.blockscout.com" },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    url: "https://arbitrum.blockscout.com",
  },
];

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [addressInfo, setAddressInfo] = useState<any | null>(null);
  const [txInfo, setTxInfo] = useState<any | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | undefined>(
    chains[0],
  );

  const fetchAddressInfo = async () => {
    if (selectedChain) {
      try {
        const response = await fetch(
          `${selectedChain.url}/api?module=account&action=balance&address=${address}`,
        );
        const data = await response.json();
        setAddressInfo(data);
      } catch (error) {
        console.error("Error fetching address info:", error);
      }
    }
  };

  const fetchTxInfo = async () => {
    if (selectedChain) {
      try {
        const response = await fetch(
          `${selectedChain.url}/api?module=transaction&action=gettxinfo&txhash=${txHash}`,
        );
        const data = await response.json();
        setTxInfo(data);
      } catch (error) {
        console.error("Error fetching transaction info:", error);
      }
    }
  };

  const verifyContract = async () => {
    if (selectedChain) {
      alert(
        `Contract verification would be implemented here using Blockscout API for ${selectedChain.name}`,
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Blockscout Explorer</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Chain Selection</CardTitle>
          <CardDescription>Choose the blockchain network</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) =>
              setSelectedChain(
                chains.find((chain) => chain.id === value) ?? chains[0],
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a chain" />
            </SelectTrigger>
            <SelectContent>
              {chains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Address Explorer</CardTitle>
          <CardDescription>
            Check address balance on {selectedChain?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={fetchAddressInfo}>Fetch</Button>
          </div>
          {addressInfo && (
            <div className="mt-4">
              <p>
                Balance: {formatEther(BigInt(addressInfo.result))}{" "}
                {selectedChain?.id.toUpperCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transaction Explorer</CardTitle>
          <CardDescription>
            Check transaction details on {selectedChain?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter transaction hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
            <Button onClick={fetchTxInfo}>Fetch</Button>
          </div>
          {txInfo && (
            <div className="mt-4">
              <p>From: {txInfo.result.from}</p>
              <p>To: {txInfo.result.to}</p>
              <p>
                Value: {formatEther(BigInt(txInfo.result.value))}{" "}
                {selectedChain?.id.toUpperCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Verification</CardTitle>
          <CardDescription>
            Verify smart contract on {selectedChain?.name} using Blockscout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={verifyContract}>Verify Contract</Button>
        </CardContent>
      </Card>
    </div>
  );
}
