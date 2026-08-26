export const VEHICLE_TYPE_GROUPS = [
  {
    group: "Private Vehicle",
    options: [
      { value: "car", label: "Car" },
      { value: "bike", label: "Bike" },
      { value: "van", label: "Van" },
      { value: "private_bus", label: "Private Bus (chartered/hired coach)" },
    ],
  },
  {
    group: "Public Transport",
    options: [
      { value: "public_bus", label: "Public Bus" },
      { value: "train", label: "Train" },
    ],
  },
];
export const VEHICLE_TYPE_OPTIONS = VEHICLE_TYPE_GROUPS.flatMap((g) => g.options);
