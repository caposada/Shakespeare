/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ISearchResult } from '@models/search-model';
import { IPlays, IPlay } from '@models/play-model';
import {
  readFile,
} from 'node:fs/promises';
import lunr, { Builder } from 'lunr';

let list: IPlays = []
readFile('../data/plays.json', 'utf8')
  .then((text) => {
    list = JSON.parse(text)
    createList(list)
      .then((newList) => {
        list = newList;
      });
  }) 

function createList(list: IPlays): Promise<IPlays> {
  return new Promise<IPlays>((resolve) => {    
    const playsPath = '../data/plays/';
    let counter = 0;
    list.forEach(function (item: IPlay) {
      const path: string = playsPath + item.path
      readFile(path, 'utf8')
        .then((text) => {
          console.log("readfile:" + path);
          item.text = text;
          counter++
          if (counter == list.length) {
            resolve(list)
          }
        })  
    })      
  });
}

function getLunrMatches(pattern: string): lunr.Index.Result[] {
  const idx = lunr((builder: Builder) => {
    
    builder.ref('title')
    builder.field('title')
    builder.field('text')
    builder.metadataWhitelist = ['position']
  
    list.forEach(function (item) {
      builder.add(item)
    }, builder)
  }) 

  const matched = idx.search(pattern) as lunr.Index.Result[];
  return matched;
}

/**
 * Get all matches
 * 
 * @returns 
 */
function getAllMatches(pattern: string): ISearchResult {
  const matchedResults = getLunrMatches(pattern);
  const searchResult: ISearchResult = { 
      matched: matchedResults
  };
  return searchResult;
}

// Export default
export default {
    getAllMatches,
} as const;
