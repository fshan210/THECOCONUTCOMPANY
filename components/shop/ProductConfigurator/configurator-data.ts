import type { ConfiguredVariant, ProcessingMethod, ProductSize, PulpOption } from "./configurator-types";

const productImage = "/assets/shop/products/IndividualProduct_CO-Water.png";
const sizes: ProductSize[] = [100, 200, 500];
const processing: ProcessingMethod[] = ["UHT", "RAW"];
const pulp: PulpOption[] = ["without-pulp", "with-pulp"];

export const configuredVariants: ConfiguredVariant[] = sizes.flatMap((sizeMl) => processing.flatMap((method) => pulp.map((pulpOption) => {
  const available = !(sizeMl === 100 && method === "RAW");
  const priceBase = sizeMl === 100 ? 35 : sizeMl === 200 ? 60 : 135;
  return {
    sizeMl,
    processing: method,
    pulp: pulpOption,
    sku: `CO-CW-${sizeMl}-${method}-${pulpOption === "with-pulp" ? "P" : "NP"}`,
    price: priceBase + (pulpOption === "with-pulp" ? 5 : 0),
    image: productImage,
    title: `.CO Coconut Water ${sizeMl}ml`,
    description: `${method} coconut water, ${pulpOption === "with-pulp" ? "with tender coconut pulp" : "without pulp"}.`,
    available,
    availabilityNote: available ? undefined : "100ml RAW is not part of the current production plan.",
  };
})));
