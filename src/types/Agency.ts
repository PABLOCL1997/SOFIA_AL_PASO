export default interface Agency {
  id: number;
  key: string;
  latitude: string;
  longitude: string;
  telephone: string;
  city: string;
  name: string;
  reference: string;
  street: string;
  horario_texto: string;
  isAgency?: boolean;
  __typename: string;
}
