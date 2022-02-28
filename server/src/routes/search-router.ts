import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler } from 'express';
import { getPlayList, getAllMatches } from '@services/search-service';
import { ISearchResult } from '@models/search-model';
import { IPlays } from '@models/play-model';

// Constants
const router = Router();
const { OK } = StatusCodes;

router.get('/', ((req: Request, res: Response) => {
    getPlayList()
        .then((plays: IPlays) => {
            res.status(OK).json({plays});    
        })
}) as RequestHandler);

router.get('/:pattern', ((req: Request, res: Response) => {
    const pattern: string = req.params.pattern;
    getAllMatches(pattern)
        .then((searchResult: ISearchResult) => {
            res.status(OK).json({searchResult});    
        })
}) as RequestHandler);

// Export default
export default router;
