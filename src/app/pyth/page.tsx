"use client";

import {
  useAuthenticate,
  useAuthModal,
  useSendUserOperation,
  useSignerStatus,
  useSmartAccountClient,
  useUser,
  useWaitForUserOperationTransaction,
} from "@account-kit/react";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { useState } from "react";
import { encodeFunctionData, parseEther } from "viem";

const abi = [
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "priceUpdate",
        type: "bytes[]",
      },
    ],
    name: "exampleMethod",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pythContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
] as const;

export default function Home() {
  const [result, setResult] = useState<string>("");
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const [price, setPrice] = useState<string | null>(null);
  const { client, isLoadingClient, address } = useSmartAccountClient({
    type: "LightAccount",
  });

  const [email, setEmail] = useState("");

  const {
    sendUserOperationAsync,
    isSendingUserOperation,
    sendUserOperationResult,
  } = useSendUserOperation({
    client,
    onSuccess: ({ hash, request }) => {
      setResult((prevResult) => prevResult + "\n\nTransaction hash:\n" + hash);
    },
    onError: (error) => {
      setResult("Error: " + error.message);
    },
  });

  const {
    waitForUserOperationTransaction,
    isWaitingForUserOperationTransaction,
  } = useWaitForUserOperationTransaction({
    client,
    onSuccess: async (hash) => {
      try {
        console.log(hash);
        setPrice(hash);

        // const receipt = await client.publicClient.waitForTransactionReceipt({
        //   hash,
        // });
        // if (receipt.status === "success") {
        //   const decodedLogs = decodeAbiParameters(
        //     [{ type: "int64", name: "price" }],
        //     receipt.logs[0].data as `0x${string}`,
        //   );
        //   const priceValue = decodedLogs[0];
        //   setPrice(priceValue.toString());
        // }
      } catch (error) {
        console.error("Error decoding transaction receipt:", error);
      }
    },
    onError: (error) => {
      console.error("Error waiting for transaction:", error);
    },
  });

  async function run() {
    // if (!user || !client) {
    //   setResult("Please connect your wallet first.");
    //   return;
    // }

    try {
      const connection = new EvmPriceServiceConnection(
        "https://hermes.pyth.network",
      );
      const priceIds = [
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace" as string,
      ];

      const priceFeedUpdateData = (await connection.getPriceFeedsUpdateData(
        priceIds,
      )) as `0x${string}`[];

      setResult(
        "Retrieved Pyth price update:\n" +
          JSON.stringify(priceFeedUpdateData, null, 2),
      );

      const contractAddress = process.env
        .NEXT_PUBLIC_DEPLOYMENT_ADDRESS as `0x${string}`;
      const encodedData = encodeFunctionData({
        abi: abi,
        functionName: "exampleMethod",
        args: [priceFeedUpdateData],
      });

      const { hash } = await sendUserOperationAsync({
        uo: {
          target: contractAddress,
          data: encodedData,
          value: parseEther("0.000000000001"),
        },
      });

      waitForUserOperationTransaction({
        hash: hash,
      });
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <input
        placeholder="enter your email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>

      {price && (
        <div className="mt-4 text-lg font-bold">Current Price: {price}</div>
      )}

      {/* <button onClick={() => {connectAsync({connector:})}}>
            Connect
        </button> */}
      {signerStatus.isInitializing ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p className="mb-4">Address as: {user.address ?? "Addy"}</p>
          <p className="mb-4">Connected as: {user.email ?? "Anonymous"}</p>
          <button
            onClick={run}
            disabled={isSendingUserOperation}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            {isSendingUserOperation
              ? "Sending..."
              : isWaitingForUserOperationTransaction
                ? "Waiting..."
                : "Send UO and wait for txn"}
          </button>
        </>
      ) : (
        <button
          onClick={openAuthModal}
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Connect Wallet
        </button>
      )}
      {result && (
        <pre className="mt-4 max-w-full overflow-auto rounded bg-gray-100 p-4">
          {result}
        </pre>
      )}
    </main>
  );
}
