/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ISearchResult } from '@models/search-model';
import { IPlayList, IPlays, IPlay } from '@models/play-model';
import {
  readFile,
} from 'node:fs/promises';
import lunr, { Builder } from 'lunr';

const playList: IPlayList = {
  isLoaded: false,
  isFilled: false,
  list: []
}

function load(): Promise<void> {
  return new Promise<void>((resolve) => {  
    if (!playList.isLoaded) {
      getPlaysList()
        .then(() => {
          if (!playList.isFilled) {
            createList()
              .then(() => {
                resolve();
              })
          } else {
            resolve();
          }
        });
    } else {
      resolve();
    }
  });
}

function getPlaysList(): Promise<void> {
  return new Promise<void>((resolve) => {   
    readFile('../data/plays.json', 'utf8')
      .then((text) => {
        playList.list = JSON.parse(text)
        playList.isLoaded = true;
        resolve()
      })  
  });
}

function createList(): Promise<void> {
  return new Promise<void>((resolve) => {    
    const playsPath = '../data/plays/';
    let counter = 0;
    playList.list.forEach(function (item: IPlay) {
      const path: string = playsPath + item.path
      readFile(path, 'utf8')
        .then((text) => {
          //console.log("readfile:" + path);
          item.text = text;
          counter++
          if (counter == playList.list.length) {
            playList.isFilled = true;
            resolve()
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
  
    playList.list.forEach(function (item) {
      builder.add(item)
    }, builder)
  }) 

  const matched = idx.search(pattern) as lunr.Index.Result[];
  return matched;
}

/**
 * Get all play list data
 * 
 * @returns  
 */
 export function getPlayList(): Promise<IPlays> {
  return new Promise<IPlays>((resolve) => { 
    load()
      .then(() => {
        resolve(playList.list)
      }) 
  })
}

/**
 * Get all matches
 * 
 * @returns 
 */
export function getAllMatches(pattern: string): Promise<ISearchResult> {
  return new Promise<ISearchResult>((resolve) => { 
    load()
      .then(() => {
        const matchedResults = getLunrMatches(pattern);
        const searchResult: ISearchResult = { 
            matched: matchedResults
        };
        resolve(searchResult)
      }) 
  })
}