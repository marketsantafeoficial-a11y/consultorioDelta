export function isSpaceResource(input: {
  fullName?: string | null;
  specialty?: string | null;
}) {
  const text = `${input.fullName ?? ""} ${input.specialty ?? ""}`.toLowerCase();

  return [
    "consultorio",
    "oficina",
    "sala",
    "modulo",
  ].some((keyword) => text.includes(keyword));
}
