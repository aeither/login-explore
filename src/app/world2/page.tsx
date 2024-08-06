"use client";

import { useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { parseEther, formatEther } from "viem";

export default function Home() {
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null,
  );
  const [claimAmount, setClaimAmount] = useState<string | null>(null);

  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const handleVerify = async (proof: any) => {
    // In a real application, you would send this proof to your backend for verification
    console.log("Proof:", proof);
    setVerificationResult("Verification successful!");

    // Simulate UBI token claim
    const randomAmount = parseEther((Math.random() * 10).toFixed(2));
    setClaimAmount(formatEther(randomAmount));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Decentralized UBI Distribution Platform
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Verify Your Identity</CardTitle>
          <CardDescription>
            Use World ID to prove your uniqueness and claim your UBI tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <IDKitWidget
            action={action}
            app_id={app_id}
            onSuccess={handleVerify}
            handleVerify={handleVerify}
          >
            {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
          </IDKitWidget>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{verificationResult}</p>
          </CardContent>
        </Card>
      )}

      {claimAmount && (
        <Card>
          <CardHeader>
            <CardTitle>UBI Claim</CardTitle>
            <CardDescription>
              Your UBI tokens have been distributed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{claimAmount} UBI Tokens</p>
            <p className="mt-2">
              These tokens have been added to your account. Use them wisely!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
