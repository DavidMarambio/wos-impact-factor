import mongooseService from "../../common/services/mongoose.service";
import { typePapers } from "../../common/types/papers.types";
import { CreatePaperDto } from "../dto/create.paper.dto";
import { PatchPaperDto } from "../dto/patch.paper.dto";
import { PutPaperDto } from "../dto/put.paper.dto";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

const typePaper = Object.keys(typePapers);

class PapersDao {
  papers: Array<CreatePaperDto> = [];
  Schema = mongooseService.getMongoose().Schema;

  paperSchema = new this.Schema(
    {
      year: {
        type: Number,
        required: true,
      },
      codeWos: {
        type: String,
        requiered: true,
        unique: true,
      },
      codeDoi: {
        type: String,
        requiered: true,
        unique: true,
      },
      typePaper: {
        type: String,
        enum: typePaper,
      },
      journalName: {
        type: String,
        required: true,
      },
      journalNumber: {
        type: Number,
      },
      journalVolume: {
        type: Number,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      chapterPage: {
        type: Number,
      },
      numberOfPages: {
        type: Number,
      },
      initialPage: {
        type: Number,
      },
      endPage: {
        type: Number,
      },
    },
    { versionKey: false }
  );

  Paper = mongooseService.getMongoose().model("Papers", this.paperSchema);

  constructor() {
    log("Created new instance of PapersDao");
  }

  async addPaper(paperFields: CreatePaperDto) {
    const paperId = shortid.generate();
    const paper = new this.Paper({
      _id: paperId,
      ...paperFields,
    });
    await paper.save();
    return paperId;
  }

  async getPapers(limit = 25, page = 0) {
    return this.Paper.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPapersByYear(year: number, limit = 25, page = 0) {
    return this.Paper.find({year: year})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPapersByCodeWos(codeWos: string, limit = 25, page = 0) {
    return this.Paper.find({codeWos: codeWos})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPapersByCodeDoi(codeDoi: string, limit = 25, page = 0) {
    return this.Paper.find({codeDoi: codeDoi})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPapersByTypePaper(typePaper: string, limit = 25, page = 0) {
    return this.Paper.find({typePaper: typePaper})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPapersByJournalName(journalName: string, limit = 25, page = 0) {
    return this.Paper.find({journalName: journalName})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getPaperById(paperId: string) {
    return this.Paper.findOne({ _id: paperId }).populate("Paper").exec();
  }

  async getPaperByTitle(title: string) {
    return this.Paper.findOne({ title: title }).exec();
  }

  async updatePaperById(paperId: string, paperFields: PatchPaperDto | PutPaperDto) {
    const existingPaper = await this.Paper.findOneAndUpdate(
      { _id: paperId },
      { $set: paperFields },
      { new: true }
    ).exec();
    return existingPaper;
  }

  async removePaperById(paperId: string) {
    return this.Paper.deleteOne({ _id: paperId }).exec();
  }
}

export default new PapersDao();
