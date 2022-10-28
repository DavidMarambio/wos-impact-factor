import express from "express";
import papersService from "../services/papers.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:papers-controller");
class PapersMiddleware {
  async validateRequiredPaperBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.year && req.body.codeWos && req.body.codeDoi && req.body.journalName && req.body.title) {
      next();
    } else {
        const fields = [{year: req.body.year, codeWos: req.body.codeWos, codeDoi: req.body.codeDoi, journalName: req.body.journalName, title: req.body.title}];
        fields.forEach((field,index) => {
            switch (field) {
                case null:
                    res.status(400).send({ error: `Missing required field ${index}` });
                    break;
            }
        })
      res
        .status(400)
        .send({ error: "Missing required fields" });
    }
  }

  async validateSamePaperTitleDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const paper = await papersService.getPaperByTitle(req.body.title);
    if (paper) {
      res.status(400).send({
        error: "Paper title already exists",
      });
    } else {
      next();
    }
  }

  async validateSamePaperCodeWosDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const paper = await papersService.getPapersByCodeWos(req.body.codeWos);
    if (paper) {
      res.status(400).send({
        error: "Paper code WoS already exists",
      });
    } else {
      next();
    }
  }

  async validateSamePaperCodeDoiDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const paper = await papersService.getPapersByCodeDoi(req.body.codeDoi);
    if (paper) {
      res.status(400).send({
        error: "Paper code DOI already exists",
      });
    } else {
      next();
    }
  }

  async validateSameTitleBelongToSamePaper(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.paper._id === req.params.paperId) {
      next();
    } else {
      res.status(400).send({
        error: "Invalid title",
      });
    }
  }

  async validateSameCodeWosBelongToSamePaper(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.paper._id === req.params.paperId) {
      next();
    } else {
      res.status(400).send({
        error: "Invalid Code Wos",
      });
    }
  }

  async validateSameCodeDoiBelongToSamePaper(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.paper._id === req.params.paperId) {
      next();
    } else {
      res.status(400).send({
        error: "Invalid Code DOI",
      });
    }
  }

  async validatePatchPaperTitle(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.title) {
      log("Validating title", req.body.title);
      this.validateSameTitleBelongToSamePaper(req, res, next);
    } else {
      next();
    }
  }

  async validatePatchPaperCodeWos(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.codeWos) {
      log("Validating code Wos", req.body.codeWos);
      this.validateSameCodeWosBelongToSamePaper(req, res, next);
    } else {
      next();
    }
  }

  async validatePatchPaperCodeDoi(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.codeDoi) {
      log("Validating code DOI", req.body.codeDoi);
      this.validateSameCodeDoiBelongToSamePaper(req, res, next);
    } else {
      next();
    }
  }

  async validatePaperExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const paper = await papersService.readById(req.params.paperId);
    if (paper) {
      res.locals.paper = paper;
      next();
    } else {
      res.status(404).send({ error: `Paper ${req.params.paperId} not found` });
    }
  }

  async extractPaperId(
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.paperId;
    next();
  }
}
export default new PapersMiddleware();
