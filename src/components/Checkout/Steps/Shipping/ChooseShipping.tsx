import React, { FC } from "react";
import { OrderType } from "../../../../types/Order";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import useUser from "../../../../hooks/useUser";
import ShippingOption from "./ShippingOption";
import { ShippingOptions } from "./types";

const ChooseShipping: FC<{
  street: string;
  addressId: number | null;
  showNewAddress: boolean;
}> = ({ street, addressId, showNewAddress }) => {
  const { toggleCityModal, showAddressInfo, store } = useUser();
  const { hasB2EAddress } = useCityPriceList();

  const deliverySelector = ".delivery";
  const pickupSelector = ".storePickup";
  const expressSelector = ".storeExpress";

  const toggleAndClickSelector = (selector: string) => {
    toggleCityModal();
    // @ts-ignore
    document?.querySelector(selector)?.click();
  };

  return (
    <React.Fragment>
      {hasB2EAddress ? (
        <ShippingOption
          option={ShippingOptions.Employee}
          title="Recibe en casa"
          description="Compra con descuento %"
          street={street}
          isSelected={store === ("B2E" as OrderType)}
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
          title="Verifica tu información"
          description="Compra sin descuento"
          street={street}
          isSelected={store === ("ECOMMERCE" as OrderType)}
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
            toggleAndClickSelector(deliverySelector);
            if (showNewAddress) document.querySelector("#nueva-direccion")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      )}

      {/* <ShippingOption
        option={ShippingOptions.Express}
        title="Envío express"
        description="Recibe en casa"
        street={street}
        isSelected={store === ("EXPRESS" as OrderType)}
        onInfo={() => toggleAndClickSelector(expressSelector)}
        onSelect={() => toggleAndClickSelector(expressSelector)}
        onAddAddress={() => toggleAndClickSelector(expressSelector)}
      />

      <ShippingOption
        option={ShippingOptions.Pickup}
        title="Retira al paso"
        description="Compra sin descuento"
        street={street}
        isSelected={store === ("PICKUP" as OrderType)}
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
          toggleAndClickSelector(pickupSelector);
        }}
      /> */}
    </React.Fragment>
  );
};

export default ChooseShipping;
