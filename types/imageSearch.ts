import { useState } from 'react';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PROGRAMMABLE_SEARCH_ENGINE_KEY;
const CX_ID = process.env.EXPO_PUBLIC_GOOGLE_PROGRAMMABLE_SEARCH_ENGINE_ID;

export type SearchImageResult = {
  urls: string[];
  loading: boolean;
  error: string | null;
};

export async function searchImage(searchTerm: string): Promise<string[]> {
  if (!searchTerm) return [];
  if (!API_KEY || !CX_ID) {
    console.warn("API Key or CX ID is not configured.");
    return [];
  }

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  } as RequestInit;

  const query = encodeURIComponent(searchTerm.toLowerCase() + " food");
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${query}&searchType=image&safe=active&num=3&rights=cc_publicdomain,cc_attribute,cc_sharealike`;

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (result.items && result.items.length > 0) {
      return result.items.map((item: any) => item.link);
    } else {
      console.log("No images found for:", searchTerm);
      return [];
    }
  } catch (fetchError) {
    console.error("Fetch Error:", fetchError);
    return [];
  }
}

export function useImageSearch(initialSearchTerm: string = ""): [
  SearchImageResult,
  (term: string) => void
] {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (term: string) => {
    if (!term) {
      setUrls([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const imageUrls = await searchImage(term);
      setUrls(imageUrls);
      if (imageUrls.length === 0) {
        setError("No images found.");
      }
    } catch (err) {
      setError("Failed to fetch images.");
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  return [{ urls, loading, error }, search];
} 