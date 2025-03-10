import React, { useState } from "react";

interface BidAuctionProps {
  auctionId: number;
  currentBid: number;
  onBidSuccess: () => void;
}

const BidAuction: React.FC<BidAuctionProps> = ({ auctionId, currentBid }) => {
  const [bidAmount, setBidAmount] = useState(currentBid + 1);
  const [message, setMessage] = useState("");

  const handleBid = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `https://car-auction-backend.onrender.com/api/auctions/${auctionId}/bid/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bid_amount: bidAmount }),
      }
    );

    if (response.ok) {
      setMessage("Bid placed successfully!");
    } else {
      const data = await response.json();
      setMessage(data.error || "Failed to place bid.");
    }
  };

  return (
    <div>
      <h2>Current Bid: £{currentBid}</h2>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        min={currentBid + 1}
      />
      <button onClick={handleBid}>Place Bid</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BidAuction;
