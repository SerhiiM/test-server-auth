import React, { useState } from "react";
import axios from "axios";

function Account() {
  const [accountId, setAccountId] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/account/${accountId}`
      );
      setAccountInfo(response.data);
      setEditAddress(response.data.ownerAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/account/${accountId}`, {
        ownerAddress: editAddress,
      });
      setAccountInfo({ ...accountInfo, ownerAddress: editAddress });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Account Page</h2>
      <input
        type="text"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        placeholder="Enter Account ID (test: 12345)"
      />
      <button onClick={handleSearch}>Search</button>

      {accountInfo && (
        <div>
          <p>AccountId: {accountInfo.accountId}</p>
          <p>Owner First Name: {accountInfo.ownerFirstName}</p>
          <p>Owner Last Name: {accountInfo.ownerLastName}</p>
          <p>
            Owner Address:{" "}
            {isEditing ? (
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            ) : (
              accountInfo.ownerAddress
            )}
          </p>
          <p>Date Account Created: {accountInfo.dateCreated}</p>
          <p>Paid Account: {accountInfo.paidAccount ? "Yes" : "No"}</p>
          {isEditing ? (
            <button onClick={handleEdit}>Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
