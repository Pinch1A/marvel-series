export interface Character {
  id: number | string;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  series?: {
    items: {
      name: string;
    }[];
  };
  stories?: {
    items: {
      name: string;
    }[];
  };
}

export interface Series {
  id: number;
  title: string;
  characters: {
    available: number;
    collectionURI: string;
    returned: number;
    items: {
      resourceURI: string;
      name: string;
    }[];
  };
}

export interface FetchSeriesParams {
  titleStartsWith?: string;
}

export interface ResponseData<T> {
  count: number;
  limit: number;
  offset: number;
  results: T[];
  total: number;
}

export interface CharacterLink {
  id?: string;
  source: string;
  target: string;
  type: 'series' | 'story';
  font?: {
    size: number;
  }
}
