import React, { useState } from "react";

const AddressForm = () => {
  const [presentAddress, setPresentAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  // Handle change for Present Address
  const handlePresentAddressChange = (e) => {
    const { name, value } = e.target;
    setPresentAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Handle change for Permanent Address
  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;
    setPermanentAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Handle the 'Same as Present Address' checkbox
  const handleSameAddressChange = (e) => {
    setIsSameAddress(e.target.checked);
    if (e.target.checked) {
      setPermanentAddress(presentAddress); // Copy present address to permanent address
    } else {
      setPermanentAddress({ street: "", city: "", state: "", zip: "" }); // Clear permanent address
    }
  };

  return (
    <div>
      {/* Present Address Form */}
      <h2>Present Address</h2>
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={presentAddress.street}
        onChange={handlePresentAddressChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={presentAddress.city}
        onChange={handlePresentAddressChange}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={presentAddress.state}
        onChange={handlePresentAddressChange}
      />
      <input
        type="text"
        name="zip"
        placeholder="Zip"
        value={presentAddress.zip}
        onChange={handlePresentAddressChange}
      />

      {/* Checkbox for Same Address */}
      <div>
        <input
          type="checkbox"
          id="sameAddress"
          checked={isSameAddress}
          onChange={handleSameAddressChange}
        />
        <label htmlFor="sameAddress">Same as Present Address</label>
      </div>

      {/* Permanent Address Form */}
      <h2>Permanent Address</h2>
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={permanentAddress.street}
        onChange={handlePermanentAddressChange}
        disabled={isSameAddress} // Disable fields if checkbox is checked
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={permanentAddress.city}
        onChange={handlePermanentAddressChange}
        disabled={isSameAddress}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={permanentAddress.state}
        onChange={handlePermanentAddressChange}
        disabled={isSameAddress}
      />
      <input
        type="text"
        name="zip"
        placeholder="Zip"
        value={permanentAddress.zip}
        onChange={handlePermanentAddressChange}
        disabled={isSameAddress}
      />
    </div>
  );
};

export default AddressForm;
