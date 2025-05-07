import { v4 as uuidv4 } from "uuid";

export type KeywordType = {
  id: string;
  keyword: string;
};

export function createKeyword(keyword: string): KeywordType {
  return {
    id: uuidv4(),
    keyword,
  };
}

  