import React, { FC } from "react";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import useUser from "../../../../hooks/useUser";
import ShippingOption from "./ShippingOption";
import { ShippingOptions } from "./types";

interface Props {
  isEmployee: boolean;
  isAgency: boolean;
  isDelivery: boolean;
  street: string;
  addressId: number | null;
  setShowNewAddress: Function;
}

const ChooseShipping: FC<Props> = ({ isEmployee, isAgency, isDelivery, street, addressId, setShowNewAddress }) => {
  const { toggleCityModal, showAddressInfo } = useUser();
  const { hasB2EAddress } = useCityPriceList();

  const deliverySelector = ".delivery";
  const pickupSelector = ".storePickup";

  const toggleAndClickSelector = (selector: string) => {
    toggleCityModal();
    // @ts-ignore
    document.querySelector(selector).click();
  };

  return (
    <React.Fragment>
      {hasB2EAddress ? (
        <ShippingOption
          option={ShippingOptions.Employee}
          title="Recibe en casa"
          description="Compra con descuento %"
          street={street}
          isSelected={isEmployee}
          onInfo={() => {
            showAddressInfo({
              variables: {
                user: {
                  addressInfo: street,
                  addressType: "Employee",
                },
              },
            });
          }}
          onSelect={() => toggleAndClickSelector(deliverySelector)}
          onAddAddress={() => toggleAndClickSelector(deliverySelector)}
        />
      ) : null}

      {hasB2EAddress ? null : (
        <ShippingOption
          option={ShippingOptions.Delivery}
          title="Recibe en casa"
          description="Compra sin descuento"
          street={street}
          isSelected={isDelivery}
          onInfo={() => {
            showAddressInfo({
              variables: {
                user: {
                  addressInfo: street,
                  addressType: "Delivery",
                },
              },
            });
          }}
          hasValidAddress={
            // check if user.userInfo[0].defaultAddressId has value then return true
            !!addressId
          }
          onSelect={() => toggleAndClickSelector(deliverySelector)}
          onAddAddress={() => {
            // @ts-ignore
            setShowNewAddress(true);
            document.querySelector("#nueva-direccion")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      )}

      <ShippingOption
        option={ShippingOptions.Pickup}
        title="Retira al paso"
        description="Compra sin descuento"
        street={street}
        isSelected={isAgency}
        onInfo={() => {
          showAddressInfo({
            variables: {
              user: {
                addressInfo: street,
                addressType: "Pickup",
              },
            },
          });
        }}
        onSelect={() => toggleAndClickSelector(pickupSelector)}
        onAddAddress={() => {
          setShowNewAddress(false);
          toggleAndClickSelector(pickupSelector);
        }}
      />
    </React.Fragment>
  );
};

export default ChooseShipping;
