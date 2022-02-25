import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler } from 'express';
import searchService from '@services/search-service';
import { ISearchResult } from '@models/search-model';


// Constants
const router = Router();
const { OK } = StatusCodes;

router.get('/:pattern', ((req: Request, res: Response) => {
    const pattern = req.params.pattern;
    //const pattern = "hamlet"
    const searchResult: ISearchResult = searchService.getAllMatches(pattern);
    return res.status(OK).json({searchResult});
}) as RequestHandler);

// Export default
export default router;
