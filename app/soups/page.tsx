import soups from "../data/soups.json";
import SoupsClient from "./SoupsClient";

type Soup = {
  id: string;
  title: string;
  surface: string;
  solution: string;
  winKeywords?: string[];
  yesKeywords?: string[];
  noKeywords?: string[];
  nearKeywords?: string[];
};

export default async function SoupsPage() {
  const allSoups = soups as Soup[];
  return <SoupsClient allSoups={allSoups} />;
}