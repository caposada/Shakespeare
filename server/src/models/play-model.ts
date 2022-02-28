export interface IAuthor {
    firstName: string,
    lastName: string    
}

export interface IPlay {
    title: string,
    author: IAuthor,
    path: string,
    text?: string
}

export type IPlays = Array<IPlay>

export interface IPlayList {
    isLoaded: boolean,
    isFilled: boolean,
    list: IPlays
}